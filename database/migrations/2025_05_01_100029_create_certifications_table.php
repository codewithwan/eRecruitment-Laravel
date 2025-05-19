<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCertificationsTable extends Migration
{
    public function up()
    {
        Schema::create('certifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('data_tambahan_id')->constrained('additional_data')->onDelete('cascade');
            $table->string('certification_name');
            $table->string('file_path')->nullable();
        });
    }

    public function down()
    {
        Schema::dropIfExists('certifications');
    }
}