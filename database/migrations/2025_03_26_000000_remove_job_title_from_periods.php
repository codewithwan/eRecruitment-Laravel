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
            if (Schema::hasColumn('periods', 'job_title')) {
                $table->dropColumn('job_title');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('periods', function (Blueprint $table) {
            if (!Schema::hasColumn('periods', 'job_title')) {
                $table->string('job_title')->nullable()->after('name');
            }
        });
    }
};
