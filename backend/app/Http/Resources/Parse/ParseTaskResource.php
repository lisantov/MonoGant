<?php

namespace App\Http\Resources\Parse;

use App\Http\Resources\CommentResource;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ParseTaskResource extends JsonResource
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
            'description' => $this->description,
            'started_at' => $this->started_at->toDateString(),
            'deadline_at' => $this->deadline_at->toDateString(),
            'status' => $this->status,
            'sprint_id' => $this->sprint_id,
            'next_task_id' => $this->next_task_id,
            'user' => new UserResource(User::find($this->user_id)),
            'comments' => CommentResource::collection($this->comments),
        ];
    }
}
