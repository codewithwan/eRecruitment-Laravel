<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        if (Schema::hasTable('questions') && !Schema::hasColumn('questions', 'question_type')) {
            Schema::table('questions', function (Blueprint $table) {
                $table->string('question_type')->default('multiple_choice')->after('correct_answer');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        if (Schema::hasTable('questions') && Schema::hasColumn('questions', 'question_type')) {
            Schema::table('questions', function (Blueprint $table) {
                $table->dropColumn('question_type');
            });
        }
    }
};
