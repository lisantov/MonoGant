<?php

use App\Enums\StatusEnum;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('sprints', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->timestamp('started_at')->nullable();
            $table->timestamp('deadline_at')->nullable();
            $table->enum('status', StatusEnum::cases())->default('planned');
            $table->foreignId('project_id')->constrained('projects')->cascadeOnDelete();
            $table->timestamps();
        });

        Schema::create('sprint_dependencies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('predecessor_sprint_id')->constrained('sprints')->cascadeOnDelete();
            $table->foreignId('successor_sprint_id')->constrained('sprints')->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['predecessor_sprint_id', 'successor_sprint_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sprint_dependencies');
        Schema::dropIfExists('sprints');
    }
};
