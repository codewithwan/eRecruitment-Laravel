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
        // Get all foreign keys from candidates table
        $foreignKeys = $this->getForeignKeys('candidates');
        
        // Drop any foreign keys that reference company_id or vacancy_id
        foreach ($foreignKeys as $key) {
            DB::statement("ALTER TABLE candidates DROP FOREIGN KEY {$key}");
        }
        
        // Now that foreign keys are removed, drop the columns
        Schema::table('candidates', function (Blueprint $table) {
            if (Schema::hasColumn('candidates', 'company_id')) {
                $table->dropColumn('company_id');
            }
            
            if (Schema::hasColumn('candidates', 'vacancy_id')) {
                $table->dropColumn('vacancy_id');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Re-add columns if they don't exist
        if (!Schema::hasColumn('candidates', 'company_id')) {
            Schema::table('candidates', function (Blueprint $table) {
                $table->foreignId('company_id')->nullable()->constrained()->onDelete('set null');
            });
        }
        
        if (!Schema::hasColumn('candidates', 'vacancy_id')) {
            Schema::table('candidates', function (Blueprint $table) {
                $table->foreignId('vacancy_id')->nullable()->constrained()->onDelete('set null');
            });
        }
    }
    
    /**
     * Helper method to get foreign key constraints for a table
     */
    private function getForeignKeys($table)
    {
        $conn = DB::connection()->getPdo();
        $database = DB::connection()->getDatabaseName();
        
        // Get all foreign keys directly from information_schema
        $result = $conn->query("
            SELECT CONSTRAINT_NAME
            FROM information_schema.TABLE_CONSTRAINTS
            WHERE CONSTRAINT_TYPE = 'FOREIGN KEY'
            AND TABLE_NAME = '{$table}'
            AND TABLE_SCHEMA = '{$database}'
        ");
        
        return array_map(function($row) {
            return $row->CONSTRAINT_NAME;
        }, $result->fetchAll(\PDO::FETCH_OBJ));
    }
};
