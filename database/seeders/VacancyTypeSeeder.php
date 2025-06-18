<?php

namespace Database\Seeders;

use App\Models\VacancyType;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class VacancyTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $vacancyTypes = [
            'Full Time',
            'Part Time',
            'Kontrak',
            'Freelance',
            'Magang',
            'Remote',
            'Hybrid',
            'Shift',
            'Konsultan',
            'Paruh Waktu',
            'Tetap',
            'Tidak Tetap',
            'Harian',
            'Mingguan',
            'Bulanan',
            'Proyek',
            'Musiman',
            'On Call',
            'Outsourcing',
            'Volunteer',
        ];

        foreach ($vacancyTypes as $type) {
            VacancyType::create([
                'name' => $type,
            ]);
        }
    }
} 