<?php

namespace App\Http\Controllers;

use App\Enums\ApplicationStatus;
use App\Enums\UserRole;
use App\Models\Application;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    public function index()
    {
        // Get total candidates (users who have applied)
        $totalCandidates = User::whereHas('applications')->count();

        // Get applications per company
        $companyStats = Application::join('vacancy_periods', 'applications.vacancy_period_id', '=', 'vacancy_periods.id')
            ->join('vacancies', 'vacancy_periods.vacancy_id', '=', 'vacancies.id')
            ->join('companies', 'vacancies.company_id', '=', 'companies.id')
            ->select('companies.name', DB::raw('count(*) as applications'))
            ->groupBy('companies.id', 'companies.name')
            ->get()
            ->map(fn($company) => [
                'name' => $company->name,
                'applications' => $company->applications
            ])
            ->toArray();

        // Get total applications
        $totalApplications = Application::count();

        // Get applications by stage
        $stageStats = Application::join('application_history', 'applications.id', '=', 'application_history.application_id')
            ->join('statuses', 'application_history.status_id', '=', 'statuses.id')
            ->where('application_history.is_active', true)
            ->select('statuses.stage', DB::raw('count(*) as count'))
            ->groupBy('statuses.stage')
            ->get()
            ->mapWithKeys(fn($stat) => [$stat->stage => $stat->count]);

        // Get weekly application data
        $weeklyData = Application::join('application_history', 'applications.id', '=', 'application_history.application_id')
            ->join('statuses', 'application_history.status_id', '=', 'statuses.id')
            ->where('application_history.is_active', true)
            ->where('applications.created_at', '>=', now()->subDays(7))
            ->select(
                DB::raw('DATE(applications.created_at) as date'),
                'statuses.stage',
                DB::raw('count(*) as count')
            )
            ->groupBy('date', 'statuses.stage')
            ->get()
            ->groupBy('date')
            ->map(function($dayStats) {
                return [
                    'day' => now()->parse($dayStats->first()->date)->format('D'),
                    'admin' => $dayStats->firstWhere('stage', 'administrative_selection')?->count ?? 0,
                    'assessment' => $dayStats->firstWhere('stage', 'psychological_test')?->count ?? 0,
                    'interview' => $dayStats->firstWhere('stage', 'interview')?->count ?? 0,
                ];
            })
            ->values()
            ->toArray();

        // Get top positions by applications
        $topPositions = Application::join('vacancy_periods', 'applications.vacancy_period_id', '=', 'vacancy_periods.id')
            ->join('vacancies', 'vacancy_periods.vacancy_id', '=', 'vacancies.id')
            ->join('companies', 'vacancies.company_id', '=', 'companies.id')
            ->select(
                'vacancies.title',
                'companies.name as subsidiary',
                DB::raw('count(*) as applications')
            )
            ->groupBy('vacancies.id', 'vacancies.title', 'companies.name')
            ->orderByDesc('applications')
            ->limit(5)
            ->get()
            ->map(fn($position) => [
                'title' => $position->title,
                'applications' => $position->applications,
                'subsidiary' => $position->subsidiary
            ])
            ->toArray();

        // Get recent activities
        $recentActivities = Application::join('application_history', 'applications.id', '=', 'application_history.application_id')
            ->join('statuses', 'application_history.status_id', '=', 'statuses.id')
            ->join('users', 'applications.user_id', '=', 'users.id')
            ->join('vacancy_periods', 'applications.vacancy_period_id', '=', 'vacancy_periods.id')
            ->join('vacancies', 'vacancy_periods.vacancy_id', '=', 'vacancies.id')
            ->where('application_history.is_active', true)
            ->select(
                'application_history.id',
                'statuses.stage',
                'statuses.code',
                'users.name as user_name',
                'vacancies.title',
                'application_history.created_at'
            )
            ->latest('application_history.created_at')
            ->limit(5)
            ->get()
            ->map(function($activity) {
                $type = match($activity->stage) {
                    'administrative_selection' => 'admin',
                    'psychological_test' => 'assessment',
                    'interview' => 'interview',
                    default => 'other'
                };

                $status = match($activity->code) {
                    'pending' => 'new',
                    'scheduled' => 'scheduled',
                    'completed', 'passed' => 'completed',
                    'approved' => 'approved',
                    default => 'other'
                };

                $message = match($type) {
                    'admin' => "New application submitted for {$activity->title}",
                    'assessment' => "Assessment {$activity->code} by {$activity->user_name}",
                    'interview' => "Interview {$activity->code} for {$activity->user_name}",
                    default => "Status updated for {$activity->user_name}"
                };

                return [
                    'id' => $activity->id,
                    'type' => $type,
                    'message' => $message,
                    'time' => $activity->created_at->diffForHumans(),
                    'status' => $status
                ];
            })
            ->toArray();

        // Get pending actions count
        $pendingActions = Application::join('application_history', 'applications.id', '=', 'application_history.application_id')
            ->join('statuses', 'application_history.status_id', '=', 'statuses.id')
            ->where('application_history.is_active', true)
            ->where('statuses.code', 'pending')
            ->count();

        // Prepare recruitment stage data for pie chart
        $recruitmentStageData = [
            [
                'name' => 'Administration',
                'value' => $stageStats['administrative_selection'] ?? 0,
                'color' => '#3B82F6'
            ],
            [
                'name' => 'Assessment',
                'value' => $stageStats['psychological_test'] ?? 0,
                'color' => '#1D4ED8'
            ],
            [
                'name' => 'Interview',
                'value' => $stageStats['interview'] ?? 0,
                'color' => '#1E3A8A'
            ]
        ];

        return Inertia::render('admin/dashboard', [
            'dashboardStats' => [
                'totalCandidates' => $totalCandidates,
                'companyStats' => $companyStats,
                'totalApplications' => $totalApplications,
                'adminReview' => $stageStats['administrative_selection'] ?? 0,
                'assessmentStage' => $stageStats['psychological_test'] ?? 0,
                'interviewStage' => $stageStats['interview'] ?? 0,
                'pendingActions' => $pendingActions
            ],
            'recruitmentStageData' => $recruitmentStageData,
            'weeklyData' => $weeklyData,
            'recentActivities' => $recentActivities,
            'topPositions' => $topPositions
        ]);
    }

    public function store(Request $request)
    {
        // Get pagination parameters from URL
        $perPage = $request->input('per_page', 10);
        $page = $request->input('page', 1);

        // Get all users, not just candidates
        $usersQuery = User::query();
        $totalUsers = $usersQuery->count();

        // Apply pagination using Laravel's paginate method for better handling
        $users = $usersQuery->orderBy('id', 'desc')
            ->paginate($perPage, ['*'], 'page', $page)
            ->withQueryString();

        return Inertia::render('admin/users/user-management', [
            'users' => $users->items(),
            'pagination' => [
                'total' => $users->total(),
                'per_page' => $users->perPage(),
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
            ],
        ]);
    }

    public function getUsers(Request $request)
    {
        $perPage = $request->input('per_page', 10);
        $page = $request->input('page', 1);

        // Get all users, not just candidates
        $usersQuery = User::query();
        $totalUsers = $usersQuery->count();

        // Apply pagination using Laravel's paginate method for better handling
        $users = $usersQuery->orderBy('id', 'desc')
            ->paginate($perPage, ['*'], 'page', $page)
            ->withQueryString();

        // Return Inertia response instead of JSON
        return Inertia::render('admin/users/user-management', [
            'users' => $users->items(),
            'pagination' => [
                'total' => $users->total(),
                'per_page' => $users->perPage(),
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
            ],
        ]);
    }

    public function create(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|string|in:candidate,hr,head_hr,head_dev,super_admin',
        ]);

        $user = User::create(array_merge(
            $validatedData,
            ['password' => Hash::make($validatedData['password'])]
        ));

        return redirect()->route('admin.users.info')->with('success', 'User created successfully');
    }

    public function update(Request $request, $id)
    {
        $user = User::find($id);

        if (! $user) {
            return redirect()->route('admin.users.info')->withErrors(['error' => 'User not found']);
        }

        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,'.$id,
            'role' => 'required|string|in:candidate,hr,head_hr,head_dev,super_admin',
        ]);

        $user->update($validatedData);

        return redirect()->route('admin.users.info')->with('success', 'User updated successfully');
    }

    public function destroy($id)
    {
        $user = User::find($id);
        if ($user) {
            $user->delete();
        }

        return redirect()->route('admin.users.info')->with('success', 'User deleted successfully');
    }
}
