<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Question;
use App\Models\Answer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class QuestionController extends Controller
{
    public function index()
    {
        $questions = Question::select('id', 'statement_number', 'options')
            ->inRandomOrder()
            ->take(50)
            ->get();

        $userAnswers = Answer::where('user_id', Auth::id())
            ->whereIn('question_id', $questions->pluck('id'))
            ->pluck('answer', 'question_id')
            ->toArray();

        return Inertia::render('candidate/question', [
            'questions' => $questions,
            'userAnswers' => $userAnswers
        ]);
    }

    public function storeAnswer(Request $request)
    {
        $validated = $request->validate([
            'question_id' => 'required|exists:questions,id',
            'answer' => 'required|string'
        ]);

        $answer = Answer::updateOrCreate(
            [
                'user_id' => Auth::id(),
                'question_id' => $validated['question_id']
            ],
            [
                'answer' => $validated['answer']
            ]
        );

        return response()->json(['success' => true, 'answer' => $answer]);
    }
}
