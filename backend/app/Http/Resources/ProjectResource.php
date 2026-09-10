<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $owner = $this->owner()->first();

        return [
            'name' => $this->name,
            'started_at' => $this->started_at,
            'deadline_at' => $this->deadline_at,
            'status' => $this->status,
            'owner' => $owner ? new UserResource($owner) : null,
        ];
    }
}
