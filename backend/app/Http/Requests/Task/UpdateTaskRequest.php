<?php

namespace App\Http\Requests\Task;

use App\Enums\StatusEnum;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Carbon;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class UpdateTaskRequest extends FormRequest
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
            'name' => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'started_at' => ['sometimes', 'nullable', 'date'],
            'deadline_at' => ['sometimes', 'nullable', 'date'],
            'status' => ['nullable', Rule::enum(StatusEnum::class)],
            'user_email' => ['nullable', 'email', 'exists:users,email'],
            'next_task_id' => ['nullable', 'integer', 'exists:tasks,id'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            if ($validator->errors()->has('started_at') || $validator->errors()->has('deadline_at')) {
                return;
            }

            $existing = $this->route('task');
            $startedAt = $this->input('started_at', $existing?->started_at);
            $deadlineAt = $this->input('deadline_at', $existing?->deadline_at);

            if ($startedAt === null || $deadlineAt === null) {
                return;
            }

            if (Carbon::parse($deadlineAt)->lt(Carbon::parse($startedAt))) {
                $validator->errors()->add('deadline_at', 'The deadline date must be on or after the start date.');
            }

            $sprint = $existing?->sprint;

            if ($sprint === null) {
                return;
            }

            $projectStartedAt = $sprint->project->started_at;

            if ($projectStartedAt !== null && Carbon::parse($startedAt)->lt($projectStartedAt)) {
                $validator->errors()->add('started_at', 'The task cannot start before the project starts.');
            }

            $conflict = $sprint->dateRangeConflict(
                Carbon::parse($startedAt),
                Carbon::parse($deadlineAt),
            );

            if ($conflict !== null) {
                $validator->errors()->add('deadline_at', $conflict);
            }
        });
    }
}
