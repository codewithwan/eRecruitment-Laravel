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
        Schema::create('vacancies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('company_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->foreignId('department_id')->constrained('departements')->onDelete('cascade');
            $table->foreignId('major_id')->nullable()->constrained('master_majors')->onDelete('cascade');
            $table->foreignId('vacancy_type_id')->nullable()->constrained('vacancy_types')->onDelete('cascade');
            $table->string('location');
            $table->string('salary')->nullable();
            $table->json('requirements');
            $table->json('benefits')->nullable();
            $table->foreignId('question_pack_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('education_level_id')->nullable()->constrained('education_levels')->onDelete('set null');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vacancies');
    }
};
