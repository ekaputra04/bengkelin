<?php

use App\Enums\BookingRequestStatus;
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
        Schema::create('booking_requests', function (Blueprint $table) {
            $table->id();

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

            $table->dateTime('requested_start_at');
            $table->dateTime('requested_end_at');

            $table->enum('status', array_column(
                BookingRequestStatus::cases(),
                'value'
            ))->default(BookingRequestStatus::WAITING->value);

            $table->string('failure_reason', 255)->nullable();

            $table->timestamps();

            $table->index('user_id');
            $table->index('vehicle_id');
            $table->index('service_type_id');
            $table->index('mechanic_id');
            $table->index('requested_start_at');
            $table->index('requested_end_at');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('booking_requests');
    }
};
