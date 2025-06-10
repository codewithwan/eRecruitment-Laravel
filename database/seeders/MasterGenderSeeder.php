<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\MasterGender;

class MasterGenderSeeder extends Seeder
{
    public function run()
    {
        // Data gender default
        $genders = [
            ['name' => 'Pria'],
            ['name' => 'Wanita'],
        ];

        foreach ($genders as $gender) {
            MasterGender::updateOrCreate(
                ['name' => $gender['name']],
                $gender
            );
        }
    }
}