<?php

namespace App\Http\Controllers;

use App\Models\Assessment;
use App\Models\Question;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AssessmentController extends Controller
{
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'test_type' => 'required|string|in:multiple_choice,essay,technical',
                'duration' => 'required|string|regex:/^\d+:[0-5][0-9]$/', // Format: H:MM
                'questions' => 'required|array|min:1',
                'questions.*.question' => 'required|string|min:5',
                'questions.*.options' => 'required|array|min:2',
                'questions.*.options.*' => 'nullable|string|distinct',
                'questions.*.correct_answer' => 'nullable|integer',
            ]);

            DB::beginTransaction();

            $assessment = Assessment::create([
                'title' => $validated['title'],
                'description' => $validated['description'],
                'test_type' => $validated['test_type'],
                'duration' => $validated['duration'],
            ]);

            foreach ($validated['questions'] as $questionData) {
                $options = array_values(array_filter($questionData['options']));

                if (count($options) >= 2) {
                    $questionAttributes = [
                        'assessment_id' => $assessment->id,
                        'question_text' => $questionData['question'],
                        'options' => $options,
                    ];

                    if (isset($questionData['correct_answer'])) {
                        $questionAttributes['correct_answer'] = $questionData['correct_answer'];
                    }

                    Question::create($questionAttributes);
                }
            }

            DB::commit();

            return redirect()->route('admin.questions.info')
                ->with('success', 'Assessment created successfully with '.count($validated['questions']).' questions');
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();

            return redirect()->back()->withErrors($e->validator)->withInput();
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error creating assessment: '.$e->getMessage());

            return redirect()->back()->withInput()
                ->with('error', 'Failed to save assessment: '.$e->getMessage());
        }
    }
}
