<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ApplicationHistorySeeder extends Seeder
{
    public function run(): void
    {
        $candidate = \App\Models\Candidate::first();
    $company = \App\Models\Companies::first();
    $department = \App\Models\Department::first();
    $status = \DB::table('statuses_id')->first();

    if (!$candidate || !$company || !$department || !$status) {
        // Tidak ada data yang dibutuhkan, skip seeder
        return;
    }

    \DB::table('application_history')->insert([
        [
            'application_id' => 1,
            'candidate_id' => $candidate->id,
            'position_name' => 'FRONTEND DEVELOPER',
            'company_id' => $company->id,
            'department_id' => $department->id,
            'job_description' => 'Mengembangkan dan memelihara aplikasi web.',
            'work_type' => 'Full Time',
            'work_location' => 'Semarang',
            'application_deadline' => \Carbon\Carbon::now()->addDays(30),
            'status_id' => $status->id,
            'applied_at' => \Carbon\Carbon::now()->subDays(2),
            'created_at' => \Carbon\Carbon::now()->subDays(2),
            'updated_at' => \Carbon\Carbon::now()->subDays(2),
        ],
        // Tambahkan data lain sesuai kebutuhan
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
