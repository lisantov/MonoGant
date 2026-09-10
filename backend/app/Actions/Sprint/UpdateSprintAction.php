<?php

namespace App\Actions\Sprint;

use App\Models\Sprint;
use Lorisleiva\Actions\Concerns\AsAction;

class UpdateSprintAction
{
    use AsAction;

    public function handle(Sprint $sprint, array $data): Sprint
    {
        $sprint->update($data);

        return $sprint->fresh();
    }
}
