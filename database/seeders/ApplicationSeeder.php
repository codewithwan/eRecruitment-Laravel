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
                'job_type_id' => 1,
                'candidate_id' => 1,
                'reviewed_by' => null,
                'created_at' => Carbon::now()->subDays(2),
                'updated_at' => Carbon::now()->subDays(2),
            ],
            [
                'id' => 2,
                'job_type_id' => 2,
                'candidate_id' => 1,
                'reviewed_by' => null,
                'created_at' => Carbon::now()->subDays(1),
                'updated_at' => Carbon::now()->subDays(1),
            ],
        ]);
    }
}
