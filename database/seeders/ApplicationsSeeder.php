<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ApplicationsSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('applications')->insert([
            [
                // Removed 'id' field to let auto-increment handle it
                'user_id' => 2,
                'vacancies_id' => 2,
                'selection_id' => 1,
                'created_at' => Carbon::now()->subDays(1),
                'updated_at' => Carbon::now()->subDays(1),
            ],
            [
                // Removed 'id' field to let auto-increment handle it
                'user_id' => 3,
                'vacancies_id' => 2,
                'selection_id' => 1,
                'created_at' => Carbon::now()->subDays(1),
                'updated_at' => Carbon::now()->subDays(1),
            ],
        ]);
    }
}
