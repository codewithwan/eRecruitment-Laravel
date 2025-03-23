<?php

namespace App\Http\Controllers;

use App\Models\Assessment;
use App\Models\Question;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class AssessmentController extends Controller
{
    public function store(Request $request)
    {
        try {
            // Log the request data for debugging
            Log::info('Assessment data received:', $request->all());
            
            // Create the assessment
            $assessment = Assessment::create([
                'title' => $request->title,
                'description' => $request->description,
                'test_type' => $request->testType,
                'duration' => $request->duration,
            ]);
            
            Log::info('Assessment created with ID: ' . $assessment->id);
            
            // Create questions (without correct_answer as requested)
            foreach ($request->questions as $questionData) {
                // Don't encode options - the model cast will handle this
                $question = Question::create([
                    'assessment_id' => $assessment->id,
                    'question_text' => $questionData['question'],
                    'options' => $questionData['options'],
                ]);
                
                Log::info('Question created with ID: ' . $question->id);
            }
            
            // Fix the redirect route
            return redirect()->route('admin.questions.info')->with('success', 'Assessment and questions created successfully');
        } catch (\Exception $e) {
            Log::error('Error creating assessment: ' . $e->getMessage());
            Log::error($e->getTraceAsString());
            return redirect()->back()->withInput()->with('error', 'Failed to save assessment: ' . $e->getMessage());
        }
    }
}
