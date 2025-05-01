<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCandidatesWorkExperiencesTable extends Migration
{
    public function up()
    {
        Schema::create('candidates_work_experiences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('candidates')->onDelete('cascade');
            $table->string('job_title');
            $table->string('employment_status');
            $table->text('job_description')->nullable();
            $table->boolean('is_current_job')->default(false);
            $table->tinyInteger('start_month');
            $table->year('start_year');
            $table->tinyInteger('end_month')->nullable();
            $table->year('end_year')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('candidates_work_experiences');
    }
}