<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\CandidatesEducations;
use App\Models\User;

class CandidateEducationSeeder extends Seeder
{
    public function run()
    {
        // Delete existing records for user_id 2
        CandidatesEducations::where('user_id', 2)->delete();

        $candidate = User::find(2);

        if ($candidate) {
            CandidatesEducations::create([
                'user_id' => $candidate->id,
                'education_level' => 'S1',
                'faculty' => 'Fakultas Teknik',
                'major' => 'Teknik Informatika',
                'institution_name' => 'Universitas Example',
                'gpa' => 3.50,
                'year_in' => 2020,
                'year_out' => 2024,
            ]);
        }
    }
}