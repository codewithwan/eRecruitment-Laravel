<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ApplicationHistorySeeder extends Seeder
{
    public function run(): void
    {
        DB::table('application_history')->insert([
            [
                'application_id' => 1,
                'candidate_id' => 1,
                'position_name' => 'FRONTEND DEVELOPER',
                'company_id' => 1,
                'department_id' => 1,
                'job_description' => 'Mengembangkan dan memelihara aplikasi web.',
                'work_type' => 'Full Time',
                'work_location' => 'Semarang',
                'application_deadline' => Carbon::now()->addDays(30),
                'status_id' => 1,
                'applied_at' => Carbon::now()->subDays(2),
                'created_at' => Carbon::now()->subDays(2),
                'updated_at' => Carbon::now()->subDays(2),
            ],
            [
                'application_id' => 2,
                'candidate_id' => 1,
                'position_name' => 'MARKETING INTERN',
                'company_id' => 2,
                'department_id' => 2,
                'job_description' => 'Membantu tim marketing dalam kampanye digital.',
                'work_type' => 'Internship',
                'work_location' => 'Jakarta',
                'application_deadline' => Carbon::now()->addDays(10),
                'status_id' => 2,
                'applied_at' => Carbon::now()->subDays(1),
                'created_at' => Carbon::now()->subDays(1),
                'updated_at' => Carbon::now()->subDays(1),
            ],
        ]);
    }
}
