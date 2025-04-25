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
            // Log the request data for debugging
            Log::info('Assessment data received:', $request->all());
            
            // Start database transaction
            DB::beginTransaction();
            
            // Validate essential data
            $validatedData = $request->validate([
                'title' => 'required|string',
                'description' => 'required|string',
                'testType' => 'required|string',
                'duration' => 'required|string',
                'questions' => 'present|array',
            ]);
            
            // Create the assessment
            $assessment = Assessment::create([
                'title' => $request->title,
                'description' => $request->description,
                'test_type' => $request->testType,
                'duration' => $request->duration,
            ]);
            
            Log::info('Assessment created:', ['id' => $assessment->id]);
            
            // Process questions if not empty
            if (!empty($request->questions)) {
                foreach ($request->questions as $questionData) {
                    // Skip completely empty questions
                    if (empty($questionData['question']) && empty($questionData['options'])) {
                        continue;
                    }
                    
                    // Make sure options is an array and filter empty options
                    $options = is_array($questionData['options']) 
                        ? array_filter($questionData['options'], fn($option) => !empty(trim($option)))
                        : [];
                    
                    if (empty($options)) {
                        continue; // Skip questions with no valid options
                    }
                    
                    // Create question
                    $question = Question::create([
                        'assessment_id' => $assessment->id,
                        'question_text' => $questionData['question'] ?? '',
                        'options' => json_encode($options),
                    ]);
                    
                    Log::info('Question created:', ['id' => $question->id]);
                }
            }
            
            // Commit the transaction
            DB::commit();
            
            Log::info('Assessment created successfully', ['id' => $assessment->id]);
            return redirect()->route('admin.questions.info')->with('success', 'Assessment created successfully');
            
        } catch (\Exception $e) {
            // Roll back the transaction
            DB::rollBack();
            
            Log::error('Error creating assessment: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'error' => 'Failed to save assessment: ' . $e->getMessage()
            ], 500);
        }
    }
}
