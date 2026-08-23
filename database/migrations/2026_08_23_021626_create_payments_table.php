<?php

use App\Enums\PaymentStatus;
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
        Schema::create('payments', function (Blueprint $table) {
            $table->id();

            $table->foreignId('booking_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->string('transaction_id', 150)
                ->nullable()
                ->unique();

            $table->string('order_id', 150)
                ->nullable()
                ->unique();

            $table->decimal('amount', 15, 2);

            $table->enum('status', array_column(
                PaymentStatus::cases(),
                'value'
            ))->default(PaymentStatus::PENDING->value);

            $table->text('payment_url')->nullable();

            $table->dateTime('paid_at')->nullable();
            $table->dateTime('expired_at')->nullable();
            $table->dateTime('failed_at')->nullable();

            $table->json('raw_response')->nullable();

            $table->timestamps();

            $table->index('booking_id');
            $table->index('transaction_id');
            $table->index('order_id');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
