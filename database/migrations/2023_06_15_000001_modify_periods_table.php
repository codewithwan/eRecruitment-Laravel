<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('periods', function (Blueprint $table) {
            // Remove start_date and end_date columns
            $table->dropColumn(['start_date', 'end_date']);
            
            // Add vacancies_id as foreign key
            $table->unsignedBigInteger('vacancies_id')->nullable();
            $table->foreign('vacancies_id')->references('id')->on('vacancies');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('periods', function (Blueprint $table) {
            // Restore the original structure
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            
            // Remove the foreign key and column
            $table->dropForeign(['vacancies_id']);
            $table->dropColumn('vacancies_id');
        });
    }
};
