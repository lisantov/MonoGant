<?php

namespace App\Http\Requests\Sprint;

use App\Enums\StatusEnum;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSprintRequest extends FormRequest
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
            'name' => ['sometimes', 'string', 'max:255', 'unique:sprints,name'],
            'description' => ['nullable', 'string'],
            'started_at' => ['nullable', 'date'],
            'deadline_at' => ['nullable', 'date'],
            'status' => ['nullable', Rule::enum(StatusEnum::class)],
        ];
    }
}
