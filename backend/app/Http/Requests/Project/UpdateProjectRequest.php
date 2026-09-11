<?php

namespace App\Http\Requests\Project;

use App\Enums\StatusEnum;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Carbon;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class UpdateProjectRequest extends FormRequest
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
            'name' => ['string', 'max:90', 'min: 1'],
            'started_at' => ['date'],
            'deadline_at' => ['date'],
            'status' => ['nullable', Rule::enum(StatusEnum::class)],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            if ($validator->errors()->has('started_at') || $validator->errors()->has('deadline_at')) {
                return;
            }

            $existing = $this->route('project');
            $startedAt = $this->input('started_at', $existing?->started_at);
            $deadlineAt = $this->input('deadline_at', $existing?->deadline_at);

            if ($startedAt === null || $deadlineAt === null) {
                return;
            }

            if (Carbon::parse($deadlineAt)->lt(Carbon::parse($startedAt))) {
                $validator->errors()->add('deadline_at', 'The project deadline must be on or after the start date.');
            }
        });
    }
}
