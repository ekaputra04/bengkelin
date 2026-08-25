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
        ];
    }

    public function messages(): array
    {
        return [
            'status.in' => 'Status pengerjaan tidak valid.',
        ];
    }
}
