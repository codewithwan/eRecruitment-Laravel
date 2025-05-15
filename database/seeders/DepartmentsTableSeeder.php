<?php

namespace Database\Seeders;


use Illuminate\Database\Seeder;
use App\Models\Department;

class DepartmentsTableSeeder extends Seeder
{
    public function run(): void
    {
        Department::create(['name' => 'IT']);
    }
}
