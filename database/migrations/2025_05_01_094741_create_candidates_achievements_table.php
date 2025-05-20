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
            $table->enum('level', ['Internasional', 'Nasional', 'Regional', 'Lokal']);
            $table->enum('month', [
                'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
                'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
            ]);
            $table->year('year');
            $table->text('description');
            $table->string('certificate_file');
            $table->string('supporting_file')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('candidates_achievements');
    }
}