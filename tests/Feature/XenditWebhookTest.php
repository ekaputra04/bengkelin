<?php

use App\Enums\BookingRequestStatus;
use App\Enums\BookingStatus;
use App\Enums\PaymentStatus;
use App\Enums\UserRole;
use App\Models\Booking;
use App\Models\BookingRequest;
use App\Models\Payment;
use App\Models\ServiceType;
use App\Models\User;
use App\Models\Vehicle;
use App\Models\WebhookLog;
use Illuminate\Testing\TestResponse;

beforeEach(function () {
    config(['services.xendit.webhook_secret' => 'test-secret']);
});

function pendingBookingWithPayment(): array
{
    $user = User::factory()->create();

    $vehicle = Vehicle::create([
        'user_id' => $user->id,
        'license_plate' => 'B1WEBHOOK',
        'brand' => 'Honda',
        'model' => 'Beat',
        'vehicle_type' => 'motorcycle',
    ]);

    $serviceType = ServiceType::create([
        'name' => 'Ganti Oli',
        'description' => null,
        'duration_minutes' => 60,
        'price' => 150000,
        'dp_amount' => 50000,
        'is_active' => true,
    ]);

    $mechanic = User::create([
        'name' => 'Budi Santoso',
        'email' => 'budi-webhook@bengkelin.test',
        'password' => bcrypt('password'),
        'role' => UserRole::MECHANIC,
        'is_active' => true,
    ]);

    $bookingRequest = BookingRequest::create([
        'user_id' => $user->id,
        'vehicle_id' => $vehicle->id,
        'service_type_id' => $serviceType->id,
        'mechanic_user_id' => $mechanic->id,
        'requested_start_at' => now()->addDay(),
        'status' => BookingRequestStatus::CONVERTED,
    ]);

    $booking = Booking::create([
        'booking_code' => 'BK-WEBHOOK-01',
        'booking_request_id' => $bookingRequest->id,
        'user_id' => $user->id,
        'vehicle_id' => $vehicle->id,
        'service_type_id' => $serviceType->id,
        'mechanic_user_id' => $mechanic->id,
        'start_at' => now()->addDay(),
        'end_at' => now()->addDay()->addHour(),
        'service_price' => 150000,
        'dp_amount' => 50000,
        'remaining_amount' => 100000,
        'status' => BookingStatus::PENDING_PAYMENT,
        'payment_expired_at' => now()->addMinutes(15),
    ]);

    $payment = $booking->payment()->create([
        'transaction_id' => 'inv-test-123',
        'order_id' => 'DP-BK-WEBHOOK-01-AAAA',
        'amount' => 50000,
        'status' => PaymentStatus::PENDING,
        'payment_url' => 'https://checkout.xendit.co/web/inv-test-123',
        'expired_at' => now()->addMinutes(15),
    ]);

    return [$booking, $payment];
}

function sendWebhook(Payment $payment, string $status): TestResponse
{
    return test()->postJson(
        route('webhooks.xendit'),
        [
            'id' => $payment->transaction_id,
            'external_id' => $payment->order_id,
            'status' => $status,
            'paid_amount' => $status === 'PAID' ? 50000 : 0,
        ],
        ['x-callback-token' => 'test-secret']
    );
}

it('menolak callback dengan callback token yang salah', function () {
    [$booking, $payment] = pendingBookingWithPayment();

    $this->postJson(
        route('webhooks.xendit'),
        ['id' => $payment->transaction_id, 'status' => 'PAID'],
        ['x-callback-token' => 'token-palsu']
    )->assertUnauthorized();

    expect(WebhookLog::latest('id')->first()->is_valid)->toBeFalse();
    expect($booking->fresh()->status)->toBe(BookingStatus::PENDING_PAYMENT);
    expect($payment->fresh()->status)->toBe(PaymentStatus::PENDING);
});

it('mengubah payment menjadi paid dan booking menjadi confirmed', function () {
    [$booking, $payment] = pendingBookingWithPayment();

    sendWebhook($payment, 'PAID')->assertOk();

    $payment = $payment->fresh();
    $booking = $booking->fresh();

    expect($payment->status)->toBe(PaymentStatus::PAID);
    expect($payment->paid_at)->not->toBeNull();

    expect($booking->status)->toBe(BookingStatus::CONFIRMED);
    expect($booking->confirmed_at)->not->toBeNull();

    $log = WebhookLog::latest('id')->first();

    expect($log->is_valid)->toBeTrue();
    expect($log->event_type)->toBe('invoice.paid');
    expect($log->processed_at)->not->toBeNull();
});

it('mengubah payment dan booking menjadi expired', function () {
    [$booking, $payment] = pendingBookingWithPayment();

    sendWebhook($payment, 'EXPIRED')->assertOk();

    expect($payment->fresh()->status)->toBe(PaymentStatus::EXPIRED);
    expect($booking->fresh()->status)->toBe(BookingStatus::EXPIRED);
});

it('idempoten ketika callback paid dikirim ulang', function () {
    [$booking, $payment] = pendingBookingWithPayment();

    sendWebhook($payment, 'PAID')->assertOk();

    $paidAt = $payment->fresh()->paid_at;

    sendWebhook($payment, 'PAID')->assertOk();

    expect($payment->fresh()->paid_at->equalTo($paidAt))->toBeTrue();
    expect($booking->fresh()->status)->toBe(BookingStatus::CONFIRMED);
});
