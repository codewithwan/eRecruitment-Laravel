<?php

namespace App\Http\Controllers;

use App\Models\Department;
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
        $departments = Department::withCount('vacancies')->get();
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
                'name' => 'required|string|max:255|unique:departments,name',
            ]);

            $department = Department::create($validated);

            return redirect()->route('admin.management.department-stage')->with('success', 'Department created successfully');
        } catch (\Illuminate\Validation\ValidationException $e) {
            return redirect()->back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            Log::error('Error creating department: ' . $e->getMessage());
            return redirect()->back()->withErrors(['error' => 'Error creating department: ' . $e->getMessage()])->withInput();
        }
    }

    /**
     * Update an existing department.
     */
    public function updateDepartment(Request $request, $id)
    {
        try {
            $department = Department::findOrFail($id);
            
            $validated = $request->validate([
                'name' => 'required|string|max:255|unique:departments,name,' . $id,
            ]);

            $department->update($validated);

            return redirect()->route('admin.management.department-stage')->with('success', 'Department updated successfully');
        } catch (\Illuminate\Validation\ValidationException $e) {
            return redirect()->back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            Log::error('Error updating department: ' . $e->getMessage());
            return redirect()->back()->withErrors(['error' => 'Error updating department: ' . $e->getMessage()])->withInput();
        }
    }

    /**
     * Delete a department.
     */
    public function destroyDepartment($id)
    {
        try {
            $department = Department::findOrFail($id);
            
            // Check if department has any vacancies
            if ($department->vacancies()->count() > 0) {
                return redirect()->back()->withErrors(['error' => 'Cannot delete department with existing vacancies']);
            }

            $department->delete();

            return redirect()->route('admin.management.department-stage')->with('success', 'Department deleted successfully');
        } catch (\Exception $e) {
            Log::error('Error deleting department: ' . $e->getMessage());
            return redirect()->back()->withErrors(['error' => 'Error deleting department: ' . $e->getMessage()]);
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

            return redirect()->route('admin.management.department-stage')->with('success', 'Recruitment stage created successfully');
        } catch (\Illuminate\Validation\ValidationException $e) {
            return redirect()->back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            Log::error('Error creating recruitment stage: ' . $e->getMessage());
            return redirect()->back()->withErrors(['error' => 'Error creating recruitment stage: ' . $e->getMessage()])->withInput();
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

            return redirect()->route('admin.management.department-stage')->with('success', 'Recruitment stage updated successfully');
        } catch (\Illuminate\Validation\ValidationException $e) {
            return redirect()->back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            Log::error('Error updating recruitment stage: ' . $e->getMessage());
            return redirect()->back()->withErrors(['error' => 'Error updating recruitment stage: ' . $e->getMessage()])->withInput();
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
                return redirect()->back()->withErrors(['error' => 'Cannot delete status that is currently in use']);
            }

            $stage->delete();

            return redirect()->route('admin.management.department-stage')->with('success', 'Recruitment stage deleted successfully');
        } catch (\Exception $e) {
            Log::error('Error deleting recruitment stage: ' . $e->getMessage());
            return redirect()->back()->withErrors(['error' => 'Error deleting recruitment stage: ' . $e->getMessage()]);
        }
    }

    /**
     * Update recruitment stage order.
     * Note: Order functionality has been removed in new structure.
     */
    public function updateStageOrder(Request $request)
    {
        return redirect()->back()->withErrors(['error' => 'Stage ordering is no longer supported in the current system structure']);
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

            return redirect()->route('admin.management.department-stage')->with('success', 'Education level created successfully');
        } catch (\Illuminate\Validation\ValidationException $e) {
            return redirect()->back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            Log::error('Error creating education level: ' . $e->getMessage());
            return redirect()->back()->withErrors(['error' => 'Error creating education level: ' . $e->getMessage()])->withInput();
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

            return redirect()->route('admin.management.department-stage')->with('success', 'Education level updated successfully');
        } catch (\Illuminate\Validation\ValidationException $e) {
            return redirect()->back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            Log::error('Error updating education level: ' . $e->getMessage());
            return redirect()->back()->withErrors(['error' => 'Error updating education level: ' . $e->getMessage()])->withInput();
        }
    }

    /**
     * Delete an education level.
     */
    public function destroyEducationLevel($id)
    {
        try {
            Log::info('Attempting to delete education level with ID: ' . $id);
            
            $educationLevel = EducationLevel::findOrFail($id);
            Log::info('Found education level: ' . $educationLevel->name);
            
            // Check if education level is being used in vacancies
            $vacanciesCount = $educationLevel->vacancies()->count();
            Log::info('Vacancies count for education level: ' . $vacanciesCount);
            
            if ($vacanciesCount > 0) {
                Log::warning('Cannot delete education level - has ' . $vacanciesCount . ' vacancies');
                return redirect()->back()->withErrors(['error' => 'Cannot delete education level that is currently used in vacancies']);
            }

            $educationLevel->delete();
            Log::info('Education level deleted successfully');

            return redirect()->route('admin.management.department-stage')->with('success', 'Education level deleted successfully');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            Log::error('Education level not found with ID: ' . $id);
            return redirect()->back()->withErrors(['error' => 'Education level not found']);
        } catch (\Exception $e) {
            Log::error('Error deleting education level: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            return redirect()->back()->withErrors(['error' => 'Error deleting education level: ' . $e->getMessage()]);
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

            return redirect()->route('admin.management.department-stage')->with('success', 'Major created successfully');
        } catch (\Illuminate\Validation\ValidationException $e) {
            return redirect()->back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            Log::error('Error creating major: ' . $e->getMessage());
            return redirect()->back()->withErrors(['error' => 'Error creating major: ' . $e->getMessage()])->withInput();
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

            return redirect()->route('admin.management.department-stage')->with('success', 'Major updated successfully');
        } catch (\Illuminate\Validation\ValidationException $e) {
            return redirect()->back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            Log::error('Error updating major: ' . $e->getMessage());
            return redirect()->back()->withErrors(['error' => 'Error updating major: ' . $e->getMessage()])->withInput();
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
                return redirect()->back()->withErrors(['error' => 'Cannot delete major that is being used by candidates']);
            }

            $major->delete();

            return redirect()->route('admin.management.department-stage')->with('success', 'Major deleted successfully');
        } catch (\Exception $e) {
            Log::error('Error deleting major: ' . $e->getMessage());
            return redirect()->back()->withErrors(['error' => 'Error deleting major: ' . $e->getMessage()]);
        }
    }
} 