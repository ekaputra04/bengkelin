<?php

namespace App\Http\Controllers;

use App\Enums\UserRole;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class VehicleController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->string('search')->trim()->toString();
        $user = $request->user();

        $vehicles = Vehicle::query()
            ->with('user')
            ->when($user->role !== UserRole::ADMIN, function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->when($search, function ($query) use ($search) {
                $query->where(function ($query) use ($search) {
                    $query->where('license_plate', 'like', "%{$search}%")
                        ->orWhere('brand', 'like', "%{$search}%")
                        ->orWhere('model', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Vehicles/Index', [
            'vehicles' => $vehicles,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function show(Vehicle $vehicle): Response
    {
        $user = $request()->user();

        if ($user->role !== UserRole::ADMIN && $vehicle->user_id !== $user->id) {
            abort(403);
        }

        $vehicle->load('user');

        return Inertia::render('Vehicles/Show', [
            'vehicle' => $vehicle,
        ]);
    }
}
