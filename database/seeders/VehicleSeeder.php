<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Database\Seeder;

class VehicleSeeder extends Seeder
{
    public function run(): void
    {
        $customers = User::where('role', 'customer')->get();

        $vehicles = [
            ['license_plate' => 'B1234ABC', 'brand' => 'Honda', 'model' => 'Beat 110', 'vehicle_type' => 'motorcycle', 'year' => 2022],
            ['license_plate' => 'B5678DEF', 'brand' => 'Honda', 'model' => 'Vario 160', 'vehicle_type' => 'motorcycle', 'year' => 2023],
            ['license_plate' => 'D9012GHI', 'brand' => 'Yamaha', 'model' => 'NMAX', 'vehicle_type' => 'motorcycle', 'year' => 2023],
            ['license_plate' => 'B3456JKL', 'brand' => 'Yamaha', 'model' => 'Mio Soul', 'vehicle_type' => 'motorcycle', 'year' => 2021],
            ['license_plate' => 'L7890MNO', 'brand' => 'Suzuki', 'model' => 'Address 125', 'vehicle_type' => 'motorcycle', 'year' => 2022],
            ['license_plate' => 'B1122PQR', 'brand' => 'Toyota', 'model' => 'Avanza', 'vehicle_type' => 'car', 'year' => 2020],
            ['license_plate' => 'D3344STU', 'brand' => 'Honda', 'model' => 'Brio', 'vehicle_type' => 'car', 'year' => 2021],
            ['license_plate' => 'B5566VWX', 'brand' => 'Daihatsu', 'model' => 'Xenia', 'vehicle_type' => 'car', 'year' => 2022],
            ['license_plate' => 'L7788YZA', 'brand' => 'Toyota', 'model' => 'Innova', 'vehicle_type' => 'car', 'year' => 2019],
            ['license_plate' => 'B9900BCD', 'brand' => 'Honda', 'model' => 'CR-V', 'vehicle_type' => 'car', 'year' => 2023],
            ['license_plate' => 'DK1101EFG', 'brand' => 'Suzuki', 'model' => 'Ertiga', 'vehicle_type' => 'car', 'year' => 2022],
            ['license_plate' => 'N2202HIJ', 'brand' => 'Toyota', 'model' => 'Agya', 'vehicle_type' => 'car', 'year' => 2021],
            ['license_plate' => 'AB3303KLM', 'brand' => 'Mitsubishi', 'model' => 'Xpander', 'vehicle_type' => 'car', 'year' => 2023],
            ['license_plate' => 'DK4404NOP', 'brand' => 'Toyota', 'model' => 'Rush', 'vehicle_type' => 'car', 'year' => 2020],
            ['license_plate' => 'P5505QRS', 'brand' => 'Honda', 'model' => 'Scoopy', 'vehicle_type' => 'motorcycle', 'year' => 2024],
        ];

        $index = 0;

        foreach ($customers as $customer) {
            // Setiap customer dapat 1-2 kendaraan
            $count = $index % 3 === 0 ? 2 : 1;

            for ($i = 0; $i < $count; $i++) {
                $vehicleData = $vehicles[$index % count($vehicles)];

                Vehicle::updateOrCreate(
                    ['license_plate' => $vehicleData['license_plate']],
                    [
                        'user_id' => $customer->id,
                        'brand' => $vehicleData['brand'],
                        'model' => $vehicleData['model'],
                        'vehicle_type' => $vehicleData['vehicle_type'],
                        'year' => $vehicleData['year'],
                    ],
                );

                $index++;
            }
        }
    }
}
