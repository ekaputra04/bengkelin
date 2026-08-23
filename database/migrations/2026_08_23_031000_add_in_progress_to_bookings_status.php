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
        Schema::table('bookings', function (Blueprint $table) {
            $table->enum('status', array_column(
                BookingStatus::cases(),
                'value'
            ))->default(BookingStatus::PENDING_PAYMENT->value)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->enum('status', [
                BookingStatus::PENDING_PAYMENT->value,
                BookingStatus::CONFIRMED->value,
                BookingStatus::COMPLETED->value,
                BookingStatus::CANCELLED->value,
                BookingStatus::EXPIRED->value,
                BookingStatus::NO_SHOW->value,
            ])->default(BookingStatus::PENDING_PAYMENT->value)->change();
        });
    }
};
