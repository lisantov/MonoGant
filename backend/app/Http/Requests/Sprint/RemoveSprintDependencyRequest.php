<?php

namespace App\Http\Requests\Sprint;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class RemoveSprintDependencyRequest extends FormRequest
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
            'predecessor_id' => ['required_without:successor_id', 'integer', 'prohibits:successor_id', 'exists:sprints,id'],
            'successor_id' => ['required_without:predecessor_id', 'integer', 'prohibits:predecessor_id', 'exists:sprints,id'],
        ];
    }
}
