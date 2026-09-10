<?php

namespace App\Http\Controllers;

use App\Models\Sprint;
use Illuminate\Http\Request;

class SprintController extends Controller
{

    public function index(Project $project)
    {
        return $project->sprints;
    }

    public function show(Sprint $sprint)
    {
        return $sprint;
    }

    public function store(Request $request)
    {
        $sprint = Sprint::create($request->all());
        return response()->json($sprint, 201);
    }

}
