<?php

namespace App\Services\Xendit;

use App\Enums\PaymentStatus;
use App\Enums\UserRole;
use App\Models\Booking;
use App\Models\Payment;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Facades\Http;

class XenditService
{
    private const INVOICE_ENDPOINT = 'https://api.xendit.co/v2/invoices';

    /**
     * Buat invoice DP di Xendit untuk sebuah booking,
     * lalu simpan sebagai record Payment berstatus pending.
     *
     * @throws ConnectionException saat gagal terhubung ke Xendit
     * @throws RequestException saat respons Xendit bukan 2xx
     */
    public static function createInvoice(Booking $booking): Payment
    {
        $booking->loadMissing(['user', 'serviceType']);

        /*
         * external_id harus unik per invoice, karena satu
         * booking bisa punya beberapa percobaan pembayaran.
         */
        $orderId = sprintf(
            'DP-%s-%s',
            $booking->booking_code,
            strtoupper(bin2hex(random_bytes(4)))
        );

        /*
         * Invoice berlaku sampai payment_expired_at booking
         * (customer diberi waktu terbatas untuk membayar DP).
         *
         * diffInSeconds() Carbon 3 mengembalikan float
         * (mis. 853.47) — Xendit menolak nilai non-integer.
         * Dibulatkan ke atas agar sisa waktu tidak kurang,
         * dan minimal 60 detik jika sudah lewat.
         */
        $duration = max(
            60,
            (int) ceil(now()->diffInSeconds($booking->payment_expired_at))
        );

        /*
     * Redirect berdasarkan user yang sedang login,
     * bukan berdasarkan pemilik booking.
     *
     * Admin dapat membuat booking untuk customer,
     * sehingga booking->user tetap customer,
     * tetapi admin tetap harus dikembalikan ke halaman admin.
     */
        $redirectUrl = match (auth()->user()?->role) {
            UserRole::ADMIN => route('admin.service-requests.index'),
            UserRole::CUSTOMER => route('customer.service-requests.index'),
            default => route('login'),
        };

        $response = Http::withBasicAuth(
            (string) config('services.xendit.secret_key'),
            ''
        )
            ->acceptJson()
            ->post(self::INVOICE_ENDPOINT, [
                'external_id' => $orderId,
                'amount' => (int) $booking->dp_amount,
                'description' => sprintf(
                    'DP %s (%s)',
                    $booking->serviceType->name,
                    $booking->booking_code
                ),
                'customer' => [
                    'given_names' => $booking->user->name,
                    'email' => $booking->user->email,
                ],
                'currency' => 'IDR',
                'invoice_duration' => $duration,
                'success_redirect_url' => $redirectUrl,
                'failure_redirect_url' => $redirectUrl,
            ])
            ->throw()
            ->json();

        return $booking->payment()->create([
            'transaction_id' => $response['id'],
            'order_id' => $orderId,
            'amount' => $booking->dp_amount,
            'status' => PaymentStatus::PENDING,
            'payment_url' => $response['invoice_url'],
            'expired_at' => $booking->payment_expired_at,
            'raw_response' => $response,
        ]);
    }
}
