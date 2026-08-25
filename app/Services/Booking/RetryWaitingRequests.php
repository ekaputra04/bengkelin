<?php

namespace App\Services\Booking;

use App\Enums\BookingRequestStatus;
use App\Models\BookingRequest;

/**
 * Setelah slot mekanik kosong (misal no_show),
 * coba assign ke booking request berikutnya yang masih waiting.
 */
class RetryWaitingRequests
{
    public function __construct(
        protected ProcessBookingRequest $processBookingRequest,
    ) {}

    public function handle(): void
    {
        $waitingRequests = BookingRequest::query()
            ->where('status', BookingRequestStatus::WAITING)
            ->orderBy('created_at')
            ->get();

        foreach ($waitingRequests as $request) {
            $booking = $this->processBookingRequest
                ->execute($request);

            if ($booking) {
                break;
            }
        }
    }
}
