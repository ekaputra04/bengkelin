<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(MechanicSeeder::class);

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        // Akun admin untuk modul operasional (pengerjaan bengkel).
        User::factory()->create([
            'name' => 'Admin Bengkelin',
            'email' => 'admin@bengkelin.test',
            'role' => UserRole::ADMIN,
        ]);
    }
}
