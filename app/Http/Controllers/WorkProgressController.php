<?php

namespace App\Http\Controllers;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WorkProgressController extends Controller
{
    public function index(Request $request): Response
    {
        $validated = $request->validate([
            'date' => ['nullable', 'date_format:Y-m-d'],
        ]);

        $selectedDate = $validated['date']
            ?? now()->toDateString();

        $mechanics = User::query()
            ->select([
                'id',
                'name',
                'email',
                'role',
                'is_active',
            ])
            ->where('role', 'mechanic')
            ->where('is_active', true)
            ->with([
                'bookings' => function ($query) use ($selectedDate) {
                    $query
                        ->select([
                            'id',
                            'booking_code',
                            'booking_request_id',
                            'user_id',
                            'vehicle_id',
                            'service_type_id',
                            'mechanic_user_id',
                            'start_at',
                            'end_at',
                            'service_price',
                            'dp_amount',
                            'remaining_amount',
                            'status',
                            'confirmed_at',
                            'completed_at',
                            'cancelled_at',
                            'no_show_at',
                            'paid_at',
                            'notes',
                        ])
                        ->with([
                            'serviceType:id,name,description,duration_minutes,price,dp_amount,is_active',

                            'vehicle:id,user_id,license_plate,brand,model,vehicle_type,year',
                        ])
                        ->whereDate('start_at', $selectedDate)
                        ->orderBy('start_at');
                },
            ])
            ->orderBy('name')
            ->get();

        return Inertia::render('WorkProgress/Index', [
            'mechanics' => $mechanics,
            'selectedDate' => $selectedDate,
        ]);
    }
}
