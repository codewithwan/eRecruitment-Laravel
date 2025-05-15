<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('vacancies', function (Blueprint $table) {
            if (!Schema::hasColumn('vacancies', 'company_id')) {
                $table->foreignId('company_id')
                      ->nullable()
                      ->constrained()
                      ->onDelete('cascade')
                      ->after('id');
            }

            if (!Schema::hasColumn('vacancies', 'job_type_id')) {
                $table->foreignId('job_type_id')
                      ->nullable()
                      ->constrained()
                      ->onDelete('cascade')
                      ->after('company_id');
            }
        });
    }

    public function down(): void
    {
        Schema::table('vacancies', function (Blueprint $table) {
            if (Schema::hasColumn('vacancies', 'job_type_id')) {
                $table->dropForeign(['job_type_id']);
                $table->dropColumn('job_type_id');
            }

            if (Schema::hasColumn('vacancies', 'company_id')) {
                $table->dropForeign(['company_id']);
                $table->dropColumn('company_id');
            }
        });
    }
};

