<?php

use App\Enums\BookingStatus;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();

            $table->string('booking_code', 30)->unique();

            $table->foreignId('booking_request_id')
                ->unique()
                ->constrained()
                ->restrictOnDelete();

            $table->foreignId('user_id')
                ->constrained()
                ->restrictOnDelete();

            $table->foreignId('vehicle_id')
                ->constrained()
                ->restrictOnDelete();

            $table->foreignId('service_type_id')
                ->constrained()
                ->restrictOnDelete();

            $table->foreignId('mechanic_id')
                ->constrained()
                ->restrictOnDelete();

            $table->dateTime('start_at');
            $table->dateTime('end_at');

            $table->decimal('service_price', 15, 2);
            $table->decimal('dp_amount', 15, 2);
            $table->decimal('remaining_amount', 15, 2);

            $table->enum('status', array_column(
                BookingStatus::cases(),
                'value'
            ))->default(BookingStatus::PENDING_PAYMENT->value);

            $table->dateTime('payment_expired_at')->nullable();

            $table->dateTime('confirmed_at')->nullable();
            $table->dateTime('completed_at')->nullable();
            $table->dateTime('cancelled_at')->nullable();
            $table->dateTime('no_show_at')->nullable();

            $table->text('notes')->nullable();

            $table->timestamps();

            $table->index('user_id');
            $table->index('vehicle_id');
            $table->index('service_type_id');
            $table->index('mechanic_id');
            $table->index('start_at');
            $table->index('end_at');
            $table->index('status');

            $table->index([
                'mechanic_id',
                'start_at',
                'end_at',
            ]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
