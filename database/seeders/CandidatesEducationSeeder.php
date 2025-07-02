<?php

namespace Database\Seeders;

use App\Models\CandidatesEducation;
use App\Models\EducationLevel;
use App\Models\MasterMajor;
use App\Models\User;
use App\Enums\UserRole;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CandidatesEducationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get candidate users, majors, and education levels
        $candidateUsers = User::where('role', UserRole::CANDIDATE)->get();
        $majors = MasterMajor::all();
        $educationLevels = EducationLevel::all();

        $faculties = [
            'Fakultas Teknik',
            'Fakultas Ekonomi dan Bisnis',
            'Fakultas Ilmu Komputer',
            'Fakultas Kedokteran',
            'Fakultas Hukum',
            'Fakultas Ilmu Sosial dan Politik',
            'Fakultas Psikologi',
            'Fakultas Pendidikan',
            'Fakultas Sastra',
            'Fakultas MIPA',
            'Fakultas Pertanian',
            'Fakultas Seni dan Desain',
            'Fakultas Farmasi',
            'Fakultas Kesehatan Masyarakat',
            'Fakultas Komunikasi',
            'Fakultas Pariwisata',
        ];

        $institutions = [
            // Universitas Negeri
            'Universitas Indonesia',
            'Institut Teknologi Bandung',
            'Universitas Gadjah Mada',
            'Institut Teknologi Sepuluh Nopember',
            'Universitas Diponegoro',
            'Universitas Brawijaya',
            'Universitas Airlangga',
            'Universitas Hasanuddin',
            'Universitas Sumatera Utara',
            'Universitas Padjadjaran',
            'Institut Pertanian Bogor',
            'Universitas Sebelas Maret',
            'Universitas Andalas',
            'Universitas Sriwijaya',
            'Universitas Negeri Jakarta',
            'Universitas Pendidikan Indonesia',
            'Universitas Negeri Malang',
            'Universitas Negeri Yogyakarta',
            'Universitas Negeri Semarang',
            'Universitas Negeri Surabaya',
            
            // Universitas Swasta
            'Universitas Bina Nusantara',
            'Universitas Trisakti',
            'Universitas Atmajaya Jakarta',
            'Universitas Kristen Petra',
            'Universitas Tarumanagara',
            'Universitas Pelita Harapan',
            'Universitas Mercu Buana',
            'Universitas Gunadarma',
            'Universitas Esa Unggul',
            'Universitas Pancasila',
            'Universitas Muhammadiyah Jakarta',
            'Universitas Muhammadiyah Malang',
            'Universitas Muhammadiyah Yogyakarta',
            'Universitas Islam Indonesia',
            'Universitas Ahmad Dahlan',
            'Universitas Dian Nuswantoro',
            'Universitas Kristen Maranatha',
            'Universitas Katolik Parahyangan',
            'Universitas Sanata Dharma',
            'Universitas Kristen Satya Wacana',
            
            // Politeknik
            'Politeknik Negeri Jakarta',
            'Politeknik Negeri Bandung',
            'Politeknik Negeri Malang',
            'Politeknik Negeri Semarang',
            'Politeknik Negeri Surabaya',
            'Politeknik Elektronika Negeri Surabaya',
            'Politeknik Manufaktur Bandung',
            'Politeknik Negeri Media Kreatif',
            'Politeknik Negeri Batam',
            'Politeknik Negeri Padang',
            
            // SMA/SMK
            'SMA Negeri 1 Jakarta',
            'SMA Negeri 8 Jakarta',
            'SMA Negeri 68 Jakarta',
            'SMA Negeri 3 Bandung',
            'SMA Negeri 5 Surabaya',
            'SMA Labschool Jakarta',
            'SMA Santa Ursula Jakarta',
            'SMA Kanisius Jakarta',
            'SMK Negeri 1 Jakarta',
            'SMK Negeri 26 Jakarta',
            'SMK Negeri 2 Bandung',
            'SMK Negeri 1 Surabaya',
            'SMK Telkom Bandung',
            'SMK Grafika Jakarta',
            'SMK Multimedia Jakarta',
        ];

        foreach ($candidateUsers as $user) {
            // Each candidate gets 1-3 education records
            $numberOfEducations = rand(1, 3);
            
            for ($i = 0; $i < $numberOfEducations; $i++) {
                $educationLevel = $educationLevels->random();
                $startYear = 2010 + rand(0, 10); // 2010-2020
                $endYear = $startYear + $this->getEducationDuration($educationLevel->name);
                
                // For current education, end year might be null
                if (rand(0, 1) && $i == $numberOfEducations - 1) {
                    $endYear = null;
                }
                
                CandidatesEducation::create([
                    'user_id' => $user->id,
                    'education_level_id' => $educationLevel->id,
                    'faculty' => $faculties[array_rand($faculties)],
                    'major_id' => $majors->random()->id,
                    'institution_name' => $institutions[array_rand($institutions)],
                    'gpa' => rand(250, 400) / 100, // 2.50 - 4.00
                    'year_in' => $startYear,
                    'year_out' => $endYear,
                ]);
            }
        }
    }

    private function getEducationDuration($level)
    {
        $durations = [
            'SMP' => 3,
            'SMA/SMK' => 3,
            'D1' => 1,
            'D2' => 2,
            'D3' => 3,
            'D4/S1' => 4,
            'S2' => 2,
            'S3' => 3,
        ];

        return $durations[$level] ?? 4;
    }
} 