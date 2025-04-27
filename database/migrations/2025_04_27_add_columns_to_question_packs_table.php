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
            // Check if columns don't exist before adding them to avoid errors
            if (!Schema::hasColumn('question_packs', 'test_type')) {
                $table->string('test_type')->nullable()->after('description');
            }
            if (!Schema::hasColumn('question_packs', 'duration')) {
                $table->integer('duration')->default(0)->after('test_type');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('question_packs', function (Blueprint $table) {
            $table->dropColumn(['test_type', 'duration']);
        });
    }
};
