<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateApplicationsTable extends Migration
{
    public function up()
    {
        Schema::create('applications', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('job_type_id');
            $table->unsignedBigInteger('candidate_id');
            $table->unsignedBigInteger('reviewed_by')->nullable();
            $table->timestamps();

            // Foreign keys
            $table->foreign('job_type_id')->references('id')->on('job_types')->onDelete('cascade');
            $table->foreign('candidate_id')->references('id')->on('candidates_profiles')->onDelete('cascade');
            $table->foreign('reviewed_by')->references('id')->on('users')->onDelete('set null');
        });
    }

    public function down()
    {
        Schema::dropIfExists('applications');
    }
}