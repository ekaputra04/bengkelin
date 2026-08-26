<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreBookingRequestRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            // Pilih kendaraan yang sudah terdaftar, atau daftarkan baru lewat input `vehicle`.
            'vehicle_id' => [
                'required_without:vehicle.license_plate',
                'nullable',
                'integer',
                Rule::exists('vehicles', 'id')
                    ->where(
                        fn($query) => $query->where('user_id', $this->user()->id)
                    ),
            ],

            'vehicle' => ['nullable', 'array'],

            'vehicle.license_plate' => [
                'required_without:vehicle_id',
                'nullable',
                'string',
                'max:20',
                Rule::unique('vehicles', 'license_plate'),
            ],

            'vehicle.brand' => [
                'required_without:vehicle_id',
                'nullable',
                'string',
                'max:100',
            ],

            'vehicle.model' => [
                'required_without:vehicle_id',
                'nullable',
                'string',
                'max:100',
            ],

            'vehicle.vehicle_type' => [
                'required_without:vehicle_id',
                'nullable',
                'string',
                Rule::in(['motorcycle', 'car']),
            ],

            'vehicle.year' => [
                'nullable',
                'integer',
                'min:1980',
                'max:' . (now()->year + 1),
            ],

            'service_type_id' => [
                'required',
                'integer',
                Rule::exists('service_types', 'id')
                    ->where(
                        fn($query) => $query->where('is_active', true)
                    ),
            ],

            'requested_start_at' => [
                'required',
                'date',
                // 'after:now',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'vehicle_id.required_without' => 'Pilih kendaraan atau daftarkan kendaraan baru.',

            'vehicle_id.exists' => 'Kendaraan tidak ditemukan.',

            'vehicle.license_plate.required_without' => 'Plat nomor wajib diisi untuk kendaraan baru.',

            'vehicle.license_plate.unique' => 'Plat nomor sudah pernah didaftarkan.',

            'vehicle.brand.required_without' => 'Merek kendaraan wajib diisi.',

            'vehicle.model.required_without' => 'Model kendaraan wajib diisi.',

            'vehicle.vehicle_type.required_without' => 'Jenis kendaraan wajib dipilih.',

            'vehicle.vehicle_type.in' => 'Jenis kendaraan tidak valid.',

            'service_type_id.exists' => 'Jenis servis tidak tersedia.',

            // 'requested_start_at.after' => 'Waktu servis harus setelah waktu sekarang.',
        ];
    }
}