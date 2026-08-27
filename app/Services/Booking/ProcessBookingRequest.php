<?php

namespace App\Services\Booking;

use App\Enums\BookingRequestStatus;
use App\Enums\BookingStatus;
use App\Enums\UserRole;
use App\Models\Booking;
use App\Models\BookingRequest;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class ProcessBookingRequest
{
    public function execute(
        BookingRequest $bookingRequest
    ): ?Booking {
        return DB::transaction(function () use ($bookingRequest) {

            $bookingRequest = BookingRequest::query()
                ->lockForUpdate()
                ->with('serviceType')
                ->findOrFail($bookingRequest->id);

            if (
                $bookingRequest->status !==
                BookingRequestStatus::WAITING
            ) {
                return $bookingRequest->booking;
            }

            return $this->tryAssignSlot($bookingRequest);
        });
    }

    public function tryAssignSlot(
        BookingRequest $bookingRequest
    ): ?Booking {
        $serviceType = $bookingRequest->serviceType;

        $startAt = Carbon::parse(
            $bookingRequest->requested_start_at
        );

        $endAt = $startAt->copy()->addMinutes(
            $serviceType->duration_minutes
        );

        /*
         * Lock seluruh mekanik yang aktif.
         *
         * Tujuannya agar dua request yang datang
         * bersamaan tidak memilih mekanik yang sama.
         */
        $mechanics = User::query()
            ->where('role', UserRole::MECHANIC)
            ->where('is_active', true)
            ->orderBy('id')
            ->lockForUpdate()
            ->get();

        $availableMechanic = null;

        foreach ($mechanics as $mechanic) {
            $hasConflict = $this->hasScheduleConflict(
                mechanicId: $mechanic->id,
                startAt: $startAt,
                endAt: $endAt,
            );

            if (! $hasConflict) {
                $availableMechanic = $mechanic;
                break;
            }
        }

        /*
         * Tidak ada mekanik.
         */
        if (! $availableMechanic) {
            $bookingRequest->update([
                'status' => BookingRequestStatus::WAITING,
                'failure_reason' =>
                'Tidak ada mekanik yang tersedia pada waktu tersebut.',
            ]);

            return null;
        }

        /*
         * Slot berhasil ditemukan.
         *
         * Request sekarang masuk processing,
         * bukan converted.
         */
        $bookingRequest->update([
            'status' => BookingRequestStatus::PROCESSING,
            'mechanic_user_id' => $availableMechanic->id,
            'requested_end_at' => $endAt,
            'failure_reason' => null,
        ]);

        $servicePrice = $serviceType->price;
        $dpAmount = $serviceType->dp_amount;

        /*
         * Reserve slot.
         *
         * Booking dibuat dengan status pending_payment.
         */
        return Booking::create([
            'booking_code' => $this->generateBookingCode(),

            'booking_request_id' =>
            $bookingRequest->id,

            'user_id' =>
            $bookingRequest->user_id,

            'vehicle_id' =>
            $bookingRequest->vehicle_id,

            'service_type_id' =>
            $bookingRequest->service_type_id,

            'mechanic_user_id' =>
            $availableMechanic->id,

            'start_at' => $startAt,
            'end_at' => $endAt,

            'service_price' => $servicePrice,
            'dp_amount' => $dpAmount,
            'remaining_amount' =>
            $servicePrice - $dpAmount,

            'status' =>
            BookingStatus::PENDING_PAYMENT,

            'payment_expired_at' =>
            now()->addMinutes(15),
        ]);
    }

    private function generateBookingCode(): string
    {
        return 'BK-' .
            now()->format('YmdHis') .
            '-' .
            strtoupper(
                substr(
                    bin2hex(random_bytes(3)),
                    0,
                    6
                )
            );
    }

    private function hasScheduleConflict(
        int $mechanicId,
        Carbon $startAt,
        Carbon $endAt
    ): bool {
        return Booking::query()
            ->where('mechanic_user_id', $mechanicId)
            ->whereIn('status', [
                BookingStatus::PENDING_PAYMENT,
                BookingStatus::CONFIRMED,
                BookingStatus::IN_PROGRESS,
                BookingStatus::COMPLETED,
                BookingStatus::FULLY_PAID,
            ])
            ->where('start_at', '<', $endAt)
            ->where('end_at', '>', $startAt)
            ->exists();
    }
}
