<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Company;

class CompaniesTableSeeder extends Seeder
{
    public function run(): void
    {
        Company::create([
            'name' => 'PT Mitra Karya Analitika',
            'description' => 'Perusahaan teknologi yang berfokus pada analisis data dan solusi TI.',
            'logo' => 'logo-mka.png', 
        ]);
    }
}
