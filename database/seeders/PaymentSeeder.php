<?php

namespace Database\Seeders;

use App\Enums\PaymentStatus;
use App\Models\Booking;
use App\Models\Payment;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class PaymentSeeder extends Seeder
{
    public function run(): void
    {
        foreach (BookingSeedCatalog::scenarios() as $scenario) {
            if (! $scenario['booking_code'] || ! $scenario['payment_status']) {
                continue;
            }

            $booking = Booking::query()
                ->where('booking_code', $scenario['booking_code'])
                ->first();

            if (! $booking) {
                continue;
            }

            $createdAt = Carbon::parse($scenario['start_at'])
                ->subDay()
                ->setTime(20, 5);

            $expiredAt = match ($scenario['payment_status']) {
                PaymentStatus::PENDING => $createdAt->copy()->addMinutes(15),
                PaymentStatus::EXPIRED => $createdAt->copy()->addMinutes(15),
                default => null,
            };

            $paidAt = $scenario['payment_status'] === PaymentStatus::PAID
                ? $createdAt->copy()->addMinutes(5)
                : null;

            Payment::updateOrCreate(
                ['order_id' => 'DP-'.$scenario['booking_code']],
                [
                    'booking_id' => $booking->id,
                    'transaction_id' => 'INV-'.$scenario['booking_code'],
                    'amount' => $booking->dp_amount,
                    'status' => $scenario['payment_status'],
                    'payment_url' => 'https://checkout.xendit.co/web/'.strtolower($scenario['booking_code']),
                    'paid_at' => $paidAt,
                    'expired_at' => $expiredAt,
                    'failed_at' => null,
                    'raw_response' => [
                        'seeded' => true,
                        'booking_code' => $scenario['booking_code'],
                        'payment_status' => $scenario['payment_status']->value,
                    ],
                    'created_at' => $createdAt,
                    'updated_at' => $paidAt ?? $expiredAt ?? $createdAt,
                ],
            );
        }
    }
}
