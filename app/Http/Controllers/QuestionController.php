<?php

namespace App\Http\Controllers;

use App\Models\Assessment;
use App\Models\Question;
use Illuminate\Http\Request;
use Inertia\Inertia;

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
        // Remove the JSON validation since we're sending a stringified array
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'test_type' => 'required|string|max:255',
            'duration' => 'required|string',
        ]);

        // Update assessment data
        $assessment->update([
            'title' => $request->title,
            'description' => $request->description,
            'test_type' => $request->test_type,
            'duration' => $request->duration,
        ]);

        // Process questions - decode if it's a JSON string, otherwise use as is
        $questions = is_string($request->questions) ? json_decode($request->questions, true) : $request->questions;
        
        // Delete existing questions that are not in the updated list
        $existingIds = collect($questions)->pluck('id')->filter(function($id) {
            return !is_string($id) && !empty($id); // Filter out temporary IDs
        })->toArray();
        
        // Delete questions not present in the submitted data
        $assessment->questions()->whereNotIn('id', $existingIds)->delete();
        
        // Update or create questions
        foreach ($questions as $questionData) {
            // New questions will have string IDs (timestamps) or be empty
            $isNew = is_string($questionData['id']) || empty($questionData['id']);
            
            if ($isNew) {
                // Create new question
                Question::create([
                    'assessment_id' => $assessment->id,
                    'question_text' => $questionData['question'],
                    'options' => $questionData['options'],
                ]);
            } else {
                // Update existing question
                Question::where('id', $questionData['id'])->update([
                    'question_text' => $questionData['question'],
                    'options' => $questionData['options'],
                ]);
            }
        }

        return redirect()->route('admin.questions.info')->with('success', 'Assessment updated successfully!');
    }
}
