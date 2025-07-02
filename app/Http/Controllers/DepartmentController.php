<?php

namespace App\Http\Controllers;

use App\Models\Departement;
use App\Models\Status;
use App\Models\EducationLevel;
use App\Models\MasterMajor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class DepartmentController extends Controller
{
    /**
     * Display the department and recruitment stage management page.
     */
    public function index()
    {
        $departments = Departement::withCount('vacancies')->get();
        $recruitmentStages = Status::whereIn('code', ['admin_selection', 'psychotest', 'interview'])->get();
        $applicationStatuses = Status::whereIn('code', ['accepted', 'rejected'])->get();
        $educationLevels = EducationLevel::withCount('vacancies')->orderBy('name')->get();
        $majors = MasterMajor::withCount('candidatesEducations')->orderBy('name')->get();

        return Inertia::render('admin/management/department-stage', [
            'departments' => $departments,
            'recruitmentStages' => $recruitmentStages,
            'applicationStatuses' => $applicationStatuses,
            'educationLevels' => $educationLevels,
            'majors' => $majors,
        ]);
    }

    /**
     * Store a new department.
     */
    public function storeDepartment(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255|unique:departements,name',
            ]);

            $department = Departement::create($validated);

            return response()->json([
                'message' => 'Department created successfully',
                'department' => $department,
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error creating department: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error creating department',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update an existing department.
     */
    public function updateDepartment(Request $request, $id)
    {
        try {
            $department = Departement::findOrFail($id);
            
            $validated = $request->validate([
                'name' => 'required|string|max:255|unique:departements,name,' . $id,
            ]);

            $department->update($validated);

            return response()->json([
                'message' => 'Department updated successfully',
                'department' => $department,
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error updating department: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error updating department',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Delete a department.
     */
    public function destroyDepartment($id)
    {
        try {
            $department = Departement::findOrFail($id);
            
            // Check if department has any vacancies
            if ($department->vacancies()->count() > 0) {
                return response()->json([
                    'message' => 'Cannot delete department with existing vacancies',
                ], 400);
            }

            $department->delete();

            return response()->json([
                'message' => 'Department deleted successfully',
            ]);
        } catch (\Exception $e) {
            Log::error('Error deleting department: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error deleting department',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Store a new recruitment stage.
     */
    public function storeStage(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'code' => 'required|string|max:100|unique:statuses,code',
                'description' => 'nullable|string|max:500',
                'stage' => 'required|string|max:255',
                'is_active' => 'required|boolean',
            ]);

            $stage = Status::create($validated);

            return response()->json([
                'message' => 'Recruitment stage created successfully',
                'stage' => $stage,
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error creating recruitment stage: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error creating recruitment stage',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update an existing recruitment stage.
     */
    public function updateStage(Request $request, $id)
    {
        try {
            $stage = Status::findOrFail($id);
            
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'code' => 'required|string|max:100|unique:statuses,code,' . $id,
                'description' => 'nullable|string|max:500',
                'stage' => 'required|string|max:255',
                'is_active' => 'required|boolean',
            ]);

            $stage->update($validated);

            return response()->json([
                'message' => 'Recruitment stage updated successfully',
                'stage' => $stage,
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error updating recruitment stage: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error updating recruitment stage',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Delete a recruitment stage.
     */
    public function destroyStage($id)
    {
        try {
            $stage = Status::findOrFail($id);
            
            // Check if stage is being used in applications
            if ($stage->applications()->count() > 0) {
                return response()->json([
                    'message' => 'Cannot delete status that is currently in use',
                ], 400);
            }

            $stage->delete();

            return response()->json([
                'message' => 'Recruitment stage deleted successfully',
            ]);
        } catch (\Exception $e) {
            Log::error('Error deleting recruitment stage: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error deleting recruitment stage',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update recruitment stage order.
     * Note: Order functionality has been removed in new structure.
     */
    public function updateStageOrder(Request $request)
    {
        return response()->json([
            'message' => 'Stage ordering is no longer supported in the current system structure',
        ], 400);
    }

    /**
     * Store a new education level.
     */
    public function storeEducationLevel(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255|unique:education_levels,name',
            ]);

            $educationLevel = EducationLevel::create($validated);

            return response()->json([
                'message' => 'Education level created successfully',
                'educationLevel' => $educationLevel,
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error creating education level: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error creating education level',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update an existing education level.
     */
    public function updateEducationLevel(Request $request, $id)
    {
        try {
            $educationLevel = EducationLevel::findOrFail($id);
            
            $validated = $request->validate([
                'name' => 'required|string|max:255|unique:education_levels,name,' . $id,
            ]);

            $educationLevel->update($validated);

            return response()->json([
                'message' => 'Education level updated successfully',
                'educationLevel' => $educationLevel,
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error updating education level: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error updating education level',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Delete an education level.
     */
    public function destroyEducationLevel($id)
    {
        try {
            $educationLevel = EducationLevel::findOrFail($id);
            
            // Check if education level is being used in vacancies
            if ($educationLevel->vacancies()->count() > 0) {
                return response()->json([
                    'message' => 'Cannot delete education level that is currently used in vacancies',
                ], 400);
            }

            $educationLevel->delete();

            return response()->json([
                'message' => 'Education level deleted successfully',
            ]);
        } catch (\Exception $e) {
            Log::error('Error deleting education level: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error deleting education level',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Store a new major.
     */
    public function storeMajor(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255|unique:master_majors,name',
            ]);

            $major = MasterMajor::create($validated);

            return response()->json([
                'message' => 'Major created successfully',
                'major' => $major,
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error creating major: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error creating major',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update an existing major.
     */
    public function updateMajor(Request $request, $id)
    {
        try {
            $major = MasterMajor::findOrFail($id);
            
            $validated = $request->validate([
                'name' => 'required|string|max:255|unique:master_majors,name,' . $id,
            ]);

            $major->update($validated);

            return response()->json([
                'message' => 'Major updated successfully',
                'major' => $major,
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error updating major: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error updating major',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Delete a major.
     */
    public function destroyMajor($id)
    {
        try {
            $major = MasterMajor::findOrFail($id);
            
            // Check if major is used in any candidate educations
            if ($major->candidatesEducations()->count() > 0) {
                return response()->json([
                    'message' => 'Cannot delete major that is being used by candidates',
                ], 400);
            }

            $major->delete();

            return response()->json([
                'message' => 'Major deleted successfully',
            ]);
        } catch (\Exception $e) {
            Log::error('Error deleting major: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error deleting major',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
} 