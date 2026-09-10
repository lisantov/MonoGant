<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SprintResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'started_at' => $this->started_at() ? $this->started_at()->toDateString() : null,
            'deadline_at' => $this->started_at() ? $this->deadline_at()->toDateString() : null,
            'status' => $this->status,
            'description' => $this->description,
            'next_sprint_id' => $this->next_sprint_id,
        ];
    }
}
