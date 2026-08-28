<?php

namespace App\Http\Controllers;

use App\Enums\BookingRequestStatus;
use App\Enums\BookingStatus;
use App\Enums\PaymentStatus;
use App\Enums\UserRole;
use App\Http\Requests\StoreBookingRequestRequest;
use App\Models\Booking;
use App\Models\BookingRequest;
use App\Models\ServiceType;
use App\Models\User;
use App\Models\Vehicle;
use App\Services\Booking\ProcessBookingRequest;
use App\Services\Xendit\XenditService;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class BookingRequestController extends Controller
{
    /**
     * Daftar pengajuan servis milik customer
     * beserta order yang dihasilkan.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        $search = $request->string('search')->trim()->toString();
        $status = BookingRequestStatus::tryFrom(
            $request->string('status')->trim()->toString()
        );
        $withRelations = ['vehicle', 'serviceType', 'booking', 'user'];
        $bookingRequests = BookingRequest::query()
            ->with($withRelations)
            ->when(
                $user->role === UserRole::CUSTOMER,
                fn($query) => $query->where('user_id', $user->id)
            )
            ->when($search, function ($query) use ($search, $user) {
                $query->where(function ($query) use ($search, $user) {
                    $query
                        ->orWhereHas('vehicle', function ($query) use ($search) {
                            $query
                                ->where('license_plate', 'like', "%{$search}%")
                                ->orWhere('brand', 'like', "%{$search}%")
                                ->orWhere('model', 'like', "%{$search}%");
                        })
                        ->orWhereHas('serviceType', function ($query) use ($search) {
                            $query->where('name', 'like', "%{$search}%");
                        });

                    if ($user->role === UserRole::ADMIN) {
                        $query->orWhereHas('user', function ($query) use ($search) {
                            $query
                                ->where('name', 'like', "%{$search}%")
                                ->orWhere('email', 'like', "%{$search}%");
                        });
                    }
                });
            })
            ->when($status, fn($query) => $query->where('status', $status))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('ServiceRequests/Index', [
            'bookingRequests' => $bookingRequests,
            'filters' => [
                'search' => $search,
                'status' => $status?->value,
            ],
        ]);
    }

    /**
     * Form pengajuan servis: kendaraan, jenis servis,
     * tanggal & jam.
     */
    public function create(Request $request): Response
    {
        $user = $request->user();
        $serviceTypes = ServiceType::query()
            ->where('is_active', true)
            ->orderBy('name')
            ->get();

        if ($user->role === UserRole::ADMIN) {
            return Inertia::render('ServiceRequests/Create', [
                'vehicles' => [],
                'serviceTypes' => $serviceTypes,
                'customers' => User::query()
                    ->where('role', UserRole::CUSTOMER)
                    ->with(['vehicles' => fn($query) => $query->orderBy('brand')->orderBy('model')])
                    ->orderBy('name')
                    ->get(),
            ]);
        }

        return Inertia::render('ServiceRequests/Create', [
            'vehicles' => Vehicle::query()
                ->where('user_id', $user->id)
                ->orderBy('brand')
                ->get(),
            'serviceTypes' => $serviceTypes,
            'customers' => [],
        ]);
    }

    /**
     * Simpan pengajuan servis. Data masuk ke booking_requests,
     * lalu langsung diproses menjadi order (bookings) bila
     * ada mekanik yang tersedia.
     */
    public function store(
        StoreBookingRequestRequest $request,
        ProcessBookingRequest $processBookingRequest
    ) {
        $data = $request->validated();
        $targetUserId = $request->user()->role === UserRole::ADMIN
            ? (int) $data['user_id']
            : $request->user()->id;

        if (empty($data['vehicle_id'])) {
            $vehicle = Vehicle::create([
                'user_id' => $targetUserId,

                'license_plate' => strtoupper(
                    trim($data['vehicle']['license_plate'])
                ),

                'brand' => $data['vehicle']['brand'],
                'model' => $data['vehicle']['model'],
                'vehicle_type' => $data['vehicle']['vehicle_type'],
                'year' => $data['vehicle']['year'] ?? null,
            ]);

            $data['vehicle_id'] = $vehicle->id;
        }

        $bookingRequest = BookingRequest::create([
            'user_id' => $targetUserId,
            'vehicle_id' => $data['vehicle_id'],
            'service_type_id' => $data['service_type_id'],
            'requested_start_at' => $data['requested_start_at'],
            'status' => BookingRequestStatus::WAITING,
        ]);

        $booking = $processBookingRequest->execute(
            $bookingRequest
        );

        /*
     * Tidak mendapatkan slot.
     */
        if (! $booking) {
            return to_route(
                'customer.service-requests.index'
            )->with(
                'success',
                'Waktu yang dipilih sedang penuh. Pengajuan Anda masuk ke daftar antrean.'
            );
        }

        /*
     * Pada titik ini:
     *
     * booking_request = processing
     * booking         = pending_payment
     *
     * Slot sudah di-reserve.
     */

        try {
            $payment = $this->createOrReusePendingPayment($booking);
        } catch (\Throwable $e) {
            report($e);

            /*
         * Karena invoice gagal dibuat,
         * jangan biarkan slot menggantung.
         */
            $booking->update([
                'status' => 'expired',
            ]);

            $booking->bookingRequest()->update([
                'status' => BookingRequestStatus::WAITING,
                'failure_reason' =>
                'Gagal membuat pembayaran.',
            ]);

            return to_route(
                'customer.service-requests.index'
            )->with(
                'error',
                'Pembayaran gagal dibuat. Silakan coba kembali.'
            );
        }

        return Inertia::location(
            $payment->payment_url
        );
    }

    public function updateStatus(
        Request $request,
        BookingRequest $bookingRequest,
        ProcessBookingRequest $processBookingRequest
    ): RedirectResponse {
        $data = $request->validate([
            'status' => ['required', 'string', 'in:processing,cancelled'],
        ]);

        $bookingRequest->loadMissing('booking.payment');

        if ($bookingRequest->status !== BookingRequestStatus::WAITING) {
            return back()->with(
                'error',
                'Hanya pengajuan dengan status menunggu yang bisa diubah.'
            );
        }

        if ($data['status'] === BookingRequestStatus::CANCELLED->value) {
            $bookingRequest->update([
                'status' => BookingRequestStatus::CANCELLED,
                'mechanic_user_id' => null,
                'requested_end_at' => null,
                'failure_reason' => 'Pengajuan dibatalkan oleh admin.',
            ]);

            return back()->with(
                'success',
                'Status pengajuan servis berhasil diubah menjadi dibatalkan.'
            );
        }

        $booking = $processBookingRequest->execute($bookingRequest);

        if (! $booking) {
            return back()->with(
                'error',
                'Pengajuan belum bisa diproses karena slot mekanik belum tersedia.'
            );
        }

        try {
            $this->createOrReusePendingPayment($booking);
        } catch (\Throwable $e) {
            report($e);

            $booking->update([
                'status' => BookingStatus::EXPIRED,
            ]);

            $booking->bookingRequest()->update([
                'status' => BookingRequestStatus::WAITING,
                'failure_reason' => 'Gagal membuat pembayaran.',
            ]);

            return back()->with(
                'error',
                'Invoice pembayaran gagal dibuat. Status dikembalikan ke menunggu.'
            );
        }

        return back()->with(
            'success',
            'Status pengajuan servis berhasil diubah menjadi menunggu pembayaran.'
        );
    }

    private function createOrReusePendingPayment(Booking $booking)
    {
        $payment = $booking->payment()
            ->where('status', PaymentStatus::PENDING)
            ->where('expired_at', '>', now())
            ->latest()
            ->first();

        if ($payment) {
            return $payment;
        }

        return XenditService::createInvoice($booking);
    }
}
