<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ApplicationSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('applications')->insert([
            [
                'id' => 1,
                'user_id' => 1,
                'vacancies_id' => 1,
                'status_id' => 1,
                'created_at' => Carbon::now()->subDays(2),
                'updated_at' => Carbon::now()->subDays(2),
            ],
            [
                'id' => 2,
                'user_id' => 2,
                'vacancies_id' => 2,
                'status_id' => 1,
                'created_at' => Carbon::now()->subDays(1),
                'updated_at' => Carbon::now()->subDays(1),
            ],
            [
                'id' => 3,
                'user_id' => 3,
                'vacancies_id' => 2,
                'status_id' => 1,
                'created_at' => Carbon::now()->subDays(1),
                'updated_at' => Carbon::now()->subDays(1),
            ],
        ]);
    }
}
