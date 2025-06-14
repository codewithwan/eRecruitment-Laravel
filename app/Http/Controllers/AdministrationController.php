<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class AdministrationController extends Controller
{
    public function show($id)
    {
        // Fetch user data from database
        // For now, using dummy data
        $user = [
            'id' => $id,
            'name' => 'Rizal Farhan Nanda',
            'email' => 'rizalfarhannanda@gmail.com',
            'position' => 'UI / UX',
            'registration_date' => '2025-03-20',
            'cv' => [
                'filename' => 'rizal_cv.pdf',
                'fileType' => 'pdf',
                'url' => '/uploads/cv/rizal_cv.pdf'
            ],
            'periodId' => '1',
            'vacancy' => 'UI/UX Designer',
            'phone' => '+62 812-3456-7890',
            'address' => 'Jl. Sudirman No. 123, Jakarta Selatan',
            'education' => 'S1 Desain Komunikasi Visual - Universitas Indonesia (2020-2024)',
            'experience' => '2 tahun sebagai UI/UX Designer di PT Digital Creative',
            'skills' => ['Figma', 'Adobe XD', 'Sketch', 'Prototyping', 'User Research', 'Wireframing'],
            'status' => 'pending'
        ];

        $periodName = 'Q1 2025 Recruitment';

        return Inertia::render('admin/company/administration-detail', [
            'user' => $user,
            'periodName' => $periodName
        ]);
    }

    public function approve($id)
    {
        // Logic untuk approve candidate
        // Update status di database
        // Move ke assessment phase
        
        return redirect()->route('assessment.index')
            ->with('success', 'Candidate approved and moved to assessment phase.');
    }

    public function reject($id)
    {
        // Logic untuk reject candidate
        // Update status di database
        
        return redirect()->route('administration.index')
            ->with('success', 'Candidate application has been rejected.');
    }
}