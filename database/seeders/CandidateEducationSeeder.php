<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\CandidatesEducations;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class CandidateEducationSeeder extends Seeder
{
    public function run()
    {
        // Delete existing records for user_id 2
        CandidatesEducations::where('user_id', 2)->delete();

        $candidate = User::find(2);

        // Cari major_id dari master_majors berdasarkan nama jurusan
        $major = DB::table('master_majors')->where('name', 'Teknik Informatika')->first();
        $institution = DB::table('master_institutions')->where('name', 'Universitas Diponegoro')->first();

        if ($candidate && $major && $institution) {
            CandidatesEducations::create([
                'user_id' => $candidate->id,
                'education_level' => 'S1',
                'faculty' => 'Fakultas Teknik',
                'major_id' => $major->id,
                'institution_id' => $institution->id, // gunakan institution_id
                'gpa' => 3.50,
                'year_in' => 2020,
                'year_out' => 2024,
            ]);
        }
    }
}
