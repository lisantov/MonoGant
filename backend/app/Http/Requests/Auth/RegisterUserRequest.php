<?php

namespace App\Http\Requests\Auth;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class RegisterUserRequest extends FormRequest
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
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'name' => ['required', 'string', 'min:1', 'max:50', 'regex:/^[а-яА-ЯёЁA-Za-z0-9-_ ]+$/u'],
            'password' => ['required', 'string', 'min:6', 'regex:/^[A-Za-z0-9%:\.,\(\)\[\]\{\};\*\!\/<>\_\-\–@#\?\']+$/'],
        ];
    }
}
