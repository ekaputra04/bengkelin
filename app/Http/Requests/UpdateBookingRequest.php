<?php

namespace App\Http\Requests;

use App\Enums\UserRole;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateBookingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->role === UserRole::ADMIN;
    }

    public function rules(): array
    {
        return [
            'status' => [
                'required',
                Rule::in(['in_progress', 'completed', 'no_show']),
            ],
            'end_time' => [
                'nullable',
                'date_format:H:i',
                'required_if:status,completed',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'status.in' => 'Status pengerjaan tidak valid.',
            'end_time.date_format' => 'Jam selesai tidak valid.',
            'end_time.required_if' => 'Jam selesai wajib diisi saat menyelesaikan order.',
        ];
    }
}
