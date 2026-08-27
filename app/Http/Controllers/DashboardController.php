<?php

namespace App\Http\Controllers;

use App\Enums\BookingRequestStatus;
use App\Enums\BookingStatus;
use App\Enums\PaymentStatus;
use App\Enums\UserRole;
use App\Models\Booking;
use App\Models\BookingRequest;
use App\Models\Payment;
use App\Models\Vehicle;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response|RedirectResponse
    {
        $user = $request->user();

        if ($user->role === UserRole::ADMIN) {
            return to_route('admin.dashboard');
        }

        $todayStart = today()->startOfDay();
        $todayEnd = today()->endOfDay();

        $bookingRelations = ['vehicle', 'serviceType', 'mechanic', 'payment'];
        $requestRelations = ['vehicle', 'serviceType', 'booking'];

        $overview = [
            'total_bookings' => Booking::query()
                ->where('user_id', $user->id)
                ->count(),
            'active_bookings' => Booking::query()
                ->where('user_id', $user->id)
                ->whereIn('status', [
                    BookingStatus::PENDING_PAYMENT,
                    BookingStatus::CONFIRMED,
                    BookingStatus::IN_PROGRESS,
                ])
                ->count(),
            'completed_bookings' => Booking::query()
                ->where('user_id', $user->id)
                ->whereIn('status', [
                    BookingStatus::COMPLETED,
                    BookingStatus::FULLY_PAID,
                ])
                ->count(),
            'total_vehicles' => Vehicle::query()
                ->where('user_id', $user->id)
                ->count(),
            'waiting_requests' => BookingRequest::query()
                ->where('user_id', $user->id)
                ->where('status', BookingRequestStatus::WAITING)
                ->count(),
            'processing_requests' => BookingRequest::query()
                ->where('user_id', $user->id)
                ->where('status', BookingRequestStatus::PROCESSING)
                ->count(),
            'dp_paid_total' => (float) Payment::query()
                ->whereHas('booking', fn ($query) => $query->where('user_id', $user->id))
                ->where('status', PaymentStatus::PAID)
                ->sum('amount'),
            'remaining_revenue_open' => (float) Booking::query()
                ->where('user_id', $user->id)
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
                ->where('user_id', $user->id)
                ->whereBetween('start_at', [$todayStart, $todayEnd])
                ->count(),
            'confirmed_count' => Booking::query()
                ->where('user_id', $user->id)
                ->whereBetween('start_at', [$todayStart, $todayEnd])
                ->where('status', BookingStatus::CONFIRMED)
                ->count(),
            'in_progress_count' => Booking::query()
                ->where('user_id', $user->id)
                ->whereBetween('start_at', [$todayStart, $todayEnd])
                ->where('status', BookingStatus::IN_PROGRESS)
                ->count(),
            'completed_count' => Booking::query()
                ->where('user_id', $user->id)
                ->whereBetween('start_at', [$todayStart, $todayEnd])
                ->whereIn('status', [
                    BookingStatus::COMPLETED,
                    BookingStatus::FULLY_PAID,
                ])
                ->count(),
            'pending_payment_count' => Booking::query()
                ->where('user_id', $user->id)
                ->where('status', BookingStatus::PENDING_PAYMENT)
                ->count(),
            'waiting_requests_count' => BookingRequest::query()
                ->where('user_id', $user->id)
                ->where('status', BookingRequestStatus::WAITING)
                ->count(),
        ];

        $statusSummary = collect(BookingStatus::cases())
            ->map(fn (BookingStatus $status) => [
                'status' => $status->value,
                'total' => Booking::query()
                    ->where('user_id', $user->id)
                    ->where('status', $status)
                    ->count(),
            ])
            ->filter(fn (array $item) => $item['total'] > 0)
            ->values();

        $requestSummary = collect(BookingRequestStatus::cases())
            ->map(fn (BookingRequestStatus $status) => [
                'status' => $status->value,
                'total' => BookingRequest::query()
                    ->where('user_id', $user->id)
                    ->where('status', $status)
                    ->count(),
            ])
            ->filter(fn (array $item) => $item['total'] > 0)
            ->values();

        $nextBooking = Booking::query()
            ->where('user_id', $user->id)
            ->whereIn('status', [
                BookingStatus::PENDING_PAYMENT,
                BookingStatus::CONFIRMED,
                BookingStatus::IN_PROGRESS,
            ])
            ->where('start_at', '>=', now())
            ->with($bookingRelations)
            ->orderBy('start_at')
            ->first();

        $todayBookings = Booking::query()
            ->where('user_id', $user->id)
            ->with($bookingRelations)
            ->whereBetween('start_at', [$todayStart, $todayEnd])
            ->orderBy('start_at')
            ->limit(6)
            ->get();

        $upcomingBookings = Booking::query()
            ->where('user_id', $user->id)
            ->with($bookingRelations)
            ->whereIn('status', [
                BookingStatus::PENDING_PAYMENT,
                BookingStatus::CONFIRMED,
                BookingStatus::IN_PROGRESS,
            ])
            ->where('start_at', '>=', now())
            ->orderBy('start_at')
            ->limit(6)
            ->get();

        $recentBookings = Booking::query()
            ->where('user_id', $user->id)
            ->with($bookingRelations)
            ->orderByDesc('start_at')
            ->limit(6)
            ->get();

        $waitingRequests = BookingRequest::query()
            ->where('user_id', $user->id)
            ->with($requestRelations)
            ->whereIn('status', [
                BookingRequestStatus::WAITING,
                BookingRequestStatus::PROCESSING,
            ])
            ->orderBy('requested_start_at')
            ->limit(6)
            ->get();

        $vehicles = Vehicle::query()
            ->where('user_id', $user->id)
            ->withCount('bookings')
            ->orderBy('brand')
            ->orderBy('model')
            ->get();

        return Inertia::render('UserDashboard', [
            'overview' => $overview,
            'todaySummary' => $todaySummary,
            'statusSummary' => $statusSummary,
            'requestSummary' => $requestSummary,
            'nextBooking' => $nextBooking,
            'todayBookings' => $todayBookings,
            'upcomingBookings' => $upcomingBookings,
            'recentBookings' => $recentBookings,
            'waitingRequests' => $waitingRequests,
            'vehicles' => $vehicles,
        ]);
    }
}
