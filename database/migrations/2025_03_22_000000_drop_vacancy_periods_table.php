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
        Schema::dropIfExists('vacancy_periods');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::create('vacancy_periods', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vacancy_id')->constrained()->onDelete('cascade');
            $table->foreignId('period_id')->constrained()->onDelete('cascade');
            $table->timestamps();
            
            // Create a unique constraint to prevent duplicates
            $table->unique(['vacancy_id', 'period_id']);
        });
    }
};
