<?php

namespace App\Http\Controllers;

use App\Enums\BookingStatus;
use App\Enums\UserRole;
use App\Http\Requests\UpdateBookingRequest;
use App\Models\Booking;
use App\Services\Booking\RetryWaitingRequests;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BookingController extends Controller
{
    public function index(Request $request): Response
    {
        abort_unless(
            $request->user()->role === UserRole::ADMIN,
            403
        );

        $search = $request->string('search')->trim()->toString();

        $status = BookingStatus::tryFrom(
            $request->string('status')->trim()->toString()
        );

        $bookings = Booking::query()
            ->with(['user', 'vehicle', 'serviceType', 'mechanic', 'payment'])
            ->when($search, function ($query) use ($search) {
                $query->where(function ($query) use ($search) {
                    $query->where(
                        'booking_code',
                        'like',
                        "%{$search}%"
                    )->orWhereHas('vehicle', function ($query) use ($search) {
                        $query->where(
                            'license_plate',
                            'like',
                            "%{$search}%"
                        );
                    })->orWhereHas('user', function ($query) use ($search) {
                        $query->where(
                            'name',
                            'like',
                            "%{$search}%"
                        );
                    });
                });
            })
            ->when($status, function ($query) use ($status) {
                $query->where('status', $status);
            })
            ->latest('start_at')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('WorkOrders/Index', [
            'bookings' => $bookings,
            'filters' => [
                'search' => $search,
                'status' => $status?->value,
            ],
        ]);
    }

    /**
     * Transisi status pengerjaan:
     * confirmed -> in_progress -> completed
     * confirmed | in_progress -> no_show
     */
    public function update(
        UpdateBookingRequest $request,
        Booking $booking,
        RetryWaitingRequests $retryWaitingRequests,
    ): RedirectResponse {
        $targetStatus = $request->validated('status');

        $validTransitions = [
            BookingStatus::CONFIRMED->value => [
                BookingStatus::IN_PROGRESS->value,
                BookingStatus::NO_SHOW->value,
            ],
            BookingStatus::IN_PROGRESS->value => [
                BookingStatus::COMPLETED->value,
                BookingStatus::NO_SHOW->value,
            ],
        ];

        $allowed = $validTransitions[$booking->status->value] ?? [];

        if (! in_array($targetStatus, $allowed)) {
            return back()->with(
                'error',
                "Order {$booking->booking_code} tidak bisa dipindah ke status tersebut."
            );
        }

        $target = BookingStatus::from($targetStatus);

        $booking->update([
            'status' => $target,
            'completed_at' => $target === BookingStatus::COMPLETED
                ? now()
                : null,
            'no_show_at' => $target === BookingStatus::NO_SHOW
                ? now()
                : null,
        ]);

        if ($target === BookingStatus::NO_SHOW) {
            $retryWaitingRequests->handle();
        }

        return back()->with(
            'success',
            "Order {$booking->booking_code} diperbarui."
        );
    }

    /**
     * Tandai sisa pembayaran (cash) sudah lunas.
     */
    public function markPaid(Booking $booking): RedirectResponse
    {
        abort_unless(
            auth()->user()->role === UserRole::ADMIN,
            403
        );

        if ($booking->paid_at) {
            return back()->with(
                'error',
                "Order {$booking->booking_code} sudah lunas."
            );
        }

        $booking->update(['paid_at' => now()]);

        return back()->with(
            'success',
            "Pembayaran sisa order {$booking->booking_code} ditandai lunas."
        );
    }
}
