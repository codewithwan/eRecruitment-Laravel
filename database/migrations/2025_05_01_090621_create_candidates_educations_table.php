<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCandidatesEducationsTable extends Migration
{
    public function up()
    {
        Schema::create('candidates_educations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('education_level');
            $table->string('faculty');
            $table->string('major');
            $table->string('institution_name');
            $table->decimal('gpa', 3, 2);
            $table->year('year_in');
            $table->year('year_out')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('candidates_educations');
    }
}