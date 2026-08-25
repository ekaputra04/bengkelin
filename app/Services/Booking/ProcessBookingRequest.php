<?php

namespace App\Services\Booking;

use App\Enums\BookingRequestStatus;
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
                ->findOrFail($bookingRequest->id);

            if (
                $bookingRequest->status !==
                BookingRequestStatus::WAITING
            ) {
                return $bookingRequest->booking;
            }

            $bookingRequest->update([
                'status' => BookingRequestStatus::PROCESSING,
            ]);

            return $this->tryAssignSlot($bookingRequest);
        });
    }

    /**
     * Coba assign slot waktu ke booking request yang diberikan.
     * Dipanggil juga dari RetryWaitingRequests saat slot kosong.
     */
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

        $mechanics = User::query()
            ->where('role', UserRole::MECHANIC)
            ->where('is_active', true)
            ->orderBy('id')
            ->lockForUpdate()
            ->get();

        $availableMechanic = null;

        foreach ($mechanics as $mechanic) {
            $hasConflict = Booking::query()
                ->where('mechanic_user_id', $mechanic->id)
                ->whereNotIn('status', [
                    'cancelled',
                    'expired',
                    'no_show',
                ])
                ->where('start_at', '<', $endAt)
                ->where('end_at', '>', $startAt)
                ->exists();

            if (! $hasConflict) {
                $availableMechanic = $mechanic;
                break;
            }
        }

        if (! $availableMechanic) {
            $bookingRequest->update([
                'status' => BookingRequestStatus::WAITING,
                'failure_reason' => 'No mechanic available for requested time.',
            ]);

            return null;
        }

        $bookingRequest->update([
            'mechanic_user_id' => $availableMechanic->id,
            'requested_end_at' => $endAt,
            'failure_reason' => null,
        ]);

        $servicePrice = $serviceType->price;
        $dpAmount = $serviceType->dp_amount;

        $booking = Booking::create([
            'booking_code' => $this->generateBookingCode(),
            'booking_request_id' => $bookingRequest->id,
            'user_id' => $bookingRequest->user_id,
            'vehicle_id' => $bookingRequest->vehicle_id,
            'service_type_id' => $bookingRequest->service_type_id,
            'mechanic_user_id' => $availableMechanic->id,
            'start_at' => $startAt,
            'end_at' => $endAt,
            'service_price' => $servicePrice,
            'dp_amount' => $dpAmount,
            'remaining_amount' => $servicePrice - $dpAmount,
            'status' => 'pending_payment',
            'payment_expired_at' => now()->addMinutes(15),
        ]);

        $bookingRequest->update([
            'status' => BookingRequestStatus::CONVERTED,
        ]);

        return $booking;
    }

    private function generateBookingCode(): string
    {
        return 'BK-'.now()->format('YmdHis').'-'.
          strtoupper(
              substr(
                  bin2hex(random_bytes(3)),
                  0,
                  6
              )
          );
    }
}
