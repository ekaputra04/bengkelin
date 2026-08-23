<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateServiceTypeRequest extends FormRequest
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
        $serviceType = $this->route('service_type');

        return [
            'name' => [
                'required',
                'string',
                'max:100',
                Rule::unique('service_types', 'name')
                    ->ignore($serviceType),
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
