<?php

namespace Database\Seeders;



use Illuminate\Database\Seeder;
use App\Models\JobTypes;

class JobTypesTableSeeder extends Seeder
{
    public function run(): void
    {
        JobTypes::create(['name' => 'Full Time']);
        JobTypes::create(['name' => 'Part Time']);
        JobTypes::create(['name' => 'Internship']);
    }
}
