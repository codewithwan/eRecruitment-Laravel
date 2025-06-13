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
        // First, drop foreign keys to statuses table
        Schema::table('application_history', function (Blueprint $table) {
            if (Schema::hasColumn('application_history', 'statuses_id')) {
                $table->dropForeign(['statuses_id']);
                $table->dropColumn('statuses_id');
            }
        });

        Schema::table('applications', function (Blueprint $table) {
            if (Schema::hasColumn('applications', 'status_id')) {
                $table->dropForeign(['status_id']);
                $table->dropColumn('status_id');
            }

            // Add selection_id foreign key to replace status_id
            if (!Schema::hasColumn('applications', 'selection_id')) {
                $table->foreignId('selection_id')->constrained('selection')->onDelete('cascade');
            }
        });

        // Then drop the statuses table itself
        Schema::dropIfExists('statuses');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // This is irreversible as we're removing data
    }
};
