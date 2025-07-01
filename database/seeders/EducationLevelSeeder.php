<?php

namespace Database\Seeders;

use App\Models\EducationLevel;
use Illuminate\Database\Seeder;

class EducationLevelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $educationLevels = [
            ['name' => 'SMP'],
            ['name' => 'SMA/SMK'],
            ['name' => 'D1'],
            ['name' => 'D2'],
            ['name' => 'D3'],
            ['name' => 'D4/S1'],
            ['name' => 'S2'],
            ['name' => 'S3'],
        ];

        foreach ($educationLevels as $level) {
            EducationLevel::updateOrCreate(
                ['name' => $level['name']],
                $level
            );
        }

        $this->command->info('Education levels seeded successfully.');
        $this->command->info('Created ' . count($educationLevels) . ' education level records.');
    }
}
