<?php

namespace App\Http\Controllers;

use App\Models\Candidate;
use App\Models\CandidateTest;
use App\Models\Question;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class CandidateTestController extends Controller
{
    public function index()
    {
        // Get all candidate tests with candidate and test details
        $candidateTests = CandidateTest::with(['candidate.user', 'questions'])
            ->orderBy('created_at', 'desc')
            ->get();

        // Group by candidate
        $testsByCandidates = $candidateTests->groupBy('candidate_id')->map(function($tests) {
            $candidate = $tests->first()->candidate;
            return [
                'candidate' => [
                    'id' => $candidate->id,
                    'name' => $candidate->user->name,
                    'email' => $candidate->user->email,
                    'position' => $candidate->position_applied,
                ],
                'tests' => $tests->map(function($test) {
                    return [
                        'id' => $test->id,
                        'test_type' => $test->test_type,
                        'status' => $test->status,
                        'scheduled_date' => $test->scheduled_date,
                        'duration' => $test->duration,
                        'question_count' => $test->questions->count(),
                    ];
                })
            ];
        })->values();

        return inertia('admin/psychometric/candidate-tests', [
            'testsByCandidates' => $testsByCandidates
        ]);
    }

    public function create()
    {
        // Get all candidates and test types for the form
        $candidates = User::where('role', 'candidate')
            ->with('candidate')
            ->get()
            ->map(function($user) {
                return [
                    'id' => $user->candidate->id ?? null,
                    'name' => $user->name,
                    'email' => $user->email,
                    'position' => $user->candidate->position_applied ?? 'N/A',
                ];
            })
            ->filter(function($candidate) {
                return $candidate['id'] !== null;
            })
            ->values();

        // Get unique test types from questions table
        $testTypes = Question::select('test_type')
            ->distinct()
            ->get()
            ->pluck('test_type');

        return inertia('admin/psychometric/assign-test', [
            'candidates' => $candidates,
            'testTypes' => $testTypes
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'candidate_id' => 'required|exists:candidates,id',
            'test_type' => 'required|string',
            'scheduled_date' => 'required|date',
            'duration' => 'required|string',
            'instructions' => 'nullable|string',
        ]);

        try {
            // Get questions for this test type
            $questions = Question::where('test_type', $validated['test_type'])->get();
            
            if ($questions->isEmpty()) {
                return back()->with('error', 'No questions found for this test type');
            }

            // Create candidate test
            $candidateTest = CandidateTest::create([
                'candidate_id' => $validated['candidate_id'],
                'test_type' => $validated['test_type'],
                'status' => 'scheduled',
                'scheduled_date' => $validated['scheduled_date'],
                'duration' => $validated['duration'],
                'instructions' => $validated['instructions'] ?? '',
            ]);

            // Attach questions to candidate test
            $candidateTest->questions()->attach($questions->pluck('id'));

            return redirect()->route('admin.candidate-tests')->with('success', 'Test assigned successfully');
        } catch (\Exception $e) {
            Log::error('Error assigning test: ' . $e->getMessage());
            return back()->with('error', 'Error assigning test: ' . $e->getMessage());
        }
    }

    public function show($id)
    {
        $candidateTest = CandidateTest::with(['candidate.user', 'questions'])->findOrFail($id);
        
        return inertia('admin/psychometric/test-details', [
            'test' => [
                'id' => $candidateTest->id,
                'candidate' => [
                    'name' => $candidateTest->candidate->user->name,
                    'email' => $candidateTest->candidate->user->email,
                    'position' => $candidateTest->candidate->position_applied,
                ],
                'test_type' => $candidateTest->test_type,
                'status' => $candidateTest->status,
                'scheduled_date' => $candidateTest->scheduled_date,
                'duration' => $candidateTest->duration,
                'instructions' => $candidateTest->instructions,
                'questions_count' => $candidateTest->questions->count(),
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
}
