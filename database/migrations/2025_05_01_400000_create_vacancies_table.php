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
            $table->string('title');
            $table->foreignId('department_id')->constrained('department');
            $table->foreignId('company_id')->constrained('companies');
            $table->foreignId('type_id')->constrained('job_types');
            $table->string('location');
            $table->json('requirements');
            $table->json('benefits')->nullable();
            $table->text('job_description')->nullable();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });

        // Tambahkan kolom major_id pada tabel vacancies
        Schema::table('vacancies', function (Blueprint $table) {
            $table->unsignedBigInteger('major_id')->nullable()->after('type_id');
            $table->foreign('major_id')->references('id')->on('master_majors')->onDelete('set null');
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
