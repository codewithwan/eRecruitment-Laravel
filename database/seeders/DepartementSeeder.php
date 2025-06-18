<?php

namespace Database\Seeders;

use App\Models\Departement;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DepartementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $departments = [
            'Teknologi Informasi',
            'Sumber Daya Manusia',
            'Keuangan dan Akuntansi',
            'Pemasaran',
            'Operasional',
            'Produksi',
            'Research & Development',
            'Quality Assurance',
            'Customer Service',
            'Logistik',
            'Procurement',
            'Legal',
            'Corporate Communication',
            'Business Development',
            'Project Management',
            'Engineering',
            'Design',
            'Sales',
            'Administration',
            'Security',
            'Maintenance',
            'Training & Development',
            'Internal Audit',
            'Risk Management',
            'Compliance',
            'General Affairs',
            'Public Relations',
            'Marketing Digital',
            'Data Analytics',
            'Cybersecurity',
            'Infrastructure',
            'Business Intelligence',
            'Product Management',
            'User Experience',
            'Content Management',
            'Social Media',
            'E-commerce',
            'Supply Chain',
            'Warehouse',
            'Transportation',
            'Environmental Health Safety',
            'Corporate Social Responsibility',
            'Strategic Planning',
            'Performance Management',
            'Compensation & Benefits',
            'Industrial Relations',
            'Learning & Development',
            'Talent Acquisition',
            'Employee Engagement',
            'Change Management',
            'Knowledge Management',
        ];

        foreach ($departments as $department) {
            Departement::create([
                'name' => $department,
            ]);
        }
    }
} 