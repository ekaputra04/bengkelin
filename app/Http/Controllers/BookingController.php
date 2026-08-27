<?php

namespace App\Http\Controllers;

use App\Enums\BookingStatus;
use App\Enums\UserRole;
use App\Http\Requests\UpdateBookingRequest;
use App\Models\Booking;
use App\Services\Booking\RetryWaitingRequests;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BookingController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->string('search')->trim()->toString();

        $status = BookingStatus::tryFrom(
            $request->string('status')->trim()->toString()
        );

        $user = $request->user();

        $bookings = Booking::query()
            ->with([
                'user',
                'vehicle',
                'serviceType',
                'mechanic',
                'payment',
            ])
            ->when(
                $user->role === UserRole::CUSTOMER,
                function ($query) use ($user) {
                    $query->where(
                        'user_id',
                        $user->id
                    );
                }
            )
            ->when($search, function ($query) use ($search) {
                $query->where(function ($query) use ($search) {
                    $query
                        ->where(
                            'booking_code',
                            'like',
                            "%{$search}%"
                        )
                        ->orWhereHas(
                            'vehicle',
                            function ($query) use ($search) {
                                $query->where(
                                    'license_plate',
                                    'like',
                                    "%{$search}%"
                                );
                            }
                        )
                        ->orWhereHas(
                            'user',
                            function ($query) use ($search) {
                                $query->where(
                                    'name',
                                    'like',
                                    "%{$search}%"
                                );
                            }
                        );
                });
            })
            ->when($status, function ($query) use ($status) {
                $query->where(
                    'status',
                    $status
                );
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

    public function show(Booking $booking): Response
    {
        $booking->load(['user', 'vehicle', 'serviceType', 'mechanic', 'payment']);

        return Inertia::render('WorkOrders/Show', [
            'booking' => $booking,
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
        $endTime = $request->validated('end_time');

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

        $completedAt = null;

        if ($target === BookingStatus::COMPLETED) {
            $completedAt = $this->resolveCompletedAt($booking, $endTime);

            if ($completedAt->lessThanOrEqualTo($booking->start_at)) {
                return back()->with(
                    'error',
                    "Jam selesai order {$booking->booking_code} harus setelah jam mulai."
                );
            }
        }

        $booking->update([
            'status' => $target,
            'end_at' => $target === BookingStatus::COMPLETED
                ? $completedAt
                : $booking->end_at,
            'completed_at' => $target === BookingStatus::COMPLETED
                ? $completedAt
                : null,
            'no_show_at' => $target === BookingStatus::NO_SHOW
                ? now()
                : null,
        ]);

        if ($target === BookingStatus::NO_SHOW) {
            $retryWaitingRequests->handle();
        }

        if ($target === BookingStatus::COMPLETED) {
            $retryWaitingRequests->handle();
        }

        return back()->with(
            'success',
            "Order {$booking->booking_code} diperbarui."
        );
    }

    private function resolveCompletedAt(
        Booking $booking,
        ?string $endTime
    ): Carbon {
        return $booking->start_at->copy()->setTimeFromTimeString(
            $endTime ?? $booking->end_at->format('H:i')
        );
    }

    public function markPaid(Booking $booking): RedirectResponse
    {
        $booking->update(['paid_at' => now(), 'status' => BookingStatus::FULLY_PAID]);

        return back()->with(
            'success',
            "Pembayaran sisa order {$booking->booking_code} ditandai lunas."
        );
    }
}