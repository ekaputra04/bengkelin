<?php

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
        Schema::create('webhook_logs', function (Blueprint $table) {
            $table->id();

            $table->foreignId('payment_id')
                ->nullable()
                ->constrained()
                ->nullOnDelete();

            $table->string('event_type', 100);

            $table->string('transaction_id', 150)
                ->nullable();

            $table->string('signature', 500)
                ->nullable();

            $table->json('payload');

            $table->boolean('is_valid');

            $table->dateTime('processed_at')->nullable();

            $table->timestamp('created_at')->useCurrent();

            $table->index('payment_id');
            $table->index('transaction_id');
            $table->index('event_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('webhook_logs');
    }
};
