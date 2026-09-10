<?php

namespace App\Http\Requests\Task;

use App\Enums\StatusEnum;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTaskRequest extends FormRequest
{
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
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'started_at' => ['required', 'date'],
            'deadline_at' => ['required', 'date', 'after_or_equal:started_at'],
            'status' => ['nullable', Rule::enum(StatusEnum::class)],
            'user_email' => ['nullable', 'email', 'exists:users,email'],
        ];
    }
}
