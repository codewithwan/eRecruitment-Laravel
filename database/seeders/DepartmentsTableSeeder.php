<?php

namespace Database\Seeders;


use Illuminate\Database\Seeder;
use App\Models\Department;

class DepartmentsTableSeeder extends Seeder
{
    public function run(): void
    {
        $departments = [
            ['name' => 'Marketing'],
            ['name' => 'Teknik' ],
            ['name' => 'Akuntansi' ],
            ['name' => 'Kesehatan' ],
            ['name' => 'IT' ],
        ];

        foreach ($departments as $department) {
            Department::create($department);
        }
    }
}
