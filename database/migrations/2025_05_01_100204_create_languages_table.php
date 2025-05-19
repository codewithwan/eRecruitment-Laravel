<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLanguagesTable extends Migration
{
    public function up()
    {
        Schema::create('languages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('data_tambahan_id')->constrained('additional_data')->onDelete('cascade');
            $table->string('language_name');
            $table->enum('proficiency', ['beginner', 'intermediate', 'advanced', 'fluent'])->default('beginner');
        });
    }

    public function down()
    {
        Schema::dropIfExists('languages');
    }
}