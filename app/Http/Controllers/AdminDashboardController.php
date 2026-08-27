<?php

namespace App\Http\Controllers;

use App\Enums\BookingRequestStatus;
use App\Enums\BookingStatus;
use App\Enums\PaymentStatus;
use App\Enums\UserRole;
use App\Models\Booking;
use App\Models\BookingRequest;
use App\Models\Payment;
use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminDashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $todayStart = today()->startOfDay();
        $todayEnd = today()->endOfDay();
        $monthStart = now()->startOfMonth();
        $monthEnd = now()->endOfMonth();

        $overview = [
            'total_bookings' => Booking::count(),
            'active_work_orders' => Booking::query()
                ->where('status', BookingStatus::IN_PROGRESS)
                ->count(),
            'waiting_requests' => BookingRequest::query()
                ->where('status', BookingRequestStatus::WAITING)
                ->count(),
            'active_mechanics' => User::query()
                ->where('role', UserRole::MECHANIC)
                ->where('is_active', true)
                ->count(),
            'total_customers' => User::query()
                ->where('role', UserRole::CUSTOMER)
                ->count(),
            'total_vehicles' => Vehicle::count(),
            'dp_collected_this_month' => (float) Payment::query()
                ->where('status', PaymentStatus::PAID)
                ->whereBetween('paid_at', [$monthStart, $monthEnd])
                ->sum('amount'),
            'remaining_revenue_open' => (float) Booking::query()
                ->whereIn('status', [
                    BookingStatus::CONFIRMED,
                    BookingStatus::IN_PROGRESS,
                    BookingStatus::COMPLETED,
                ])
                ->sum('remaining_amount'),
        ];

        $todaySummary = [
            'date' => $todayStart->toDateString(),
            'bookings_count' => Booking::query()
                ->whereBetween('start_at', [$todayStart, $todayEnd])
                ->count(),
            'confirmed_count' => Booking::query()
                ->whereBetween('start_at', [$todayStart, $todayEnd])
                ->where('status', BookingStatus::CONFIRMED)
                ->count(),
            'in_progress_count' => Booking::query()
                ->whereBetween('start_at', [$todayStart, $todayEnd])
                ->where('status', BookingStatus::IN_PROGRESS)
                ->count(),
            'completed_count' => Booking::query()
                ->whereBetween('start_at', [$todayStart, $todayEnd])
                ->whereIn('status', [
                    BookingStatus::COMPLETED,
                    BookingStatus::FULLY_PAID,
                ])
                ->count(),
            'pending_payment_count' => Booking::query()
                ->where('status', BookingStatus::PENDING_PAYMENT)
                ->count(),
            'waiting_requests_count' => BookingRequest::query()
                ->where('status', BookingRequestStatus::WAITING)
                ->whereBetween('requested_start_at', [$todayStart, $todayEnd])
                ->count(),
        ];

        $statusSummary = collect(BookingStatus::cases())
            ->map(fn (BookingStatus $status) => [
                'status' => $status->value,
                'total' => Booking::query()
                    ->where('status', $status)
                    ->count(),
            ])
            ->filter(fn (array $item) => $item['total'] > 0)
            ->values();

        $requestSummary = collect(BookingRequestStatus::cases())
            ->map(fn (BookingRequestStatus $status) => [
                'status' => $status->value,
                'total' => BookingRequest::query()
                    ->where('status', $status)
                    ->count(),
            ])
            ->filter(fn (array $item) => $item['total'] > 0)
            ->values();

        $todayBookings = Booking::query()
            ->with(['user', 'vehicle', 'serviceType', 'mechanic', 'payment'])
            ->whereBetween('start_at', [$todayStart, $todayEnd])
            ->orderBy('start_at')
            ->limit(6)
            ->get();

        $upcomingBookings = Booking::query()
            ->with(['user', 'vehicle', 'serviceType', 'mechanic', 'payment'])
            ->whereIn('status', [
                BookingStatus::CONFIRMED,
                BookingStatus::IN_PROGRESS,
                BookingStatus::PENDING_PAYMENT,
            ])
            ->where('start_at', '>=', now())
            ->orderBy('start_at')
            ->limit(6)
            ->get();

        $waitingRequests = BookingRequest::query()
            ->with(['user', 'vehicle', 'serviceType'])
            ->where('status', BookingRequestStatus::WAITING)
            ->orderBy('requested_start_at')
            ->limit(6)
            ->get();

        $mechanicLoad = User::query()
            ->where('role', UserRole::MECHANIC)
            ->where('is_active', true)
            ->withCount([
                'mechanicBookings as today_jobs_count' => fn ($query) => $query
                    ->whereBetween('start_at', [$todayStart, $todayEnd]),
                'mechanicBookings as in_progress_jobs_count' => fn ($query) => $query
                    ->where('status', BookingStatus::IN_PROGRESS),
                'mechanicBookingRequests as waiting_assignments_count' => fn ($query) => $query
                    ->where('status', BookingRequestStatus::PROCESSING),
            ])
            ->with([
                'mechanicBookings' => fn ($query) => $query
                    ->with(['vehicle', 'serviceType'])
                    ->whereBetween('start_at', [$todayStart, $todayEnd])
                    ->orderBy('start_at')
                    ->limit(1),
            ])
            ->orderByDesc('today_jobs_count')
            ->orderBy('name')
            ->get()
            ->map(function (User $mechanic) {
                $nextBooking = $mechanic->mechanicBookings->first();

                return [
                    'id' => $mechanic->id,
                    'name' => $mechanic->name,
                    'today_jobs_count' => $mechanic->today_jobs_count,
                    'in_progress_jobs_count' => $mechanic->in_progress_jobs_count,
                    'waiting_assignments_count' => $mechanic->waiting_assignments_count,
                    'next_booking' => $nextBooking
                        ? [
                            'start_at' => $nextBooking->start_at,
                            'vehicle' => $nextBooking->vehicle?->license_plate,
                            'service_name' => $nextBooking->serviceType?->name,
                        ]
                        : null,
                ];
            });

        return Inertia::render('Dashboard', [
            'overview' => $overview,
            'todaySummary' => $todaySummary,
            'statusSummary' => $statusSummary,
            'requestSummary' => $requestSummary,
            'todayBookings' => $todayBookings,
            'upcomingBookings' => $upcomingBookings,
            'waitingRequests' => $waitingRequests,
            'mechanicLoad' => $mechanicLoad,
        ]);
    }
}
