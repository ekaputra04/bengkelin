<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $password = Hash::make('12345678');

        $admins = [
            ['name' => 'Admin Utama', 'email' => 'admin@bengkelin.test'],
            ['name' => 'Sari Dewi', 'email' => 'sari@bengkelin.test'],
        ];

        foreach ($admins as $admin) {
            User::firstOrCreate(
                ['email' => $admin['email']],
                [
                    'name' => $admin['name'],
                    'password' => $password,
                    'role' => UserRole::ADMIN,
                    'is_active' => true,
                ],
            );
        }

        $mechanics = [
            ['name' => 'Budi Santoso', 'email' => 'budi@bengkelin.test'],
            ['name' => 'Andi Wijaya', 'email' => 'andi@bengkelin.test'],
            ['name' => 'Joko Prasetyo', 'email' => 'joko@bengkelin.test'],
            ['name' => 'Rudi Hartono', 'email' => 'rudi@bengkelin.test'],
            ['name' => 'Dedi Kurniawan', 'email' => 'dedi@bengkelin.test'],
        ];

        foreach ($mechanics as $mechanic) {
            User::firstOrCreate(
                ['email' => $mechanic['email']],
                [
                    'name' => $mechanic['name'],
                    'password' => $password,
                    'role' => UserRole::MECHANIC,
                    'is_active' => true,
                ],
            );
        }

        $customers = [
            ['name' => 'Andi Pratama', 'email' => 'andi.pratama@mail.test'],
            ['name' => 'Maya Sari', 'email' => 'maya@mail.test'],
            ['name' => 'Rizky Firmansyah', 'email' => 'rizky@mail.test'],
            ['name' => 'Putri Rahayu', 'email' => 'putri@mail.test'],
            ['name' => 'Fajar Nugroho', 'email' => 'fajar@mail.test'],
            ['name' => 'Diana Putri', 'email' => 'diana@mail.test'],
            ['name' => 'Agus Setiawan', 'email' => 'agus@mail.test'],
            ['name' => 'Lestari Wulan', 'email' => 'lestari@mail.test'],
            ['name' => 'Hendra Kusuma', 'email' => 'hendra@mail.test'],
            ['name' => 'Nina Oktaviani', 'email' => 'nina@mail.test'],
        ];

        foreach ($customers as $customer) {
            User::firstOrCreate(
                ['email' => $customer['email']],
                [
                    'name' => $customer['name'],
                    'password' => $password,
                    'role' => UserRole::CUSTOMER,
                    'is_active' => true,
                ],
            );
        }
    }
}
