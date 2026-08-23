<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreServiceTypeRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'string',
                'max:100',
                'unique:service_types,name',
            ],
            'description' => [
                'nullable',
                'string',
            ],
            'duration_minutes' => [
                'required',
                'integer',
                'min:1',
            ],
            'price' => [
                'required',
                'numeric',
                'min:0',
            ],
            'dp_amount' => [
                'required',
                'numeric',
                'min:0',
                'lte:price',
            ],
            'is_active' => [
                'boolean',
            ],
        ];
    }
}
