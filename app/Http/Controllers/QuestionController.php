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
            // Log received data for debugging
            Log::info('Update data received:', $request->all());
            
            DB::beginTransaction();
            
            // Update assessment data
            $assessment->update([
                'title' => $request->title,
                'description' => $request->description,
                'test_type' => $request->test_type,
                'duration' => $request->duration,
            ]);

            // Process questions - decode if it's a JSON string, otherwise use as is
            $questions = is_string($request->questions) ? json_decode($request->questions, true) : $request->questions;
            
            if ($questions && is_array($questions)) {
                Log::info('Processing questions:', ['count' => count($questions)]);
                
                // Get existing question IDs
                $existingIds = collect($questions)
                    ->pluck('id')
                    ->filter(function($id) {
                        return is_numeric($id) && $id > 0; // Only keep valid numeric IDs
                    })
                    ->toArray();
                
                // Delete questions not in the update list
                Question::where('assessment_id', $assessment->id)
                    ->whereNotIn('id', $existingIds)
                    ->delete();
                
                // Update or create questions
                foreach ($questions as $questionData) {
                    // Skip empty questions or questions without options
                    $options = $questionData['options'] ?? [];
                    $options = array_filter($options, fn($opt) => !empty(trim($opt)));
                    
                    if (empty($options)) {
                        continue;
                    }
                    
                    $data = [
                        'assessment_id' => $assessment->id,
                        'question_text' => $questionData['question'] ?? '',
                        'options' => json_encode($options),
                    ];
                    
                    // Check if it's a new question or existing one
                    if (isset($questionData['id']) && is_numeric($questionData['id']) && $questionData['id'] > 0) {
                        Question::where('id', $questionData['id'])->update($data);
                        Log::info('Updated question', ['id' => $questionData['id']]);
                    } else {
                        $question = Question::create($data);
                        Log::info('Created new question', ['id' => $question->id]);
                    }
                }
            }
            
            DB::commit();
            
            return redirect()->route('admin.questions.info')
                ->with('success', 'Assessment updated successfully!');
                
        } catch (\Exception $e) {
            DB::rollBack();
            
            Log::error('Error updating assessment: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ]);
            
            return response()->json([
                'error' => 'Failed to update assessment: ' . $e->getMessage()
            ], 500);
        }
    }
}
