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
    public function index(Request $request)
{
    $questions = Question::select('id', 'question_text', 'correct_answer', 'question_type', 'created_at', 'updated_at')
        ->paginate($request->get('per_page', 10));

        return inertia('admin/questions/questions-set/question-set', [
            'questions' => $questions
        ]);
}


public function indexPack(Request $request)
{
    $questionPacks = []; 

    return Inertia::render('admin/questions/questions-packs/question-packs', [
        'tests' => $questionPacks
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
            'questionPack' => $questionPack,
            'tempQuestions' => []
        ]);
    }

    /**
     * Store a newly created question in storage.
     */
    public function store(Request $request)
    {
        Log::info('Received question data:', $request->all());

        $request->validate([
            'questions' => 'required|string',
        ]);

        try {
            // Decode the JSON string to an array
            $questionsData = json_decode($request->questions, true);

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
                    'question_text' => $questionData['question'] ?? '',
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
                return redirect()->route('admin.questions.info')->with('success', 'Questions added to pack successfully!');
            }

            // If we don't have a pack, redirect directly to question list
            DB::commit();

            return redirect()->route('admin.questions.info')->with('success', 'Questions created successfully!');
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
        $question = Question::with('questionPacks')->findOrFail($id);

        return inertia('admin/questions/view-question', [
            'question' => $question
        ]);
    }

    /**
     * Show the form for editing the specified question.
     */
    public function edit($id)
    {
        $question = Question::with('questionPacks')->findOrFail($id);

        return inertia('admin/questions/edit-questions', [
            'question' => $question
        ]);
    }

    /**
     * Update the specified question in storage.
     */
    public function update(Request $request, Question $question)
    {
        $request->validate([
            'question_text' => 'nullable|string',
            'options' => 'required|array',
            'options.*' => 'required|string',
            'correct_answer' => 'required|string',
        ]);

        $question->update([
            'question_text' => $request->question_text,
            'options' => $request->options,
            'correct_answer' => $request->correct_answer,
        ]);

        return redirect()->route('admin.questions.info')->with('success', 'Question updated successfully!');
    }

    /**
     * Remove the specified question from storage.
     */
    public function destroy(Question $question)
    {
        try {
            $question->delete();

            return redirect()->back()->with('success', 'Question deleted successfully!');
        } catch (\Exception $e) {
            Log::error('Error deleting question: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to delete question'], 500);
        }
    }
}