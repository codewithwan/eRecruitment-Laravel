<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEnglishCertificationsTable extends Migration
{
    public function up()
    {
        Schema::create('english_certifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('data_tambahan_id')->constrained('data_tambahan')->onDelete('cascade');
            $table->string('test_name');
            $table->string('score');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('english_certifications');
    }
}