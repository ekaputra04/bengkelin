<?php

use App\Models\Booking;
use App\Models\BookingRequest;
use App\Models\Mechanic;
use App\Models\ServiceType;
use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Support\Facades\Date;

function submitServiceRequest(User $user, array $payload)
{
    return test()->actingAs($user)->post(
        route('service-requests.store'),
        $payload
    );
}

function serviceRequestPayload(array $overrides = []): array
{
    return array_merge([
        'vehicle' => [
            'license_plate' => 'B1234XYZ',
            'brand' => 'Honda',
            'model' => 'Beat 110',
            'vehicle_type' => 'motorcycle',
        ],
        'service_type_id' => ServiceType::create([
            'name' => 'Ganti Oli',
            'description' => null,
            'duration_minutes' => 60,
            'price' => 150000,
            'dp_amount' => 50000,
            'is_active' => true,
        ])->id,
        'requested_start_at' => Date::tomorrow()->setTime(9, 0),
    ], $overrides);
}

it('mengubah pengajuan servis menjadi order saat mekanik tersedia', function () {
    Mechanic::create(['name' => 'Budi', 'phone' => '081234567890', 'is_active' => true]);

    $user = User::factory()->create();
    $payload = serviceRequestPayload();

    submitServiceRequest($user, $payload)->assertRedirect(
        route('service-requests.index')
    );

    // Kendaraan baru otomatis terdaftar.
    expect(Vehicle::where('user_id', $user->id)->count())->toBe(1);
    expect(Vehicle::where('license_plate', 'B1234XYZ')->exists())->toBeTrue();

    // Pengajuan masuk ke booking_requests lalu langsung jadi order (bookings).
    $bookingRequest = BookingRequest::first();

    expect($bookingRequest->status->value)->toBe('converted');
    expect($bookingRequest->mechanic_id)->not->toBeNull();

    $booking = Booking::first();

    expect($booking)->not->toBeNull();
    expect($booking->booking_request_id)->toBe($bookingRequest->id);
    expect($booking->user_id)->toBe($user->id);
    expect((float) $booking->remaining_amount)->toBe(100000.0);
});

it('masuk antrean tanpa order ketika semua mekanik bentrok di waktu yang sama', function () {
    Mechanic::create(['name' => 'Budi', 'phone' => '081234567890', 'is_active' => true]);

    $startAt = Date::tomorrow()->setTime(9, 0);

    $userA = User::factory()->create();
    $userB = User::factory()->create();

    // Customer A dapat slot.
    submitServiceRequest($userA, serviceRequestPayload())->assertSessionHasNoErrors();

    // Customer B rebutan slot yang sama: hanya satu mekanik, harus masuk antrean.
    submitServiceRequest($userB, serviceRequestPayload([
        'vehicle' => [
            'license_plate' => 'B9999ZZZ',
            'brand' => 'Yamaha',
            'model' => 'Mio',
            'vehicle_type' => 'motorcycle',
        ],
        'requested_start_at' => $startAt->copy()->addMinutes(30),
    ]));

    expect(Booking::count())->toBe(1);
    expect(Booking::where('user_id', $userB->id)->exists())->toBeFalse();

    $requestB = BookingRequest::where('user_id', $userB->id)->first();

    expect($requestB->status->value)->toBe('waiting');
    expect($requestB->failure_reason)->not->toBeNull();
});

it('menolak kendaraan milik customer lain', function () {
    $owner = User::factory()->create();

    $vehicle = Vehicle::create([
        'user_id' => $owner->id,
        'license_plate' => 'D5678ABC',
        'brand' => 'Yamaha',
        'model' => 'NMAX',
        'vehicle_type' => 'motorcycle',
    ]);

    $intruder = User::factory()->create();

    submitServiceRequest($intruder, serviceRequestPayload([
        'vehicle_id' => $vehicle->id,
        'vehicle' => null,
    ]))->assertSessionHasErrors('vehicle_id');

    expect(BookingRequest::count())->toBe(0);
});
