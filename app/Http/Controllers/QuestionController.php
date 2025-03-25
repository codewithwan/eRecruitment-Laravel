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
        $assessment->load('questions');
        Log::info('Assessment questions: ' . $assessment->questions);
        return Inertia::render('admin/questions/edit-questions', [
            'assessment' => $assessment
        ]);
    }

    public function update(Request $request, Assessment $assessment)
    {
        try {
            DB::beginTransaction();

            $assessment->update([
                'title' => $request->title,
                'description' => $request->description,
                'test_type' => $request->test_type,
                'duration' => $request->duration,
            ]);

            $questions = json_decode($request->questions, true);

            $assessment->questions()->delete();

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
        $assessments = Assessment::withCount('questions')->get();
        
        return Inertia::render('admin/questions/question-management', [
            'tests' => $assessments
        ]);
    }
}
