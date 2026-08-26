<?php

namespace App\Http\Controllers;

use App\Enums\BookingRequestStatus;
use App\Enums\UserRole;
use App\Http\Requests\StoreBookingRequestRequest;
use App\Models\BookingRequest;
use App\Models\ServiceType;
use App\Models\Vehicle;
use App\Services\Booking\ProcessBookingRequest;
use App\Services\Xendit\XenditService;
use Illuminate\Http\Request;
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
        $bookingRequests = null;
        $withRelations = ['vehicle', 'serviceType', 'booking', 'user'];


        if ($user->role == UserRole::ADMIN) {
            $bookingRequests = BookingRequest::query()
                ->with($withRelations)
                ->latest()
                ->paginate(10)
                ->withQueryString();
        }
        if ($user->role == UserRole::CUSTOMER) {
            $bookingRequests = BookingRequest::query()
                ->where('user_id', $request->user()->id)
                ->with($withRelations)
                ->latest()
                ->paginate(10)
                ->withQueryString();
        }

        return Inertia::render('ServiceRequests/Index', [
            'bookingRequests' => $bookingRequests,
        ]);
    }

    /**
     * Form pengajuan servis: kendaraan, jenis servis,
     * tanggal & jam.
     */
    public function create(Request $request): Response
    {
        return Inertia::render('ServiceRequests/Create', [
            'vehicles' => Vehicle::query()
                ->where('user_id', $request->user()->id)
                ->orderBy('brand')
                ->get(),

            'serviceTypes' => ServiceType::query()
                ->where('is_active', true)
                ->orderBy('name')
                ->get(),
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

        if (empty($data['vehicle_id'])) {
            $vehicle = Vehicle::create([
                'user_id' => $request->user()->id,

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
            'user_id' => $request->user()->id,
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
            $payment = XenditService::createInvoice($booking);

            /*
         * Simpan informasi payment.
         */
            $booking->payment()->create([
                'payment_method' => 'xendit',
                'order_id' => $booking->booking_code,
                'amount' => $booking->dp_amount,
                'payment_url' => $payment->payment_url,
                'status' => 'pending',
            ]);
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
}