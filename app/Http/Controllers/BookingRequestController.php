<?php

namespace App\Http\Controllers;

use App\Enums\BookingRequestStatus;
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
        $bookingRequests = BookingRequest::query()
            ->where('user_id', $request->user()->id)
            ->with(['vehicle', 'serviceType', 'booking'])
            ->latest()
            ->paginate(10)
            ->withQueryString();

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

        /*
         * Customer belum punya kendaraan terpilih:
         * daftarkan kendaraan baru dari input form.
         */
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

        if (! $booking) {
            /*
             * Semua mekanik bentrok pada waktu tersebut:
             * pengajuan tetap tersimpan sebagai antrean.
             */
            return to_route('service-requests.index')->with(
                'success',
                'Semua mekanik sedang terisi pada waktu tersebut. Pengajuan Anda masuk daftar antrean.'
            );
        }

        /*
         * Langsung arahkan customer ke halaman pembayaran
         * DP di Xendit. Kalau pembuatan invoice gagal,
         * order tetap tersimpan dan DP bisa dibayar
         * belakangan dari daftar pesanan.
         */
        try {
            $payment = XenditService::createInvoice($booking);
        } catch (\Throwable $e) {
            report($e);

            return to_route('service-requests.index')->with(
                'success',
                "Order {$booking->booking_code} berhasil dibuat. Lanjutkan pembayaran DP dari daftar pesanan Anda."
            );
        }

        session()->flash(
            'success',
            "Order {$booking->booking_code} dibuat. Silakan selesaikan pembayaran DP untuk mengunci jadwal."
        );

        return Inertia::location($payment->payment_url);
    }
}
