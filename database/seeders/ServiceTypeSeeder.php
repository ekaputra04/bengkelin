<?php

namespace Database\Seeders;

use App\Models\ServiceType;
use Illuminate\Database\Seeder;

class ServiceTypeSeeder extends Seeder
{
    public function run(): void
    {
        $services = [
            [
                'name' => 'Ganti Oli Mesin',
                'description' => 'Penggantian oli mesin standar pabrik',
                'duration_minutes' => 30,
                'price' => 80000,
                'dp_amount' => 30000,
                'is_active' => true,
            ],
            [
                'name' => 'Servis Ringan',
                'description' => 'Pengecekan dan penyetelan ringan: busi, filter udara, rantai',
                'duration_minutes' => 60,
                'price' => 150000,
                'dp_amount' => 50000,
                'is_active' => true,
            ],
            [
                'name' => 'Servis Besar',
                'description' => 'Servis lengkap: ganti oli, filter, busi, rem, roda',
                'duration_minutes' => 120,
                'price' => 350000,
                'dp_amount' => 100000,
                'is_active' => true,
            ],
            [
                'name' => 'Ganti Ban',
                'description' => 'Penggantian ban dalam/luar sesuai ukuran',
                'duration_minutes' => 45,
                'price' => 120000,
                'dp_amount' => 50000,
                'is_active' => true,
            ],
            [
                'name' => 'Tune Up Mesin',
                'description' => 'Tune up mesin untuk performa optimal',
                'duration_minutes' => 90,
                'price' => 250000,
                'dp_amount' => 75000,
                'is_active' => true,
            ],
            [
                'name' => 'Ganti Kampas Rem',
                'description' => 'Penggantian kampas rem depan dan belakang',
                'duration_minutes' => 60,
                'price' => 100000,
                'dp_amount' => 40000,
                'is_active' => true,
            ],
            [
                'name' => 'Perawatan CVT',
                'description' => 'Pembersihan dan penyetelan CVT motor matic',
                'duration_minutes' => 90,
                'price' => 200000,
                'dp_amount' => 60000,
                'is_active' => true,
            ],
            [
                'name' => 'Cek & Isi Freon AC',
                'description' => 'Pengecekan, vacum, dan pengisian freon AC mobil',
                'duration_minutes' => 60,
                'price' => 300000,
                'dp_amount' => 100000,
                'is_active' => true,
            ],
            [
                'name' => 'Overhaul Mesin',
                'description' => 'Pembongkaran dan perbaikan total mesin',
                'duration_minutes' => 480,
                'price' => 2500000,
                'dp_amount' => 500000,
                'is_active' => false,
            ],
        ];

        foreach ($services as $service) {
            ServiceType::firstOrCreate(
                ['name' => $service['name']],
                $service,
            );
        }
    }
}
