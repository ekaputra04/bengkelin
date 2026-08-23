<?php

namespace Database\Seeders;

use App\Models\Mechanic;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MechanicSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $mechanics = [
            ['name' => 'Budi Santoso', 'phone' => '081234567001'],
            ['name' => 'Andi Wijaya', 'phone' => '081234567002'],
            ['name' => 'Joko Prasetyo', 'phone' => '081234567003'],
        ];

        foreach ($mechanics as $mechanic) {
            Mechanic::firstOrCreate(
                ['name' => $mechanic['name']],
                $mechanic + ['is_active' => true],
            );
        }
    }
}
