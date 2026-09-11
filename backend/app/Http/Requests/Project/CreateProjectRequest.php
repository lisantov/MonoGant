<?php

namespace App\Http\Requests\Project;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Carbon;
use Illuminate\Validation\Validator;

class CreateProjectRequest extends FormRequest
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
            'name' => ['required', 'string'],
            'started_at' => ['required', 'date'],
            'deadline_at' => ['date'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            if ($validator->errors()->has('started_at') || $validator->errors()->has('deadline_at')) {
                return;
            }

            $startedAt = $this->input('started_at');
            $deadlineAt = $this->input('deadline_at');

            if ($startedAt === null || $deadlineAt === null) {
                return;
            }

            if (Carbon::parse($deadlineAt)->lt(Carbon::parse($startedAt))) {
                $validator->errors()->add('deadline_at', 'The project deadline must be on or after the start date.');
            }
        });
    }
}
