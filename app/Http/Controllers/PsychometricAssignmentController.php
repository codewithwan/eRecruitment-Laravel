<?php

namespace App\Http\Controllers;

use App\Models\Assessment;
use App\Models\Candidate;
use App\Models\PsychometricAssignment;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class PsychometricAssignmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $assignments = PsychometricAssignment::with(['candidate.user', 'assessment'])
            ->latest()
            ->paginate(10);
        
        return Inertia::render('admin/psychometric/assignments/index', [
            'assignments' => $assignments
        ]);
    }

    /**
     * Show the form for creating a new assignment.
     */
    public function create()
    {
        $candidates = Candidate::with('user')->get();
        $assessments = Assessment::all();
        
        return Inertia::render('admin/psychometric/assignments/create', [
            'candidates' => $candidates,
            'assessments' => $assessments
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'candidate_id' => 'required|exists:candidates,id',
            'assessment_id' => 'required|exists:assessments,id',
            'scheduled_date' => 'required|date|after:now',
            'status' => ['sometimes', Rule::in(['pending', 'ongoing', 'completed'])],
            'notification_sent' => 'sometimes|boolean',
        ]);

        $assignment = PsychometricAssignment::create($validated);

        if ($request->wantsJson()) {
            return response()->json([
                'message' => 'Assignment created successfully',
                'assignment' => $assignment->load(['candidate.user', 'assessment'])
            ]);
        }

        return redirect()->route('admin.psychometric.assignments.index')
            ->with('success', 'Assignment created successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(PsychometricAssignment $assignment)
    {
        $assignment->load(['candidate.user', 'assessment']);
        
        return Inertia::render('admin/psychometric/assignments/show', [
            'assignment' => $assignment
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(PsychometricAssignment $assignment)
    {
        $candidates = Candidate::with('user')->get();
        $assessments = Assessment::all();
        
        return Inertia::render('admin/psychometric/assignments/edit', [
            'assignment' => $assignment,
            'candidates' => $candidates,
            'assessments' => $assessments
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, PsychometricAssignment $assignment)
    {
        $validated = $request->validate([
            'candidate_id' => 'sometimes|exists:candidates,id',
            'assessment_id' => 'sometimes|exists:assessments,id',
            'scheduled_date' => 'sometimes|date',
            'status' => ['sometimes', Rule::in(['pending', 'ongoing', 'completed'])],
            'notification_sent' => 'sometimes|boolean',
        ]);

        $assignment->update($validated);

        if ($request->wantsJson()) {
            return response()->json([
                'message' => 'Assignment updated successfully',
                'assignment' => $assignment->load(['candidate.user', 'assessment'])
            ]);
        }

        return redirect()->route('admin.psychometric.assignments.index')
            ->with('success', 'Assignment updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PsychometricAssignment $assignment)
    {
        $assignment->delete();

        return response()->json([
            'message' => 'Assignment deleted successfully'
        ]);
    }

    /**
     * Send notification for the assessment.
     */
    public function sendNotification(PsychometricAssignment $assignment)
    {
        // Logic to send notification to candidate
        // This would typically involve sending an email or notification
        
        $assignment->update(['notification_sent' => true]);
        
        return response()->json([
            'message' => 'Notification sent successfully'
        ]);
    }

    /**
     * Update the status of the assignment.
     */
    public function updateStatus(Request $request, PsychometricAssignment $assignment)
    {
        $validated = $request->validate([
            'status' => ['required', Rule::in(['pending', 'ongoing', 'completed'])],
        ]);

        $assignment->update($validated);
        
        return response()->json([
            'message' => 'Status updated successfully',
            'assignment' => $assignment
        ]);
    }
}
