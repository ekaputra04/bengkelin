<?php

namespace Database\Seeders;

use App\Enums\BookingStatus;
use App\Models\Booking;
use App\Models\BookingRequest;
use App\Models\ServiceType;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class BookingSeeder extends Seeder
{
    public function run(): void
    {
        $serviceTypes = ServiceType::query()->get()->keyBy('name');

        foreach (BookingSeedCatalog::scenarios() as $scenario) {
            if (! $scenario['booking_code'] || ! $scenario['booking_status']) {
                continue;
            }

            $serviceType = $serviceTypes->get($scenario['service_name']);

            if (! $serviceType) {
                continue;
            }

            $bookingRequest = BookingRequest::query()
                ->whereHas('user', fn($query) => $query->where('email', $scenario['customer_email']))
                ->whereHas('vehicle', fn($query) => $query->where('license_plate', $scenario['vehicle_plate']))
                ->where('requested_start_at', Carbon::parse($scenario['start_at']))
                ->first();

            if (! $bookingRequest) {
                continue;
            }

            $startAt = Carbon::parse($scenario['start_at']);
            $estimatedEndAt = $startAt->copy()
                ->addMinutes($serviceType->duration_minutes);
            $endAt = $scenario['actual_end_at']
                ? Carbon::parse($scenario['actual_end_at'])
                : $estimatedEndAt;

            $confirmedAt = in_array(
                $scenario['booking_status'],
                [
                    BookingStatus::CONFIRMED,
                    BookingStatus::IN_PROGRESS,
                    BookingStatus::COMPLETED,
                    BookingStatus::FULLY_PAID,
                    BookingStatus::NO_SHOW,
                ],
                true
            ) ? $startAt->copy()->subMinutes(30) : null;

            $completedAt = in_array(
                $scenario['booking_status'],
                [
                    BookingStatus::COMPLETED,
                    BookingStatus::FULLY_PAID,
                ],
                true
            ) ? $endAt->copy() : null;

            $noShowAt = $scenario['booking_status'] === BookingStatus::NO_SHOW
                ? $startAt->copy()->addMinutes(20)
                : null;

            $paidAt = match ($scenario['booking_status']) {
                BookingStatus::CONFIRMED,
                BookingStatus::IN_PROGRESS,
                BookingStatus::COMPLETED,
                BookingStatus::NO_SHOW => $startAt->copy()->subMinutes(20),
                BookingStatus::FULLY_PAID => $endAt->copy()->addMinutes(15),
                default => null,
            };

            Booking::updateOrCreate(
                ['booking_code' => $scenario['booking_code']],
                [
                    'booking_request_id' => $bookingRequest->id,
                    'user_id' => $bookingRequest->user_id,
                    'vehicle_id' => $bookingRequest->vehicle_id,
                    'service_type_id' => $bookingRequest->service_type_id,
                    'mechanic_user_id' => $bookingRequest->mechanic_user_id,
                    'start_at' => $startAt,
                    'end_at' => $endAt,
                    'service_price' => $serviceType->price,
                    'dp_amount' => $serviceType->dp_amount,
                    'remaining_amount' => $serviceType->price - $serviceType->dp_amount,
                    'status' => $scenario['booking_status'],
                    'payment_expired_at' => $startAt->copy()->subDay()->setTime(20, 15),
                    'confirmed_at' => $confirmedAt,
                    'completed_at' => $completedAt,
                    'cancelled_at' => null,
                    'no_show_at' => $noShowAt,
                    'paid_at' => $paidAt,
                    'notes' => $scenario['notes'],
                    'created_at' => $startAt->copy()->subDay()->setTime(20, 0),
                    'updated_at' => $completedAt ?? $noShowAt ?? $startAt->copy()->subMinutes(10),
                ],
            );
        }
    }
}
