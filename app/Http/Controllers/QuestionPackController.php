<?php

namespace App\Http\Controllers;

use App\Models\Question;
use App\Models\QuestionPack;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class QuestionPackController extends Controller
{
    /**
     * Display a listing of the question packs.
     */
    public function index()
    {
        // Load question packs with their descriptions, test types, durations, and question counts
        $questionPacks = QuestionPack::withCount('questions')->get();

        Log::info('Retrieved question packs:', [
            'count' => $questionPacks->count(),
            'packs' => $questionPacks->toArray()
        ]);

        return Inertia::render('admin/questions/questionpack-management', [
            'questionPacks' => $questionPacks
        ]);
    }

    /**
     * Show the form for creating a new question pack.
     */
    public function create()
    {
        // Fetch all questions with their text
        $questions = Question::select('id', 'question_text as question', 'question_type')->get();

        return inertia('admin/questions/add-questionpacks', [
            'questions' => $questions
        ]);
    }

    /**
     * Store a newly created question pack in storage.
     */
    public function store(Request $request)
    {
        Log::info('QuestionPack data received:', $request->all());

        // Validate the request
        $validated = $request->validate([
            'pack_name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'test_type' => 'required|string',
            'duration' => 'required|numeric|min:0',
            'question_ids' => 'nullable|array',
            'question_ids.*' => 'exists:questions,id',
        ]);

        // Get the raw duration value directly from the request to avoid any potential modification
        $rawDuration = $request->input('duration');

        // Ensure we have a valid duration with a minimum of 60 minutes if not provided
        $duration = ($rawDuration && $rawDuration > 0) ? (int)$rawDuration : 60;

        Log::info('Duration processing:', [
            'raw_input' => $rawDuration,
            'parsed_value' => $duration,
            'data_type' => gettype($rawDuration)
        ]);

        // Create the question pack with the validated duration
        $questionPack = QuestionPack::create([
            'pack_name' => $validated['pack_name'],
            'description' => $validated['description'],
            'test_type' => $validated['test_type'],
            'duration' => $duration,
            'user_id' => Auth::user()->id,
            'status' => 'active',
        ]);

        Log::info('QuestionPack created with duration:', [
            'id' => $questionPack->id,
            'duration' => $questionPack->duration
        ]);

        // Handle question IDs - look for them directly in both validated data and request
        $questionIds = $validated['question_ids'] ?? $request->input('question_ids', []);
        Log::info('Raw question_ids received:', ['question_ids' => $questionIds]);

        if (!empty($questionIds)) {
            // Ensure question_ids is an array and contains valid IDs
            if (is_array($questionIds)) {
                Log::info('Attaching questions:', ['question_ids' => $questionIds]);

                try {
                    $questionPack->questions()->attach($questionIds);
                    Log::info('Questions attached successfully:', ['count' => count($questionIds)]);
                } catch (\Exception $e) {
                    Log::error('Error attaching questions:', ['error' => $e->getMessage()]);
                }
            } else {
                Log::warning('question_ids is not an array:', ['type' => gettype($questionIds)]);
            }
        } else {
            Log::info('No question_ids provided for attachment');
        }

        return redirect()->route('admin.questionpacks.index')->with('success', 'Question pack created successfully!');
    }

    /**
     * Display the specified question pack.
     */
    public function show(QuestionPack $questionpack)
    {
        $questionpack->load('questions');

        return inertia('admin/questions/ViewQuestionPack', [
            'questionPack' => $questionpack
        ]);
    }

    /**
     * Show the form for editing the specified question pack.
     */
    public function edit(QuestionPack $questionpack)
    {
        $questionpack->load('questions');
        $allQuestions = Question::all();

        return inertia('admin/questions/EditQuestionPack', [
            'questionPack' => $questionpack,
            'allQuestions' => $allQuestions
        ]);
    }

    /**
     * Update the specified question pack in storage.
     */
    public function update(Request $request, QuestionPack $questionpack)
    {
        $validated = $request->validate([
            'pack_name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'test_type' => 'nullable|string',
            'duration' => 'nullable|numeric|min:0',
            'question_ids' => 'nullable|array',
            'question_ids.*' => 'exists:questions,id',
        ]);

        $questionpack->update([
            'pack_name' => $validated['pack_name'],
            'description' => $validated['description'],
            'test_type' => $validated['test_type'] ?? $questionpack->test_type,
            'duration' => $validated['duration'] ?? $questionpack->duration,
        ]);

        // Sync questions
        if (isset($validated['question_ids'])) {
            $questionpack->questions()->sync($validated['question_ids']);
        }

        return redirect()->route('admin.questionpacks.index')->with('success', 'Question pack updated successfully!');
    }

    /**
     * Remove the specified question pack from storage.
     */
    public function destroy(QuestionPack $questionpack)
    {
        $questionpack->delete();

        return redirect()->route('admin.questionpacks.index')->with('success', 'Question pack deleted successfully!');
    }
}
