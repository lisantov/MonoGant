<?php

namespace App\Http\Requests\Task;

use App\Enums\StatusEnum;
use App\Models\Sprint;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Carbon;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

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

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            if ($validator->errors()->has('started_at') || $validator->errors()->has('deadline_at')) {
                return;
            }

            $sprint = $this->route('sprint');

            if (! $sprint instanceof Sprint) {
                return;
            }

            $startedAt = Carbon::parse($this->input('started_at'));
            $projectStartedAt = $sprint->project->started_at;

            if ($projectStartedAt !== null && $startedAt->lt($projectStartedAt)) {
                $validator->errors()->add('started_at', 'The task cannot start before the project starts.');
            }

            $conflict = $sprint->dateRangeConflict(
                $startedAt,
                Carbon::parse($this->input('deadline_at')),
            );

            if ($conflict !== null) {
                $validator->errors()->add('deadline_at', $conflict);
            }
        });
    }
}
