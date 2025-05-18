<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCandidatesAchievementsTable extends Migration
{
    public function up()
    {
        Schema::create('candidates_achievements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('title');
            $table->string('level');
            $table->string('organizer');
            $table->year('year');
            $table->text('description')->nullable();
            $table->string('file_path')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('candidates_achievements');
    }
}