<?php

use App\Enums\BookingRequestStatus;
use App\Enums\BookingStatus;
use App\Enums\UserRole;
use App\Models\Booking;
use App\Models\BookingRequest;
use App\Models\ServiceType;
use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Support\Facades\Date;
use Inertia\Testing\AssertableInertia as Assert;

function createConfirmedBooking(): Booking
{
    $user = User::factory()->create();

    $serviceType = ServiceType::firstOrCreate(
        ['name' => 'Servis Rutin'],
        [
            'description' => null,
            'duration_minutes' => 60,
            'price' => 200000,
            'dp_amount' => 50000,
            'is_active' => true,
        ],
    );

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

    $mechanic = User::firstOrCreate(
        ['email' => 'budi-workorder@bengkelin.test'],
        [
            'name' => 'Budi Santoso',
            'password' => bcrypt('password'),
            'role' => UserRole::MECHANIC,
            'is_active' => true,
        ],
    );

    return Booking::create([
        'booking_code' => 'BK-TEST-'.uniqid(),
        'booking_request_id' => $bookingRequest->id,
        'user_id' => $user->id,
        'vehicle_id' => $vehicle->id,
        'service_type_id' => $serviceType->id,
        'mechanic_user_id' => $mechanic->id,
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

it('menandai konsumen tidak datang dari status terjadwal', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $booking = createConfirmedBooking();

    $this->actingAs($admin)
        ->patch(route('work-orders.update', $booking), [
            'status' => 'no_show',
        ])
        ->assertRedirect();

    $booking = $booking->fresh();

    expect($booking->status)->toBe(BookingStatus::NO_SHOW);
    expect($booking->no_show_at)->not->toBeNull();
});

it('menandai konsumen tidak datang dari status dikerjakan', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $booking = createConfirmedBooking();
    $booking->update(['status' => BookingStatus::IN_PROGRESS]);

    $this->actingAs($admin)
        ->patch(route('work-orders.update', $booking), [
            'status' => 'no_show',
        ])
        ->assertRedirect();

    $booking = $booking->fresh();

    expect($booking->status)->toBe(BookingStatus::NO_SHOW);
    expect($booking->no_show_at)->not->toBeNull();
});

it('menolak no_show dari status yang tidak valid', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $booking = createConfirmedBooking();

    $this->actingAs($admin)
        ->patch(route('work-orders.update', $booking), [
            'status' => 'no_show',
        ])
        ->assertRedirect();

    // Tidak bisa no_show lagi dari status no_show.
    $this->actingAs($admin)
        ->patch(route('work-orders.update', $booking), [
            'status' => 'no_show',
        ])
        ->assertSessionHas('error');
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

    $this->actingAs($admin)
        ->get(route('work-orders.index', ['status' => 'ngawur']))
        ->assertInertia(
            fn (Assert $inertia) => $inertia
                ->where('filters.status', null)
                ->has('bookings.data', 2)
        );
});

it('admin menandai sisa pembayaran lunas', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $booking = createConfirmedBooking();
    $booking->update(['status' => BookingStatus::COMPLETED]);

    $this->actingAs($admin)
        ->patch(route('work-orders.paid', $booking))
        ->assertRedirect();

    expect($booking->fresh()->paid_at)->not->toBeNull();
});

it('menolak double mark paid', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $booking = createConfirmedBooking();
    $booking->update(['status' => BookingStatus::COMPLETED, 'paid_at' => now()]);

    $this->actingAs($admin)
        ->patch(route('work-orders.paid', $booking))
        ->assertSessionHas('error');
});

it('menolak akses non-admin untuk mark paid', function () {
    $customer = User::factory()->create(['role' => 'customer']);
    $booking = createConfirmedBooking();
    $booking->update(['status' => BookingStatus::COMPLETED]);

    $this->actingAs($customer)
        ->patch(route('work-orders.paid', $booking))
        ->assertForbidden();

    expect($booking->fresh()->paid_at)->toBeNull();
});
