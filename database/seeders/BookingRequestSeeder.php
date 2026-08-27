<?php

namespace Database\Seeders;

use App\Models\BookingRequest;
use App\Models\ServiceType;
use App\Models\User;
use App\Models\Vehicle;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class BookingRequestSeeder extends Seeder
{
    public function run(): void
    {
        $customers = User::query()->where('role', 'customer')->get()->keyBy('email');
        $mechanics = User::query()->where('role', 'mechanic')->get()->keyBy('email');
        $vehicles = Vehicle::query()->get()->keyBy('license_plate');
        $serviceTypes = ServiceType::query()->get()->keyBy('name');

        foreach (BookingSeedCatalog::scenarios() as $scenario) {
            $customer = $customers->get($scenario['customer_email']);
            $vehicle = $vehicles->get($scenario['vehicle_plate']);
            $serviceType = $serviceTypes->get($scenario['service_name']);
            $mechanic = $scenario['mechanic_email']
                ? $mechanics->get($scenario['mechanic_email'])
                : null;

            if (! $customer || ! $vehicle || ! $serviceType) {
                continue;
            }

            $startAt = Carbon::parse($scenario['start_at']);
            $estimatedEndAt = $startAt->copy()
                ->addMinutes($serviceType->duration_minutes);

            BookingRequest::updateOrCreate(
                [
                    'user_id' => $customer->id,
                    'vehicle_id' => $vehicle->id,
                    'service_type_id' => $serviceType->id,
                    'requested_start_at' => $startAt,
                ],
                [
                    'mechanic_user_id' => $mechanic?->id,
                    'requested_end_at' => $mechanic ? $estimatedEndAt : null,
                    'status' => $scenario['request_status'],
                    'failure_reason' => $scenario['failure_reason'],
                    'created_at' => $startAt->copy()->subDay()->setTime(19, 0),
                    'updated_at' => $startAt->copy()->subHours(1),
                ],
            );
        }
    }
}
