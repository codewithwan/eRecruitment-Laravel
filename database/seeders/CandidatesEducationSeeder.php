<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\CandidatesEducations;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use App\Enums\UserRole;

class CandidatesEducationSeeder extends Seeder
{
    public function run()
    {
        // Ambil semua user dengan role CANDIDATE
        $candidates = User::where('role', UserRole::CANDIDATE)->get();

        // Ambil semua major dan institution yang tersedia
        $majors = DB::table('master_majors')->pluck('id')->toArray();
        $institutions = DB::table('master_institutions')->pluck('id')->toArray();

        if (empty($majors) || empty($institutions)) {
            echo "GAGAL: Data master_majors atau master_institutions kosong. Isi dulu sebelum menjalankan CandidateEducationSeeder.\n";
            return;
        }

        foreach ($candidates as $candidate) {
            // Hapus data pendidikan lama user ini (jika ada)
            CandidatesEducations::where('user_id', $candidate->id)->delete();

            // Pilih major dan institution secara acak
            $major_id = $majors[array_rand($majors)];
            $institution_id = $institutions[array_rand($institutions)];

            // Buat data pendidikan
            CandidatesEducations::create([
                'user_id' => $candidate->id,
                'education_level' => 'S1',
                'faculty' => 'Fakultas Teknik',
                'major_id' => $major_id,
                'institution_id' => $institution_id,
                'gpa' => round(mt_rand(250, 400) / 100, 2), // IPK antara 2.50 - 4.00
                'year_in' => rand(2017, 2021),
                'year_out' => rand(2022, 2025),
            ]);
        }
    }
}
