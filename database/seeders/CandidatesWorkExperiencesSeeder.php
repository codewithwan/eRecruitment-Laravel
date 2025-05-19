<?php


namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\CandidatesWorkExperiences;

class CandidatesWorkExperiencesSeeder extends Seeder
{
    public function run()
    {
        // Buat data hanya untuk user_id = 2
        CandidatesWorkExperiences::create([
            'user_id' => 2,
            'job_title' => 'Software Engineer',
            'employment_status' => 'Full Time',
            'job_description' => 'Developing web applications using Laravel.',
            'is_current_job' => true,
            'start_month' => 1,
            'start_year' => 2023,
            'end_month' => null,
            'end_year' => null,
        ]);
    }
}