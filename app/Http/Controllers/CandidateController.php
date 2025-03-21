<?php

namespace App\Http\Controllers;

use App\Models\Candidate;
use App\Models\CandidateTest;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Http\Request;

class CandidateController extends Controller
{
    public function index()
    {
        $AuthUser = Auth::user();
        
        // Get or create candidate record for this user
        $candidate = Candidate::firstOrCreate(
            ['user_id' => $AuthUser->id],
            ['status' => 'applied', 'application_date' => now()]
        );
        
        // Get assigned tests for this candidate
        $candidateTests = CandidateTest::where('candidate_id', $candidate->id)
            ->where('status', 'scheduled')
            ->orderBy('scheduled_date')
            ->get()
            ->map(function($test) {
                return [
                    'id' => $test->id,
                    'test_type' => $test->test_type,
                    'scheduled_date' => $test->scheduled_date->format('d F Y'),
                    'scheduled_time' => $test->scheduled_date->format('H:i'),
                    'duration' => $test->duration,
                    'instructions' => $test->instructions,
                ];
            });
        
        return Inertia::render('candidate/candidate-dashboard', [
            'users' => $AuthUser,
            'candidateTests' => $candidateTests
        ]);
    }

    public function store()
    {
        return Inertia::render('candidate/profile/candidate-profile');
    }
    
    public function startTest($testId)
    {
        $candidateTest = CandidateTest::with('questions')
            ->where('id', $testId)
            ->where('candidate_id', Auth::user()->candidate->id)
            ->firstOrFail();
            
        // Update test status to in_progress
        $candidateTest->status = 'in_progress';
        $candidateTest->start_time = now();
        $candidateTest->save();
        
        return Inertia::render('candidate/take-test', [
            'test' => [
                'id' => $candidateTest->id,
                'test_type' => $candidateTest->test_type,
                'duration' => $candidateTest->duration,
                'questions' => $candidateTest->questions->map(function($question) {
                    return [
                        'id' => $question->id,
                        'question' => $question->question,
                        'options' => $question->options,
                    ];
                }),
            ]
        ]);
    }
    
    public function submitTest(Request $request, $testId)
    {
        $candidateTest = CandidateTest::findOrFail($testId);
        
        // Validate that this test belongs to the authenticated candidate
        if ($candidateTest->candidate_id !== Auth::user()->candidate->id) {
            abort(403);
        }
        
        // Update test status to completed
        $candidateTest->status = 'completed';
        $candidateTest->end_time = now();
        $candidateTest->save();
        
        // Save answers
        foreach ($request->answers as $questionId => $answer) {
            $candidateTest->questions()->updateExistingPivot($questionId, [
                'answer' => $answer
            ]);
        }
        
        return redirect()->route('user.info')->with('success', 'Test submitted successfully');
    }
}
