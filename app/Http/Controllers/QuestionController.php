<?php

namespace App\Http\Controllers;

use App\Models\Assessment;
use App\Models\Question;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class QuestionController extends Controller
{
    public function store()
    {
        $assessments = Assessment::withCount('questions')->get();
        
        return Inertia::render('admin/questions/question-management', [
            'tests' => $assessments
        ]);
    }

    public function create(Request $request)
    {
        return Inertia::render('admin/questions/add-questions');
    }

    public function edit(Assessment $assessment)
    {
        // Load the assessment with its questions
        $assessment->load('questions');
        
        return Inertia::render('admin/questions/edit-questions', [
            'assessment' => $assessment
        ]);
    }

    public function update(Request $request, Assessment $assessment)
    {
        try {
            DB::beginTransaction();

            // Update assessment details
            $assessment->update([
                'title' => $request->title,
                'description' => $request->description,
                'test_type' => $request->test_type,
                'duration' => $request->duration,
            ]);

            // Parse questions from JSON string
            $questions = json_decode($request->questions, true);

            // Remove existing questions
            $assessment->questions()->delete();

            // Create new questions
            foreach ($questions as $questionData) {
                if (!empty($questionData['options'])) {
                    Question::create([
                        'assessment_id' => $assessment->id,
                        'question_text' => $questionData['question_text'],
                        'options' => $questionData['options'],
                    ]);
                }
            }

            DB::commit();
            return redirect()->route('admin.questions.info')
                ->with('success', 'Assessment updated successfully');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Update failed: ' . $e->getMessage());
            return back()->with('error', 'Failed to update assessment');
        }
    }

    public function index()
    {
        // This method is being called in routes but wasn't implemented
        // Since we already have a 'store' method that returns assessments,
        // we can use the same implementation here
        $assessments = Assessment::withCount('questions')->get();
        
        return Inertia::render('admin/questions/question-management', [
            'tests' => $assessments
        ]);
    }
}
