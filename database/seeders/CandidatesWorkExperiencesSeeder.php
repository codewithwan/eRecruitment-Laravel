<?php


namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\CandidatesWorkExperiences;
use App\Enums\UserRole;

class CandidatesWorkExperiencesSeeder extends Seeder
{
    public function run()
    {
        $candidates = User::where('role', UserRole::CANDIDATE)->get();

        foreach ($candidates as $user) {
            CandidatesWorkExperiences::create([
                'user_id' => $user->id,
                'job_title' => 'Software Engineer',
                'employment_status' => 'Full Time',
                'job_description' => 'Mengembangkan aplikasi web.',
                'is_current_job' => true,
                'start_month' => rand(1, 12),
                'start_year' => rand(2018, 2022),
                'end_month' => null,
                'end_year' => null,
            ]);
        }
    }
}
