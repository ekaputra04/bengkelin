<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('booking_requests', function (Blueprint $table) {
            $table->dropForeign(['mechanic_id']);
            $table->dropIndex(['mechanic_id']);
            $table->renameColumn('mechanic_id', 'mechanic_user_id');
            $table->foreign('mechanic_user_id')
                ->references('id')
                ->on('users')
                ->nullOnDelete();
            $table->index('mechanic_user_id');
        });

        Schema::table('bookings', function (Blueprint $table) {
            $table->dropForeign(['mechanic_id']);
            $table->dropIndex(['mechanic_id']);
            $table->dropIndex(['mechanic_id', 'start_at', 'end_at']);
            $table->renameColumn('mechanic_id', 'mechanic_user_id');
            $table->foreign('mechanic_user_id')
                ->references('id')
                ->on('users')
                ->restrictOnDelete();
            $table->index('mechanic_user_id');
            $table->index(['mechanic_user_id', 'start_at', 'end_at']);
        });

        Schema::dropIfExists('mechanics');
    }

    public function down(): void
    {

        Schema::table('bookings', function (Blueprint $table) {
            $table->dropForeign(['mechanic_user_id']);
            $table->dropIndex(['mechanic_user_id']);
            $table->dropIndex(['mechanic_user_id', 'start_at', 'end_at']);
            $table->renameColumn('mechanic_user_id', 'mechanic_id');
            $table->foreign('mechanic_id')
                ->references('id')
                ->on('mechanics')
                ->restrictOnDelete();
            $table->index('mechanic_id');
            $table->index(['mechanic_id', 'start_at', 'end_at']);
        });

        Schema::table('booking_requests', function (Blueprint $table) {
            $table->dropForeign(['mechanic_user_id']);
            $table->dropIndex(['mechanic_user_id']);
            $table->renameColumn('mechanic_user_id', 'mechanic_id');
            $table->foreign('mechanic_id')
                ->references('id')
                ->on('mechanics')
                ->nullOnDelete();
            $table->index('mechanic_id');
        });
    }
};
