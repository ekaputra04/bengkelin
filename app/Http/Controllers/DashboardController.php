<?php

namespace App\Http\Controllers;

use App\Enums\BookingStatus;
use App\Enums\UserRole;
use App\Models\Booking;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        if ($user->role === UserRole::ADMIN) {
            return Inertia::render('Dashboard');
        }

        $withRelations = ['vehicle', 'serviceType', 'mechanic'];

        /*
         * Servis terdekat yang sudah terkonfirmasi/berjalan:
         * kartu "Upcoming Service".
         */
        $upcomingBooking = Booking::query()
            ->where('user_id', $user->id)
            ->whereIn('status', [
                BookingStatus::CONFIRMED,
                BookingStatus::IN_PROGRESS,
            ])
            ->where('start_at', '>=', now())
            ->with([...$withRelations, 'payment'])
            ->orderBy('start_at')
            ->first();

        /*
         * Aktivitas hari ini: servis berjalan / terjadwal
         * pada tanggal hari ini.
         */
        $todayBooking = Booking::query()
            ->where('user_id', $user->id)
            ->whereIn('status', [
                BookingStatus::CONFIRMED,
                BookingStatus::IN_PROGRESS,
            ])
            ->whereBetween('start_at', [
                today()->startOfDay(),
                today()->endOfDay(),
            ])
            ->with($withRelations)
            ->first();

        $recentBookings = Booking::query()
            ->where('user_id', $user->id)
            ->with(['vehicle', 'serviceType'])
            ->orderByDesc('start_at')
            ->limit(5)
            ->get();

        $vehicles = Vehicle::query()
            ->where('user_id', $user->id)
            ->orderBy('brand')
            ->get();

        return Inertia::render('UserDashboard', [
            'vehicles' => $vehicles,

            'upcomingBooking' => $upcomingBooking,

            'todayBooking' => $todayBooking,

            'recentBookings' => $recentBookings,
        ]);
    }
}
