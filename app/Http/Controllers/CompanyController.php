<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Company;

class CompanyController extends Controller
{
    /**
     * Show administration page for a company.
     */
    public function administration(Request $request)
    {
        $companyId = $request->query('companyId', 1);
        $company = Company::findOrFail($companyId);
        
        // Dummy data based on both screenshots - with period information from Periods page
        // and following the structure of the Assessment page
        $candidates = [
            [
                'id' => '01',
                'name' => 'Rizal Farhan Nanda',
                'email' => 'rizalfarhannanda@gmail.com',
                'position' => 'UI / UX',
                'period' => 'Q1 2025 Recruitment',  // From periods page
                'registration_date' => 'Mar 20, 2025',
            ],
            [
                'id' => '02',
                'name' => 'M. Hassan Naufal Zayyan',
                'email' => 'hassan@example.com',
                'position' => 'Back End',
                'period' => 'Q1 2025 Recruitment',
                'registration_date' => 'Mar 18, 2025',
            ],
            [
                'id' => '03',
                'name' => 'Ardan Ferdiansah',
                'email' => 'ardan@example.com',
                'position' => 'Front End',
                'period' => 'Q2 2025 Recruitment',
                'registration_date' => 'Mar 18, 2025',
            ],
            [
                'id' => '04',
                'name' => 'Muhammad Ridwan',
                'email' => 'ridwan@example.com',
                'position' => 'UX Writer',
                'period' => 'Q3 2025 Recruitment',
                'registration_date' => 'Mar 20, 2025',
            ],
            [
                'id' => '05',
                'name' => 'Untara Eka Saputra',
                'email' => 'untara@example.com',
                'position' => 'IT Spesialis',
                'period' => 'Q4 2025 Recruitment',
                'registration_date' => 'Mar 22, 2025',
            ],
            [
                'id' => '06',
                'name' => 'Dea Derika Winahyu',
                'email' => 'dea@example.com',
                'position' => 'UX Writer',
                'period' => 'Special Recruitment',
                'registration_date' => 'Mar 20, 2025',
            ],
            [
                'id' => '07',
                'name' => 'Kartika Yuliana',
                'email' => 'kartika@example.com',
                'position' => 'IT Spesialis',
                'period' => 'Q4 2025 Recruitment',
                'registration_date' => 'Mar 22, 2025',
            ],
        ];
        
        return Inertia::render('admin/company/administration', [
            'company' => $company,
            'candidates' => $candidates
        ]);
    }
}
