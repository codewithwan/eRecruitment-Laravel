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
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('vacancies_id')->constrained('vacancies')->onDelete('cascade');
            $table->foreignId('selection_id')->constrained('selection')->onDelete('cascade');
            $table->timestamps();     });
    }


    public function down()
    {
        Schema::dropIfExists('applications');
    }
}
