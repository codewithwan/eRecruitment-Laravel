<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class CandidatesProfilesSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('candidate_profiles')->insert([
            [
                'id' => 1,
                'user_id' => 1,
                'no_ektp' => '1234567890123456',
                'gender' => 'Laki-laki',
                'phone_number' => '081234567890',
                'npwp' => '123456789012345',
                'about_me' => 'Saya seorang kandidat yang berdedikasi.',
                'place_of_birth' => 'Jakarta',
                'date_of_birth' => '2000-01-01',
                'address' => 'Jl. Contoh No. 1',
                'province' => 'DKI Jakarta',
                'city' => 'Jakarta Selatan',
                'district' => 'Kebayoran Baru',
                'village' => 'Gandaria Utara',
                'rt' => '01',
                'rw' => '02',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ]);
    }
}
