<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCoursesTable extends Migration
{
    public function up()
    {
        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('data_tambahan_id')->constrained('additional_data')->onDelete('cascade');
            $table->string('course_name');
            $table->year('year');
        });
    }

    public function down()
    {
        Schema::dropIfExists('courses');
    }
}
