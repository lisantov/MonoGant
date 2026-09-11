<?php

namespace App\Http\Requests\Sprint;

use App\Enums\StatusEnum;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreSprintRequest extends FormRequest
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
                'required',
                'string',
                'max:255',
                Rule::unique('sprints', 'name')->where(fn ($query) => $query->where('project_id', $this->route('project')->id)),
            ],
            'description' => ['nullable', 'string', 'max:255', 'min:0'],
            'status' => ['nullable', Rule::enum(StatusEnum::class)],
        ];
    }
}
