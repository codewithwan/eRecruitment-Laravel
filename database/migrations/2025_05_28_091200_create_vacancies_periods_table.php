<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateVacanciesPeriodsTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('vacancies_periods', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('vacancy_id');
            $table->unsignedBigInteger('period_id');
            $table->timestamps();

            // Foreign keys (optional, uncomment if you have these tables)
            // $table->foreign('vacancy_id')->references('id')->on('vacancies')->onDelete('cascade');
            $table->foreign('period_id')->references('id')->on('periods')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vacancies_periods');
    }
}
