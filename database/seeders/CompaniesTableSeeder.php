<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Companies;

class CompaniesTableSeeder extends Seeder
{
    public function run(): void
    {
        Companies::create([
            'name' => 'PT MITRA KARYA ANALITIKA',
            'description' => 'Perusahaan teknologi yang berfokus pada analisis data dan solusi TI.',
            'logo' => 'logo-mka.png',
        ]);
        Companies::create([
            'name' => 'PT AUTENTIK KARYA ANALITIKA',
            'description' => 'Perusahaan teknologi yang berfokus pada pengembangan software.',
            'logo' => 'logo-mka.png',
        ]);
    }
}
