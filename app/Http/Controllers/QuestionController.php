<?php

namespace App\Http\Controllers;

use App\Models\Question;
use App\Models\QuestionPack;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class QuestionController extends Controller
{
    /**
     * Display a listing of the questions.
     */
    public function index()
    {
        // Load questions with their related question packs
        $questions = Question::with('questionPacks')->get();

        // Log the questions for debugging
        Log::info('Questions retrieved for management page:', ['count' => $questions->count()]);

        return inertia('admin/questions/questions-set/question-set', [
            'questions' => $questions
        ]);
    }

    /**
     * Show the form for creating a new question.
     */
    public function create(Request $request)
    {
        $questionPack = null;
        if ($request->has('pack_id')) {
            $questionPack = QuestionPack::find($request->pack_id);
        }

        return inertia('admin/questions/questions-set/add-questions', [
            'questionPack' => $questionPack
        ]);
    }

    /**
     * Store a newly created question in storage.
     */
    public function store(Request $request)
    {
        Log::info('Received question data:', $request->all());

        $request->validate([
            'questions' => 'required|array',
            'questions.*.question_text' => 'required|string',
            'questions.*.options' => 'required|array',
            'questions.*.options.*' => 'required|string',
            'questions.*.correct_answer' => 'required|string',
        ]);

        try {
            // Use the questions directly from the request
            $questionsData = $request->questions;

            if (!is_array($questionsData) || count($questionsData) === 0) {
                return redirect()->back()->with('error', 'Invalid question data format.');
            }

            $createdQuestions = [];

            // Start a database transaction
            DB::beginTransaction();

            foreach ($questionsData as $questionData) {
                // Validate each question
                if (empty($questionData['options']) || !is_array($questionData['options'])) {
                    continue;
                }

                $validOptions = array_filter($questionData['options'], function ($option) {
                    return trim($option) !== '';
                });

                if (count($validOptions) === 0) {
                    continue;
                }

                // Create the question
                $question = Question::create([
                    'question_text' => $questionData['question_text'] ?? '',
                    'options' => $validOptions,
                    'correct_answer' => $questionData['correct_answer'] ?? $validOptions[0],
                    'question_type' => 'multiple_choice'
                ]);

                $createdQuestions[] = $question;
            }

            // If we have a question_pack_id, attach the questions to the pack
            if ($request->has('question_pack_id') && $request->question_pack_id) {
                $packId = $request->question_pack_id;
                $pack = QuestionPack::find($packId);

                if ($pack) {
                    foreach ($createdQuestions as $question) {
                        $pack->questions()->attach($question->id);
                    }
                }

                DB::commit();
                return redirect()->route('admin.questions.question-set')->with('success', 'Questions added to pack successfully!');
            }

            // If we don't have a pack, redirect directly to question list
            DB::commit();

            return redirect()->route('admin.questions.question-set')->with('success', 'Questions created successfully!');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error creating questions: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Failed to save questions: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified question.
     */
    public function show($id)
    {
        try {
            $question = Question::with('questionPacks')->findOrFail($id);

            return inertia('admin/questions/questions-set/view-question', [
                'question' => $question
            ]);
        } catch (\Exception $e) {
            Log::error('Error showing question: ' . $e->getMessage());
            return redirect()->route('admin.questions.question-set')->with('error', 'Question not found.');
        }
    }

    /**
     * Show the form for editing the specified question.
     */
    public function edit($id)
    {
        try {
            $question = Question::with('questionPacks')->findOrFail($id);

            return inertia('admin/questions/questions-set/edit-questions', [
                'question' => $question
            ]);
        } catch (\Exception $e) {
            Log::error('Error editing question: ' . $e->getMessage());
            return redirect()->route('admin.questions.question-set')->with('error', 'Question not found.');
        }
    }

    /**
     * Update the specified question in storage.
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'question_text' => 'required|string',
            'options' => 'required|array|min:2',
            'options.*' => 'required|string',
            'correct_answer' => 'required|string',
        ]);

        try {
            $question = Question::findOrFail($id);
            
            // Validate that correct_answer exists in options
            if (!in_array($request->correct_answer, $request->options)) {
                return redirect()->back()->with('error', 'The correct answer must be one of the options.');
            }

            $question->update([
                'question_text' => $request->question_text,
                'options' => $request->options,
                'correct_answer' => $request->correct_answer,
            ]);

            return redirect()->route('admin.questions.question-set')->with('success', 'Question updated successfully!');
        } catch (\Exception $e) {
            Log::error('Error updating question: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Failed to update question: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified question from storage.
     */
    public function destroy($id)
    {
        try {
            $question = Question::findOrFail($id);
            
            // First, detach the question from all question packs
            $question->questionPacks()->detach();
            
            // Then delete the question
            $question->delete();

            return redirect()->route('admin.questions.question-set')->with('success', 'Question deleted successfully!');
        } catch (\Exception $e) {
            Log::error('Error deleting question: ' . $e->getMessage());
            return redirect()->route('admin.questions.question-set')->with('error', 'Failed to delete question: ' . $e->getMessage());
        }
    }
}
