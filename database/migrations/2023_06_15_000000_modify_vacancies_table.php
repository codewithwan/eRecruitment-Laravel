<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // First check if there are any foreign key constraints on period_id and drop them directly
        $constraints = DB::select("
            SELECT CONSTRAINT_NAME
            FROM information_schema.KEY_COLUMN_USAGE
            WHERE TABLE_SCHEMA = DATABASE() 
              AND TABLE_NAME = 'vacancies'
              AND COLUMN_NAME = 'period_id'
              AND REFERENCED_TABLE_NAME IS NOT NULL
        ");

        foreach ($constraints as $constraint) {
            DB::statement("ALTER TABLE vacancies DROP FOREIGN KEY {$constraint->CONSTRAINT_NAME}");
        }

        // Now modify the table structure
        Schema::table('vacancies', function (Blueprint $table) {
            // Remove the period_id column if it exists
            if (Schema::hasColumn('vacancies', 'period_id')) {
                $table->dropColumn('period_id');
            }
            
            // Add start_date and end_date columns if they don't exist
            if (!Schema::hasColumn('vacancies', 'start_date')) {
                $table->date('start_date')->nullable();
            }
            
            if (!Schema::hasColumn('vacancies', 'end_date')) {
                $table->date('end_date')->nullable();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('vacancies', function (Blueprint $table) {
            // Restore the original structure
            $table->unsignedBigInteger('period_id')->nullable();
            
            // We don't know if the foreign key existed originally, but we'll add it back
            $table->foreign('period_id')->references('id')->on('periods');
            
            $table->dropColumn(['start_date', 'end_date']);
        });
    }
    
    /**
     * Get list of foreign keys for a given table.
     */
    private function listTableForeignKeys($table)
    {
        $conn = Schema::getConnection()->getDoctrineSchemaManager();
        
        $foreignKeys = [];
        try {
            $tableDetails = $conn->listTableDetails($table);
            foreach ($tableDetails->getForeignKeys() as $foreignKey) {
                $foreignKeys[] = $foreignKey->getName();
            }
        } catch (\Exception $e) {
            // Table might not exist yet
        }
        
        return $foreignKeys;
    }
};
