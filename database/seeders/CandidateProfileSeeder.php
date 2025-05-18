<?php

namespace Database\Seeders;

use App\Models\CandidatesProfiles;
use Illuminate\Database\Seeder;

class CandidateProfileSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        CandidatesProfiles::create([
            'user_id' => 2,
            'no_ektp' => '3374121234567890',
            'gender' => 'male',
            'phone_number' => '081234567890',
            'npwp' => '12.345.678.9-123.000',
            'about_me' => 'Saya adalah seorang profesional yang berdedikasi dengan pengalaman di bidang teknologi. Saya memiliki kemampuan analitis yang kuat dan dapat bekerja dengan baik dalam tim maupun secara mandiri.',
            'place_of_birth' => 'Semarang',
            'date_of_birth' => '1995-05-15',
            'address' => 'Jl. Pemuda No. 123',
            'province' => 'Jawa Tengah',
            'city' => 'Semarang',
            'district' => 'Semarang Tengah',
            'village' => 'Sekayu',
            'rt' => '001',
            'rw' => '002',
        ]);
    }
}
