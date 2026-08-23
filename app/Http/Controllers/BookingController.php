<?php

namespace App\Http\Controllers;

use App\Enums\BookingStatus;
use App\Enums\UserRole;
use App\Http\Requests\UpdateBookingRequest;
use App\Models\Booking;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BookingController extends Controller
{
    /**
     * Modul pengerjaan bengkel: daftar order beserta
     * status pengerjaannya (khusus admin).
     */
    public function index(Request $request): Response
    {
        abort_unless(
            $request->user()->role === UserRole::ADMIN,
            403
        );

        $search = $request->string('search')->trim()->toString();

        $bookings = Booking::query()
            ->with(['user', 'vehicle', 'serviceType', 'mechanic'])
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
            ->latest('start_at')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('WorkOrders/Index', [
            'bookings' => $bookings,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    /**
     * Transisi status pengerjaan:
     * confirmed -> in_progress -> completed.
     */
    public function update(
        UpdateBookingRequest $request,
        Booking $booking
    ): RedirectResponse {
        /** @var array<string, BookingStatus> $transitions */
        $transitions = [
            BookingStatus::CONFIRMED->value => BookingStatus::IN_PROGRESS,

            BookingStatus::IN_PROGRESS->value => BookingStatus::COMPLETED,
        ];

        $target =
            $transitions[$booking->status->value] ?? null;

        if (
            ! $target ||
            $request->validated('status') !== $target->value
        ) {
            return back()->with(
                'error',
                "Order {$booking->booking_code} tidak bisa dipindah ke status tersebut."
            );
        }

        $booking->update([
            'status' => $target,

            'completed_at' => $target === BookingStatus::COMPLETED
                ? now()
                : null,
        ]);

        return back()->with(
            'success',
            "Order {$booking->booking_code} diperbarui."
        );
    }
}
