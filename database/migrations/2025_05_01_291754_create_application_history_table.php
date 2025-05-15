<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateApplicationHistoryTable extends Migration
{
    public function up()
    {
        Schema::create('application_history', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('application_id');
            $table->unsignedBigInteger('candidate_id');
            $table->string('position_name');
            $table->unsignedBigInteger('company_id');
            $table->unsignedBigInteger('department_id');
            $table->text('job_description')->nullable();
            $table->enum('work_type', ['Full Time', 'Part Time', 'Contract', 'Internship'])->default('Full Time');
            $table->string('work_location')->nullable();
            $table->date('application_deadline')->nullable();
            $table->unsignedBigInteger('status_id');
            $table->timestamp('applied_at')->useCurrent();

            $table->timestamps();

            // Foreign Keys
            $table->foreign('application_id')->references('id')->on('applications')->onDelete('cascade');
            $table->foreign('candidate_id')->references('id')->on('candidates')->onDelete('cascade');
            $table->foreign('company_id')->references('id')->on('companies')->onDelete('cascade');
            $table->foreign('department_id')->references('id')->on('departments')->onDelete('cascade');
            $table->foreign('status_id')->references('id')->on('statuses')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('application_history');
    }
}
