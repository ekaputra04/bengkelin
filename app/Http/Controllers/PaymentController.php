<?php

namespace App\Http\Controllers;

use App\Enums\BookingRequestStatus;
use App\Enums\BookingStatus;
use App\Enums\PaymentStatus;
use App\Models\Booking;
use App\Models\BookingRequest;
use App\Models\Payment;
use App\Models\WebhookLog;
use App\Services\Xendit\XenditService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PaymentController extends Controller
{
    /**
     * Buat (atau pakai ulang) invoice DP Xendit,
     * lalu arahkan customer ke link pembayarannya.
     */
    public function pay(Request $request, Booking $booking)
    {
        abort_unless(
            $booking->user_id === $request->user()->id,
            403
        );

        if ($booking->status !== BookingStatus::PENDING_PAYMENT) {
            return back()->with(
                'error',
                "Pesanan {$booking->booking_code} tidak sedang menunggu pembayaran."
            );
        }

        /*
         * Invoice yang masih aktif dipakai ulang agar
         * tidak menumpuk tagihan duplikat.
         */
        $payment = $booking->payment()
            ->where('status', PaymentStatus::PENDING)
            ->where('expired_at', '>', now())
            ->latest()
            ->first();

        if (! $payment) {
            $payment = XenditService::createInvoice($booking);
        }

        /*
         * Inertia::location() agar tombol Bayar DP (request
         * XHR Inertia) bisa membawa browser ke halaman
         * checkout Xendit — redirect()->away() biasa tidak
         * bisa diikuti oleh fetch.
         */
        return Inertia::location($payment->payment_url);
    }

    /**
     * Callback dari Xendit: verifikasi x-callback-token,
     * catat ke webhook_logs, lalu sinkronkan status
     * payment dan booking.
     */
    public function webhook(Request $request): JsonResponse
    {
        $isValid = hash_equals(
            (string) config('services.xendit.webhook_secret'),
            (string) $request->header('x-callback-token')
        );

        $payload = $request->json()->all();

        $payment = Payment::query()
            ->where('transaction_id', $payload['id'] ?? '')
            ->orWhere('order_id', $payload['external_id'] ?? '')
            ->first();

        $log = WebhookLog::create([
            'payment_id' => $payment?->id,

            'event_type' => match ($payload['status'] ?? null) {
                'PAID' => 'invoice.paid',
                'EXPIRED' => 'invoice.expired',
                default => 'invoice.unknown',
            },

            'transaction_id' => $payload['id'] ?? null,
            'signature' => $request->header('x-callback-token'),
            'payload' => $payload,
            'is_valid' => $isValid,
        ]);

        if (! $isValid) {
            return response()->json(
                ['message' => 'Invalid callback token.'],
                401
            );
        }

        if ($payment) {
            $this->applyCallback($payment, $payload);
        }

        $log->update(['processed_at' => now()]);

        /*
         * Selalu balas 200 untuk token valid agar Xendit
         * berhenti mengulang callback ini.
         */
        return response()->json(['message' => 'OK']);
    }

    private function applyCallback(
        Payment $payment,
        array $payload
    ): void {
        DB::transaction(function () use ($payment, $payload) {
            /*
         * Lock payment agar callback yang sama
         * tidak diproses secara bersamaan.
         */
            $payment = Payment::query()
                ->whereKey($payment->id)
                ->lockForUpdate()
                ->firstOrFail();

            /*
         * Payment sudah final.
         *
         * Callback Xendit bisa dikirim lebih dari sekali.
         * Jangan proses ulang.
         */
            if ($payment->status !== PaymentStatus::PENDING) {
                return;
            }

            /*
         * Lock booking.
         */
            $booking = Booking::query()
                ->whereKey($payment->booking_id)
                ->lockForUpdate()
                ->firstOrFail();

            /*
         * Lock booking request juga karena statusnya
         * akan ikut berubah.
         */
            $bookingRequest = BookingRequest::query()
                ->whereKey($booking->booking_request_id)
                ->lockForUpdate()
                ->firstOrFail();

            match ($payload['status'] ?? null) {
                'PAID' => $this->markPaid(
                    $payment,
                    $booking,
                    $bookingRequest
                ),

                'EXPIRED' => $this->markExpired(
                    $payment,
                    $booking,
                    $bookingRequest
                ),

                default => null,
            };
        });
    }

    private function markPaid(
        Payment $payment,
        Booking $booking,
        BookingRequest $bookingRequest
    ): void {
        $payment->update([
            'status' => PaymentStatus::PAID,
            'paid_at' => now(),
        ]);

        $booking->update([
            'status' => BookingStatus::CONFIRMED,
            'paid_at' => now(),
            'confirmed_at' => now(),
        ]);

        $bookingRequest->update([
            'status' => BookingRequestStatus::CONVERTED,
            'failure_reason' => null,
        ]);
    }

    private function markExpired(
        Payment $payment,
        Booking $booking,
        BookingRequest $bookingRequest
    ): void {
        $payment->update([
            'status' => PaymentStatus::EXPIRED,
            'expired_at' => now(),
        ]);

        $booking->update([
            'status' => BookingStatus::EXPIRED,
        ]);

        $bookingRequest->update([
            'status' => BookingRequestStatus::WAITING,
            'failure_reason' =>
            'Pembayaran DP kedaluwarsa.',
        ]);
    }
}