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
            'name' => [
                'sometimes',
                'string',
                'max:255',
                Rule::unique('sprints', 'name')
                    ->ignore($this->route('sprint'))
                    ->where(fn ($query) => $query->where('project_id', $this->route('sprint')->project_id)),
            ],
            'description' => ['nullable', 'string'],
            'status' => ['nullable', Rule::enum(StatusEnum::class)],
            'next_sprint_id' => ['nullable', 'integer', 'exists:sprints,id'],
        ];
    }
}
