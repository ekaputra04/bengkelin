<?php

use App\Enums\UserRole;
use App\Models\Booking;
use App\Models\BookingRequest;
use App\Models\ServiceType;
use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\Http;

function submitServiceRequest(User $user, array $payload)
{
    return test()->actingAs($user)->post(
        route('service-requests.store'),
        $payload
    );
}

/*
 * Mencegah panggilan sungguhan ke API Xendit saat test.
 */
function fakeXenditInvoice(): void
{
    Http::fake([
        'api.xendit.co/*' => Http::response([
            'id' => 'inv-fake-123',
            'invoice_url' => 'https://checkout.xendit.co/web/inv-fake-123',
            'status' => 'PENDING',
        ]),
    ]);
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

function createMechanicUser(): User
{
    return User::create([
        'name' => 'Budi Santoso',
        'email' => 'budi@bengkelin.test',
        'password' => bcrypt('password'),
        'role' => UserRole::MECHANIC,
        'is_active' => true,
    ]);
}

it('mengubah pengajuan servis menjadi order saat mekanik tersedia', function () {
    fakeXenditInvoice();

    createMechanicUser();

    $user = User::factory()->create();
    $payload = serviceRequestPayload();

    /*
     * Order pending_payment langsung diarahkan ke
     * link pembayaran DP di Xendit.
     */
    submitServiceRequest($user, $payload)->assertRedirect(
        'https://checkout.xendit.co/web/inv-fake-123'
    );

    // Kendaraan baru otomatis terdaftar.
    expect(Vehicle::where('user_id', $user->id)->count())->toBe(1);
    expect(Vehicle::where('license_plate', 'B1234XYZ')->exists())->toBeTrue();

    // Pengajuan masuk ke booking_requests lalu langsung jadi order (bookings).
    $bookingRequest = BookingRequest::first();

    expect($bookingRequest->status->value)->toBe('converted');
    expect($bookingRequest->mechanic_user_id)->not->toBeNull();

    $booking = Booking::first();

    expect($booking)->not->toBeNull();
    expect($booking->booking_request_id)->toBe($bookingRequest->id);
    expect($booking->user_id)->toBe($user->id);
    expect((float) $booking->remaining_amount)->toBe(100000.0);

    // Invoice DP dibuat di Xendit dan disimpan sebagai payment.
    expect($booking->payment)->not->toBeNull();
    expect($booking->payment->status->value)->toBe('pending');
    expect($booking->payment->payment_url)->toBe(
        'https://checkout.xendit.co/web/inv-fake-123'
    );

    /*
     * Regresi: diffInSeconds() Carbon 3 mengembalikan float,
     * Xendit menolak invoice_duration non-integer (400).
     */
    Http::assertSent(function ($request) {
        return str_contains($request->url(), 'api.xendit.co')
            && is_int($request['invoice_duration'])
            && $request['amount'] === 50000;
    });
});

it('masuk antrean tanpa order ketika semua mekanik bentrok di waktu yang sama', function () {
    fakeXenditInvoice();

    createMechanicUser();

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
