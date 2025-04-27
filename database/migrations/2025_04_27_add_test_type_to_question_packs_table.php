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
        Schema::table('question_packs', function (Blueprint $table) {
            if (!Schema::hasColumn('question_packs', 'test_type')) {
                $table->string('test_type')->nullable()->after('description');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('question_packs', function (Blueprint $table) {
            if (Schema::hasColumn('question_packs', 'test_type')) {
                $table->dropColumn('test_type');
            }
        });
    }
};
