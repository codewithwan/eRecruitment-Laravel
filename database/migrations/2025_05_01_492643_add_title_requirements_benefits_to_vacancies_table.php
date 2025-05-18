<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('vacancies', function (Blueprint $table) {
            if (!Schema::hasColumn('vacancies', 'title')) {
                $table->string('title')->after('department_id');
            }
            if (!Schema::hasColumn('vacancies', 'requirements')) {
                $table->text('requirements')->nullable()->after('description');
            }
            if (!Schema::hasColumn('vacancies', 'benefits')) {
                $table->text('benefits')->nullable()->after('requirements');
            }
        });
    }

    public function down(): void
    {
        Schema::table('vacancies', function (Blueprint $table) {
            $table->dropColumn(['title', 'requirements', 'benefits']);
        });
    }
};
