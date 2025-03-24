<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\PsychometricTest;
use Illuminate\Support\Facades\Validator;

class PsychometricController extends Controller
{
    /**
     * Display the psychometric tests dashboard
     */
    public function index()
    {
        $tests = PsychometricTest::all();
        
        return Inertia::render('admin/psychometric/psychometric-management', [
            'tests' => $tests
        ]);
    }
    
    /**
     * Store a new psychometric test
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'status' => 'required|string|in:active,inactive',
        ]);
        
        $test = PsychometricTest::create($validated);
        
        return response()->json(['message' => 'Test created successfully', 'test' => $test]);
    }
    
    /**
     * Update an existing psychometric test
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'status' => 'required|string|in:active,inactive',
        ]);
        
        $test = PsychometricTest::findOrFail($id);
        $test->update($validated);
        
        return response()->json(['message' => 'Test updated successfully', 'test' => $test]);
    }
    
    /**
     * Delete a psychometric test
     */
    public function destroy($id)
    {
        $test = PsychometricTest::findOrFail($id);
        $test->delete();
        
        return response()->json(['message' => 'Test deleted successfully']);
    }
    
    /**
     * Get all psychometric tests (for AJAX requests)
     */
    public function getTests()
    {
        $tests = PsychometricTest::all();
        return response()->json(['tests' => $tests]);
    }

    /**
     * Show a specific psychometric test
     */
    public function show($id)
    {
        $test = PsychometricTest::findOrFail($id);
        return response()->json(['test' => $test]);
    }
}
