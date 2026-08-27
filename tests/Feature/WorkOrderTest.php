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
        ->patchJson(route('admin.work-orders.update', $booking), [
            'status' => 'in_progress',
        ])
        ->assertRedirect();

    expect($booking->fresh()->status)->toBe(BookingStatus::IN_PROGRESS);

    $this->actingAs($admin)
        ->patch(route('admin.work-orders.update', $booking), [
            'status' => 'completed',
            'end_time' => '11:30',
        ])
        ->assertRedirect();

    $booking = $booking->fresh();

    expect($booking->status)->toBe(BookingStatus::COMPLETED);
    expect($booking->completed_at)->not->toBeNull();
    expect($booking->end_at->format('H:i'))->toBe('11:30');
    expect($booking->completed_at->format('H:i'))->toBe('11:30');
});

it('menandai konsumen tidak datang dari status terjadwal', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $booking = createConfirmedBooking();

    $this->actingAs($admin)
        ->patch(route('admin.work-orders.update', $booking), [
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
        ->patch(route('admin.work-orders.update', $booking), [
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
        ->patch(route('admin.work-orders.update', $booking), [
            'status' => 'no_show',
        ])
        ->assertRedirect();

    // Tidak bisa no_show lagi dari status no_show.
    $this->actingAs($admin)
        ->patch(route('admin.work-orders.update', $booking), [
            'status' => 'no_show',
        ])
        ->assertSessionHas('error');
});

it('menolak transisi status yang tidak valid', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $booking = createConfirmedBooking();
    $booking->update(['status' => BookingStatus::PENDING_PAYMENT]);

    $this->actingAs($admin)
        ->patch(route('admin.work-orders.update', $booking), [
            'status' => 'in_progress',
        ])
        ->assertSessionHas('error');

    expect($booking->fresh()->status)->toBe(BookingStatus::PENDING_PAYMENT);
});

it('menolak akses non-admin', function () {
    $customer = User::factory()->create(['role' => 'customer']);
    $booking = createConfirmedBooking();

    $this->actingAs($customer)
        ->get(route('admin.work-orders.index'))
        ->assertForbidden();

    $this->actingAs($customer)
        ->patch(route('admin.work-orders.update', $booking), [
            'status' => 'completed',
            'end_time' => '10:00',
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
        ->get(route('admin.work-orders.index', ['status' => 'confirmed']))
        ->assertInertia(
            fn (Assert $inertia) => $inertia
                ->component('WorkOrders/Index')
                ->where('filters.status', 'confirmed')
                ->has('bookings.data', 1)
                ->where('bookings.data.0.id', $confirmed->id)
        );

    $this->actingAs($admin)
        ->get(route('admin.work-orders.index', ['status' => 'ngawur']))
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
        ->patch(route('admin.work-orders.paid', $booking))
        ->assertRedirect();

    expect($booking->fresh()->paid_at)->not->toBeNull();
});

it('menolak double mark paid', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $booking = createConfirmedBooking();
    $booking->update(['status' => BookingStatus::COMPLETED, 'paid_at' => now()]);

    $this->actingAs($admin)
        ->patch(route('admin.work-orders.paid', $booking))
        ->assertSessionHas('error');
});

it('menolak akses non-admin untuk mark paid', function () {
    $customer = User::factory()->create(['role' => 'customer']);
    $booking = createConfirmedBooking();
    $booking->update(['status' => BookingStatus::COMPLETED]);

    $this->actingAs($customer)
        ->patch(route('admin.work-orders.paid', $booking))
        ->assertForbidden();

    expect($booking->fresh()->paid_at)->toBeNull();
});

it('saat booking selesai hanya memproses antrean yang tidak overlap', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $bookingA = createConfirmedBooking();
    $bookingA->update([
        'status' => BookingStatus::IN_PROGRESS,
        'start_at' => Date::tomorrow()->setTime(7, 5),
        'end_at' => Date::tomorrow()->setTime(7, 45),
    ]);

    $bookingA->bookingRequest()->update([
        'status' => BookingRequestStatus::PROCESSING,
        'requested_start_at' => Date::tomorrow()->setTime(7, 5),
        'requested_end_at' => Date::tomorrow()->setTime(7, 45),
    ]);

    $mechanicId = $bookingA->mechanic_user_id;

    $serviceType = ServiceType::firstOrCreate(
        ['name' => 'Servis Antrean 30 Menit'],
        [
            'description' => null,
            'duration_minutes' => 30,
            'price' => 100000,
            'dp_amount' => 30000,
            'is_active' => true,
        ],
    );

    $userB = User::factory()->create();
    $vehicleB = Vehicle::create([
        'user_id' => $userB->id,
        'license_plate' => 'B2222'.strtoupper(substr(uniqid(), -4)),
        'brand' => 'Yamaha',
        'model' => 'Mio',
        'vehicle_type' => 'motorcycle',
    ]);

    $requestB = BookingRequest::create([
        'user_id' => $userB->id,
        'vehicle_id' => $vehicleB->id,
        'service_type_id' => $serviceType->id,
        'requested_start_at' => Date::tomorrow()->setTime(8, 0),
        'status' => BookingRequestStatus::WAITING,
    ]);

    $userC = User::factory()->create();
    $vehicleC = Vehicle::create([
        'user_id' => $userC->id,
        'license_plate' => 'B3333'.strtoupper(substr(uniqid(), -4)),
        'brand' => 'Suzuki',
        'model' => 'Nex',
        'vehicle_type' => 'motorcycle',
    ]);

    $requestC = BookingRequest::create([
        'user_id' => $userC->id,
        'vehicle_id' => $vehicleC->id,
        'service_type_id' => $serviceType->id,
        'requested_start_at' => Date::tomorrow()->setTime(8, 16),
        'status' => BookingRequestStatus::WAITING,
    ]);

    $this->actingAs($admin)
        ->patch(route('admin.work-orders.update', $bookingA), [
            'status' => 'completed',
            'end_time' => '08:15',
        ])
        ->assertRedirect();

    expect($bookingA->fresh()->status)->toBe(BookingStatus::COMPLETED);
    expect($bookingA->fresh()->end_at->format('H:i'))->toBe('08:15');

    expect($requestB->fresh()->status)->toBe(BookingRequestStatus::WAITING);
    expect($requestB->fresh()->booking)->toBeNull();

    $bookingC = Booking::where('booking_request_id', $requestC->id)->first();

    expect($requestC->fresh()->status)->toBe(BookingRequestStatus::PROCESSING);
    expect($requestC->fresh()->mechanic_user_id)->toBe($mechanicId);
    expect($bookingC)->not->toBeNull();
    expect($bookingC->start_at->format('H:i'))->toBe('08:16');
    expect($bookingC->end_at->format('H:i'))->toBe('08:46');
});
