<?php

use App\Enums\BookingRequestStatus;
use App\Enums\BookingStatus;
use App\Models\Booking;
use App\Models\BookingRequest;
use App\Models\Mechanic;
use App\Models\ServiceType;
use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Support\Facades\Date;
use Inertia\Testing\AssertableInertia as Assert;

function createConfirmedBooking(): Booking
{
    $user = User::factory()->create();

    $serviceType = ServiceType::create([
        'name' => 'Servis Rutin',
        'description' => null,
        'duration_minutes' => 60,
        'price' => 200000,
        'dp_amount' => 50000,
        'is_active' => true,
    ]);

    $vehicle = Vehicle::create([
        'user_id' => $user->id,
        'license_plate' => 'B1111'.strtoupper(substr(uniqid(), -4)),
        'brand' => 'Honda',
        'model' => 'Vario',
        'vehicle_type' => 'motorcycle',
    ]);

    $bookingRequest = BookingRequest::create([
        'user_id' => $user->id,
        'vehicle_id' => $vehicle->id,
        'service_type_id' => $serviceType->id,
        'requested_start_at' => Date::tomorrow()->setTime(9, 0),
        'status' => BookingRequestStatus::CONVERTED,
    ]);

    return Booking::create([
        'booking_code' => 'BK-TEST-'.uniqid(),
        'booking_request_id' => $bookingRequest->id,
        'user_id' => $user->id,
        'vehicle_id' => $vehicle->id,
        'service_type_id' => $serviceType->id,
        'mechanic_id' => Mechanic::create([
            'name' => 'Budi',
            'phone' => '081234567890',
            'is_active' => true,
        ])->id,
        'start_at' => Date::tomorrow()->setTime(9, 0),
        'end_at' => Date::tomorrow()->setTime(10, 0),
        'service_price' => 200000,
        'dp_amount' => 50000,
        'remaining_amount' => 150000,
        'status' => BookingStatus::CONFIRMED,
    ]);
}

it('admin memajukan status pengerjaan dari terjadwal sampai selesai', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $booking = createConfirmedBooking();

    $this->actingAs($admin)
        ->patchJson(route('work-orders.update', $booking), [
            'status' => 'in_progress',
        ])
        ->assertRedirect();

    expect($booking->fresh()->status)->toBe(BookingStatus::IN_PROGRESS);

    $this->actingAs($admin)
        ->patch(route('work-orders.update', $booking), [
            'status' => 'completed',
        ])
        ->assertRedirect();

    $booking = $booking->fresh();

    expect($booking->status)->toBe(BookingStatus::COMPLETED);
    expect($booking->completed_at)->not->toBeNull();
});

it('menolak transisi status yang tidak valid', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $booking = createConfirmedBooking();
    $booking->update(['status' => BookingStatus::PENDING_PAYMENT]);

    $this->actingAs($admin)
        ->patch(route('work-orders.update', $booking), [
            'status' => 'in_progress',
        ])
        ->assertSessionHas('error');

    // Order yang DP-nya belum dibayar tidak boleh langsung dikerjakan.
    expect($booking->fresh()->status)->toBe(BookingStatus::PENDING_PAYMENT);
});

it('menolak akses non-admin', function () {
    $customer = User::factory()->create(['role' => 'customer']);
    $booking = createConfirmedBooking();

    $this->actingAs($customer)
        ->get(route('work-orders.index'))
        ->assertForbidden();

    $this->actingAs($customer)
        ->patch(route('work-orders.update', $booking), [
            'status' => 'completed',
        ])
        ->assertForbidden();

    expect($booking->fresh()->status)->toBe(BookingStatus::CONFIRMED);
});

it('memfilter daftar order berdasarkan status', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    $confirmed = createConfirmedBooking();

    $inProgress = createConfirmedBooking();
    $inProgress->update(['status' => BookingStatus::IN_PROGRESS]);

    $this->actingAs($admin)
        ->get(route('work-orders.index', ['status' => 'confirmed']))
        ->assertInertia(
            fn (Assert $inertia) => $inertia
                ->component('WorkOrders/Index')
                ->where('filters.status', 'confirmed')
                ->has('bookings.data', 1)
                ->where('bookings.data.0.id', $confirmed->id)
        );

    // Status tidak dikenal diabaikan: semua order tetap tampil.
    $this->actingAs($admin)
        ->get(route('work-orders.index', ['status' => 'ngawur']))
        ->assertInertia(
            fn (Assert $inertia) => $inertia
                ->where('filters.status', null)
                ->has('bookings.data', 2)
        );
});
