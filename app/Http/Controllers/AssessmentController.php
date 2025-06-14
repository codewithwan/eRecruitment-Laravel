<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AssessmentController extends Controller
{
    /**
     * Display the specified assessment detail.
     */
    public function show(string $id): Response
    {
        // Mock data untuk demo - nanti ganti dengan data dari database
        $mockAssessmentData = [
            'id' => $id,
            'name' => 'Rizal Farhan Nanda',
            'email' => 'Rizalfarhananda@gmail.com',
            'phone' => '+62 812-3456-7890',
            'position' => 'UI / UX',
            'vacancy' => 'UI/UX Designer',
            'registration_date' => '2025-03-20',
            'assessment_date' => '2025-03-22',
            'cv_path' => '/storage/cv/rizal_cv.pdf',
            'portfolio_path' => '/storage/portfolio/rizal_portfolio.pdf',
            'cover_letter' => 'Saya sangat tertarik untuk bergabung dengan perusahaan ini karena visi dan misi yang sejalan dengan passion saya di bidang UI/UX Design...',
            'status' => 'completed',
            'total_score' => 85,
            'max_total_score' => 100,
            'notes' => 'Kandidat menunjukkan pemahaman yang baik tentang design principles dan user experience.',
            'questions' => [
                [
                    'id' => '1',
                    'question' => 'Jelaskan perbedaan antara UI dan UX Design?',
                    'answer' => 'UI Design fokus pada tampilan visual dan interaksi interface, sedangkan UX Design fokus pada pengalaman pengguna secara keseluruhan dalam menggunakan produk.',
                    'score' => 9,
                    'maxScore' => 10,
                    'category' => 'Theory'
                ],
                [
                    'id' => '2',
                    'question' => 'Sebutkan tools yang biasa Anda gunakan untuk design?',
                    'answer' => 'Saya menggunakan Figma untuk UI Design, Adobe XD untuk prototyping, dan Miro untuk user journey mapping.',
                    'score' => 8,
                    'maxScore' => 10,
                    'category' => 'Tools'
                ],
                [
                    'id' => '3',
                    'question' => 'Bagaimana Anda melakukan user research?',
                    'answer' => 'Saya melakukan user interview, survey, dan usability testing untuk memahami kebutuhan dan pain points pengguna.',
                    'score' => 8,
                    'maxScore' => 10,
                    'category' => 'Research'
                ],
                [
                    'id' => '4',
                    'question' => 'Ceritakan tentang project terbaik yang pernah Anda kerjakan?',
                    'answer' => 'Project aplikasi mobile untuk e-commerce dimana saya berhasil meningkatkan conversion rate sebesar 25% melalui redesign checkout flow.',
                    'score' => 9,
                    'maxScore' => 10,
                    'category' => 'Experience'
                ]
            ]
        ];

        return Inertia::render('admin/company/assessment-detail', [
            'assessment' => $mockAssessmentData
        ]);
    }

    /**
     * Approve a candidate for interview stage.
     */
    public function approve(Request $request, string $id)
    {
        try {
            // Logic untuk approve kandidat
            // Update status di database
            // Pindahkan ke tahap interview
            
            return redirect()->route('company.interview')
                ->with('success', 'Candidate approved successfully and moved to interview stage.');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to approve candidate.');
        }
    }

    /**
     * Reject a candidate.
     */
    public function reject(Request $request, string $id)
    {
        try {
            // Logic untuk reject kandidat
            // Update status di database
            
            return redirect()->route('assessment.index')
                ->with('success', 'Candidate rejected successfully.');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to reject candidate.');
        }
    }
}