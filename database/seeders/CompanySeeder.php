<?php

namespace Database\Seeders;

use App\Models\Company;
use Illuminate\Database\Seeder;

class CompanySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Insert the two company records with specific IDs
        Company::create([
            'id' => 1,
            'name' => 'Mitra Karya Analitika',
            'logo' => 'mka_logo.png', // Default logo name, you can update this
            'description' => 'Recruitment partner company',
        ]);

        Company::create([
            'id' => 2,
            'name' => 'Autentik Karya Analitika',
            'logo' => 'aka_logo.png', // Default logo name, you can update this
            'description' => 'Recruitment partner company',
        ]);
    }
}
