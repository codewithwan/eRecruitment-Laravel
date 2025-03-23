<?php

namespace App\Http\Controllers;

use App\Models\Assessment;
use App\Models\Question;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class AssessmentController extends Controller
{
    public function store(Request $request)
    {
        try {
            // Enhanced debugging
            Log::info('AssessmentController@store method triggered');
            Log::info('Raw request data:', $request->all());
            
            // Validate the request
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'test_type' => 'required|string|max:255',
                'duration' => 'required|string',
                'questions' => 'required|array',
                'questions.*.question' => 'nullable|string',
                'questions.*.options' => 'required|array',
                'questions.*.options.*' => 'nullable|string',
            ]);
            
            Log::info('Validation passed');
            
            // Use transaction to ensure data integrity
            DB::beginTransaction();
            
            // Create the assessment with matching field names
            $assessment = Assessment::create([
                'title' => $request->title,
                'description' => $request->description,
                'test_type' => $request->test_type,
                'duration' => $request->duration,
            ]);
            
            Log::info('Assessment created with ID: ' . $assessment->id);
            
            // Filter out empty questions and options
            $filteredQuestions = collect($request->questions)->filter(function($q) {
                return !empty($q['options']) && collect($q['options'])->filter()->isNotEmpty();
            });
            
            Log::info('Filtered questions count: ' . $filteredQuestions->count());
            
            // Create questions
            foreach ($filteredQuestions as $questionData) {
                // Filter out empty options
                $options = collect($questionData['options'])->filter()->values()->toArray();
                
                if (empty($options)) {
                    continue; // Skip if no valid options
                }
                
                // Create the question
                $question = Question::create([
                    'assessment_id' => $assessment->id,
                    'question_text' => $questionData['question'] ?? '',
                    'options' => $options,
                ]);
                
                Log::info('Question created with ID: ' . $question->id);
            }
            
            DB::commit();
            Log::info('Transaction committed successfully');
            
            // Fix the redirect route
            return redirect()->route('admin.questions.info')->with('success', 'Assessment and questions created successfully');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error creating assessment: ' . $e->getMessage());
            Log::error('Exception stack trace: ' . $e->getTraceAsString());
            return redirect()->back()->withInput()->with('error', 'Failed to save assessment: ' . $e->getMessage());
        }
    }
}
