<?php

namespace App\Http\Controllers;

use App\Models\Question;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class QuestionController extends Controller
{
    public function index()
    {
        // Fetch questions from the database
        $questions = Question::all();

        // Group questions by test_type
        $tests = $questions->groupBy('test_type')->map(function ($items, $testType) {
            $firstItem = $items->first();
            return [
                'id' => $testType, // Use test_type as the ID for editing
                'title' => $testType,
                'description' => "Set of questions for " . $testType,
                'time_limit' => $firstItem->duration,
                'question_count' => $items->count(),
                'test_type' => $testType,
                'questions' => $items
            ];
        })->values();

        return inertia('admin/questions/question-management', [
            'tests' => $tests,
        ]);
    }

    public function createForm()
    {
        // Return the view for creating a new question
        return inertia('admin/questions/add-questions');
    }

    public function editForm($testType)
    {
        // Fetch questions for the specified test type
        $questions = Question::where('test_type', $testType)->get();
        
        if ($questions->isEmpty()) {
            return redirect()->route('admin.questions')->with('error', 'Test not found');
        }

        // Get the test details from the first question
        $firstQuestion = $questions->first();
        
        return inertia('admin/questions/edit-questions', [
            'testType' => $testType,
            'duration' => $firstQuestion->duration,
            'questions' => $questions
        ]);
    }

    public function update(Request $request, $testType)
    {
        // Validate the incoming request
        $validated = $request->validate([
            'testType' => 'required|string',
            'duration' => 'required|string',
            'questions' => 'required|array',
            'questions.*.id' => 'nullable|numeric', // For existing questions
            'questions.*.question' => 'nullable|string',
            'questions.*.options' => 'required|array',
            'questions.*.options.*' => 'required|string',
        ]);

        try {
            // First, delete questions that are not in the updated list
            $existingQuestionIds = collect($request->questions)
                ->filter(function ($q) {
                    return isset($q['id']);
                })
                ->pluck('id');

            Question::where('test_type', $testType)
                ->whereNotIn('id', $existingQuestionIds)
                ->delete();

            // Update or create questions
            foreach ($request->questions as $questionData) {
                if (isset($questionData['id'])) {
                    // Update existing question
                    Question::where('id', $questionData['id'])->update([
                        'question' => $questionData['question'] ?? '',
                        'options' => $questionData['options'],
                        'test_type' => $request->testType,
                        'duration' => $request->duration,
                    ]);
                } else {
                    // Create new question
                    Question::create([
                        'question' => $questionData['question'] ?? '',
                        'options' => $questionData['options'],
                        'test_type' => $request->testType,
                        'duration' => $request->duration,
                    ]);
                }
            }

            return redirect()->route('admin.questions')->with('success', 'Test updated successfully');
        } catch (\Exception $e) {
            Log::error('Error updating questions: ' . $e->getMessage());
            return back()->with('error', 'Error updating questions: ' . $e->getMessage());
        }
    }

    public function store(Request $request)
    {
        // Validate the incoming request
        $validated = $request->validate([
            'testType' => 'required|string',
            'duration' => 'required|string',
            'questions' => 'required|array',
            'questions.*.question' => 'nullable|string', // Make question nullable
            'questions.*.options' => 'required|array', // Keep options required
            'questions.*.options.*' => 'required|string', // Each option item should be filled
        ]);

        try {
            // Check if there are questions to save
            if (count($request->questions) === 0) {
                return back()->with('error', 'No valid questions were provided');
            }

            // Create a model for each question
            foreach ($request->questions as $questionData) {
                \App\Models\Question::create([
                    'question' => $questionData['question'] ?? '', // Default to empty string if null
                    'options' => $questionData['options'],
                    'test_type' => $request->testType,
                    'duration' => $request->duration,
                ]);
            }

            return redirect()->route('admin.questions')->with('success', 'Questions saved successfully');
        } catch (\Exception $e) {
            // Log the error
            Log::error('Error saving questions: ' . $e->getMessage());
            
            // Return with error
            return back()->with('error', 'Error saving questions: ' . $e->getMessage());
        }
    }
}
