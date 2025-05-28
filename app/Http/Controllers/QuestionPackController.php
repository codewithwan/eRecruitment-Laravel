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

        return Inertia::render('admin/questions/questions-packs/question-packs', [
            'questionPacks' => $questionPacks
        ]);
    }

    /**
     * Show the form for creating a new question pack.
     */
    public function create()
    {
        // Fetch all questions with their text
        $questions = Question::select('id', 'question_text', 'question_type')->get();

        return inertia('admin/questions/questions-packs/add-question-packs', [
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
            'duration' => 'required|string',
            'question_ids' => 'required|array',
            'question_ids.*' => 'exists:questions,id',
        ]);

        // Get the duration string in HH:MM:SS format
        $durationStr = $request->input('duration');
        
        // Convert HH:MM:SS string to minutes for storage
        $durationParts = explode(':', $durationStr);
        $hours = (int) $durationParts[0];
        $minutes = (int) $durationParts[1];
        $seconds = (int) $durationParts[2];
        
        // Calculate total minutes - this is what we'll store
        $duration = ($hours * 60) + $minutes + ($seconds / 60);
        
        Log::info('Duration processing:', [
            'raw_input' => $durationStr,
            'hours' => $hours,
            'minutes' => $minutes,
            'seconds' => $seconds,
            'total_minutes' => $duration
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

        return inertia('admin/questions/questions-packs/view-question-pack', [
            'questionPack' => $questionpack
        ]);
    }

    /**
     * Show the form for editing the specified question pack.
     */
    public function edit(QuestionPack $questionpack)
    {
        $questionpack->load('questions');
        $allQuestions = Question::select('id', 'question_text', 'question_type')->get();

        return inertia('admin/questions/questions-packs/edit-question-packs', [
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
