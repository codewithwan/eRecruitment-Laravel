<?php

namespace Database\Seeders;



use Illuminate\Database\Seeder;
use App\Models\JobType;

class JobTypesTableSeeder extends Seeder
{
    public function run(): void
    {
        JobType::create(['name' => 'Full Time']);
    }
}
