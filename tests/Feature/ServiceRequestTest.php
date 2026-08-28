<?php

use App\Enums\UserRole;
use App\Enums\BookingRequestStatus;
use App\Enums\BookingStatus;
use App\Models\Booking;
use App\Models\BookingRequest;
use App\Models\ServiceType;
use App\Models\User;
use App\Models\Vehicle;
use App\Services\Booking\ProcessBookingRequest;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\Http;

function submitServiceRequest(User $user, array $payload)
{
    return test()->actingAs($user)->post(
        route($user->role->value . '.service-requests.store'),
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

    expect($bookingRequest->status->value)->toBe('processing');
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

it('admin dapat mengajukan service request untuk customer terdaftar dengan kendaraan baru', function () {
    fakeXenditInvoice();

    createMechanicUser();

    $admin = User::factory()->create([
        'role' => UserRole::ADMIN,
    ]);

    $customer = User::factory()->create([
        'role' => UserRole::CUSTOMER,
    ]);

    submitServiceRequest($admin, serviceRequestPayload([
        'user_id' => $customer->id,
    ]))->assertRedirect('https://checkout.xendit.co/web/inv-fake-123');

    $vehicle = Vehicle::where('user_id', $customer->id)->first();
    $booking = Booking::first();

    expect($vehicle)->not->toBeNull();
    expect($booking)->not->toBeNull();
    expect($booking->user_id)->toBe($customer->id);
    expect($booking->vehicle_id)->toBe($vehicle->id);
});

it('admin dapat memilih kendaraan existing milik customer yang dipilih', function () {
    fakeXenditInvoice();

    createMechanicUser();

    $admin = User::factory()->create([
        'role' => UserRole::ADMIN,
    ]);

    $customer = User::factory()->create([
        'role' => UserRole::CUSTOMER,
    ]);

    $vehicle = Vehicle::create([
        'user_id' => $customer->id,
        'license_plate' => 'B2026ADM',
        'brand' => 'Toyota',
        'model' => 'Avanza',
        'vehicle_type' => 'car',
    ]);

    submitServiceRequest($admin, serviceRequestPayload([
        'user_id' => $customer->id,
        'vehicle_id' => $vehicle->id,
        'vehicle' => null,
    ]))->assertRedirect('https://checkout.xendit.co/web/inv-fake-123');

    expect(Booking::first()->user_id)->toBe($customer->id);
    expect(Booking::first()->vehicle_id)->toBe($vehicle->id);
});

it('admin tidak dapat memilih kendaraan milik customer lain', function () {
    $admin = User::factory()->create([
        'role' => UserRole::ADMIN,
    ]);

    $customerA = User::factory()->create([
        'role' => UserRole::CUSTOMER,
    ]);

    $customerB = User::factory()->create([
        'role' => UserRole::CUSTOMER,
    ]);

    $vehicle = Vehicle::create([
        'user_id' => $customerA->id,
        'license_plate' => 'B2026BAD',
        'brand' => 'Honda',
        'model' => 'Brio',
        'vehicle_type' => 'car',
    ]);

    submitServiceRequest($admin, serviceRequestPayload([
        'user_id' => $customerB->id,
        'vehicle_id' => $vehicle->id,
        'vehicle' => null,
    ]))->assertSessionHasErrors('vehicle_id');

    expect(BookingRequest::count())->toBe(0);
});

it('menahan request overlap selama booking sebelumnya masih in_progress', function () {
    $mechanic = createMechanicUser();

    $serviceType = ServiceType::create([
        'name' => 'Servis Mesin',
        'description' => null,
        'duration_minutes' => 60,
        'price' => 200000,
        'dp_amount' => 50000,
        'is_active' => true,
    ]);

    $userA = User::factory()->create();
    $userB = User::factory()->create();

    $vehicleA = Vehicle::create([
        'user_id' => $userA->id,
        'license_plate' => 'DK1111AAA',
        'brand' => 'Honda',
        'model' => 'Beat',
        'vehicle_type' => 'motorcycle',
    ]);

    $vehicleB = Vehicle::create([
        'user_id' => $userB->id,
        'license_plate' => 'DK2222BBB',
        'brand' => 'Yamaha',
        'model' => 'Mio',
        'vehicle_type' => 'motorcycle',
    ]);

    $startAt = Date::tomorrow()->setTime(7, 5);

    BookingRequest::create([
        'user_id' => $userA->id,
        'vehicle_id' => $vehicleA->id,
        'service_type_id' => $serviceType->id,
        'mechanic_user_id' => $mechanic->id,
        'requested_start_at' => $startAt,
        'requested_end_at' => $startAt->copy()->addMinutes(60),
        'status' => BookingRequestStatus::PROCESSING,
    ]);

    Booking::create([
        'booking_code' => 'BK-LOCK-'.uniqid(),
        'booking_request_id' => BookingRequest::first()->id,
        'user_id' => $userA->id,
        'vehicle_id' => $vehicleA->id,
        'service_type_id' => $serviceType->id,
        'mechanic_user_id' => $mechanic->id,
        'start_at' => $startAt,
        'end_at' => $startAt->copy()->addMinutes(60),
        'service_price' => 200000,
        'dp_amount' => 50000,
        'remaining_amount' => 150000,
        'status' => BookingStatus::IN_PROGRESS,
        'confirmed_at' => $startAt->copy()->subMinutes(10),
    ]);

    $requestB = BookingRequest::create([
        'user_id' => $userB->id,
        'vehicle_id' => $vehicleB->id,
        'service_type_id' => $serviceType->id,
        'requested_start_at' => $startAt->copy()->addMinutes(30),
        'status' => BookingRequestStatus::WAITING,
    ]);

    $booking = app(ProcessBookingRequest::class)->execute($requestB);

    expect($booking)->toBeNull();
    expect($requestB->fresh()->status)->toBe(BookingRequestStatus::WAITING);
});

it('mengizinkan request baru setelah melewati end_at estimasi walau booking sebelumnya masih in_progress', function () {
    $mechanic = createMechanicUser();

    $serviceType = ServiceType::create([
        'name' => 'Servis Rem',
        'description' => null,
        'duration_minutes' => 60,
        'price' => 180000,
        'dp_amount' => 50000,
        'is_active' => true,
    ]);

    $userA = User::factory()->create();
    $userB = User::factory()->create();

    $vehicleA = Vehicle::create([
        'user_id' => $userA->id,
        'license_plate' => 'DK3333CCC',
        'brand' => 'Honda',
        'model' => 'Vario',
        'vehicle_type' => 'motorcycle',
    ]);

    $vehicleB = Vehicle::create([
        'user_id' => $userB->id,
        'license_plate' => 'DK4444DDD',
        'brand' => 'Suzuki',
        'model' => 'Nex',
        'vehicle_type' => 'motorcycle',
    ]);

    $startAt = Date::tomorrow()->setTime(7, 5);

    $requestA = BookingRequest::create([
        'user_id' => $userA->id,
        'vehicle_id' => $vehicleA->id,
        'service_type_id' => $serviceType->id,
        'mechanic_user_id' => $mechanic->id,
        'requested_start_at' => $startAt,
        'requested_end_at' => $startAt->copy()->addMinutes(60),
        'status' => BookingRequestStatus::PROCESSING,
    ]);

    Booking::create([
        'booking_code' => 'BK-PREV-'.uniqid(),
        'booking_request_id' => $requestA->id,
        'user_id' => $userA->id,
        'vehicle_id' => $vehicleA->id,
        'service_type_id' => $serviceType->id,
        'mechanic_user_id' => $mechanic->id,
        'start_at' => $startAt,
        'end_at' => $startAt->copy()->addMinutes(60),
        'service_price' => 180000,
        'dp_amount' => 50000,
        'remaining_amount' => 130000,
        'status' => BookingStatus::IN_PROGRESS,
        'confirmed_at' => $startAt->copy()->subMinutes(10),
    ]);

    $requestB = BookingRequest::create([
        'user_id' => $userB->id,
        'vehicle_id' => $vehicleB->id,
        'service_type_id' => $serviceType->id,
        'requested_start_at' => $startAt->copy()->addMinutes(61),
        'status' => BookingRequestStatus::WAITING,
    ]);

    $booking = app(ProcessBookingRequest::class)->execute($requestB);

    expect($booking)->not->toBeNull();
    expect($booking->start_at->format('H:i'))->toBe('08:06');
    expect($booking->end_at->format('H:i'))->toBe('09:06');
    expect($requestB->fresh()->status)->toBe(BookingRequestStatus::PROCESSING);
});

it('menolak request yang masuk di sela dua booking bila masih overlap booking berikutnya', function () {
    $mechanic = createMechanicUser();

    $serviceTypeA = ServiceType::create([
        'name' => 'Servis Ringan',
        'description' => null,
        'duration_minutes' => 40,
        'price' => 120000,
        'dp_amount' => 40000,
        'is_active' => true,
    ]);

    $serviceTypeB = ServiceType::create([
        'name' => 'Servis Cepat',
        'description' => null,
        'duration_minutes' => 30,
        'price' => 100000,
        'dp_amount' => 30000,
        'is_active' => true,
    ]);

    $serviceTypeC = ServiceType::create([
        'name' => 'Cuci Injeksi',
        'description' => null,
        'duration_minutes' => 30,
        'price' => 150000,
        'dp_amount' => 50000,
        'is_active' => true,
    ]);

    $userA = User::factory()->create();
    $userB = User::factory()->create();
    $userC = User::factory()->create();

    $vehicleA = Vehicle::create([
        'user_id' => $userA->id,
        'license_plate' => 'DK5555EEE',
        'brand' => 'Honda',
        'model' => 'Scoopy',
        'vehicle_type' => 'motorcycle',
    ]);

    $vehicleB = Vehicle::create([
        'user_id' => $userB->id,
        'license_plate' => 'DK6666FFF',
        'brand' => 'Yamaha',
        'model' => 'Lexi',
        'vehicle_type' => 'motorcycle',
    ]);

    $vehicleC = Vehicle::create([
        'user_id' => $userC->id,
        'license_plate' => 'DK7777GGG',
        'brand' => 'Suzuki',
        'model' => 'Address',
        'vehicle_type' => 'motorcycle',
    ]);

    $requestA = BookingRequest::create([
        'user_id' => $userA->id,
        'vehicle_id' => $vehicleA->id,
        'service_type_id' => $serviceTypeA->id,
        'mechanic_user_id' => $mechanic->id,
        'requested_start_at' => Date::tomorrow()->setTime(7, 5),
        'requested_end_at' => Date::tomorrow()->setTime(7, 45),
        'status' => BookingRequestStatus::CONVERTED,
    ]);

    Booking::create([
        'booking_code' => 'BK-A-'.uniqid(),
        'booking_request_id' => $requestA->id,
        'user_id' => $userA->id,
        'vehicle_id' => $vehicleA->id,
        'service_type_id' => $serviceTypeA->id,
        'mechanic_user_id' => $mechanic->id,
        'start_at' => Date::tomorrow()->setTime(7, 5),
        'end_at' => Date::tomorrow()->setTime(7, 45),
        'service_price' => 120000,
        'dp_amount' => 40000,
        'remaining_amount' => 80000,
        'status' => BookingStatus::CONFIRMED,
        'confirmed_at' => Date::tomorrow()->setTime(6, 55),
    ]);

    $requestB = BookingRequest::create([
        'user_id' => $userB->id,
        'vehicle_id' => $vehicleB->id,
        'service_type_id' => $serviceTypeB->id,
        'mechanic_user_id' => $mechanic->id,
        'requested_start_at' => Date::tomorrow()->setTime(8, 0),
        'requested_end_at' => Date::tomorrow()->setTime(8, 30),
        'status' => BookingRequestStatus::CONVERTED,
    ]);

    Booking::create([
        'booking_code' => 'BK-B-'.uniqid(),
        'booking_request_id' => $requestB->id,
        'user_id' => $userB->id,
        'vehicle_id' => $vehicleB->id,
        'service_type_id' => $serviceTypeB->id,
        'mechanic_user_id' => $mechanic->id,
        'start_at' => Date::tomorrow()->setTime(8, 0),
        'end_at' => Date::tomorrow()->setTime(8, 30),
        'service_price' => 100000,
        'dp_amount' => 30000,
        'remaining_amount' => 70000,
        'status' => BookingStatus::CONFIRMED,
        'confirmed_at' => Date::tomorrow()->setTime(7, 50),
    ]);

    $requestC = BookingRequest::create([
        'user_id' => $userC->id,
        'vehicle_id' => $vehicleC->id,
        'service_type_id' => $serviceTypeC->id,
        'requested_start_at' => Date::tomorrow()->setTime(7, 46),
        'status' => BookingRequestStatus::WAITING,
    ]);

    $bookingC = app(ProcessBookingRequest::class)->execute($requestC);

    expect($bookingC)->toBeNull();
    expect($requestC->fresh()->status)->toBe(BookingRequestStatus::WAITING);
    expect($requestC->fresh()->failure_reason)->not->toBeNull();
});
