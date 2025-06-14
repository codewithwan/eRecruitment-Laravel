<?php

namespace App\Http\Controllers;

use App\Enums\CandidatesStage;
use App\Enums\UserRole;
use App\Models\Applications;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        $users = User::where('role', UserRole::CANDIDATE)->get();
        $traffic = $users->groupBy(function ($user) {
            return $user->created_at->format('Y-m-d');
        })->map(function ($users) {
            return $users->count();
        });

        $job_applications = Applications::where('status_id', 1)->get(); // Using status_id 1 which is typically 'Pending'
        $job_applied = $job_applications->groupBy(function ($job_applications) {
            return $job_applications->created_at->format('Y-m-d');
        })->map(function ($job_applications) {
            return $job_applications->count();
        });

       return Inertia::render('candidate/profile', [
        'users' => $users,
        'traffic' => $traffic,
        'job_applied' => $job_applied
    ]);
    }

    public function store(Request $request)
    {
        // Get pagination parameters from URL
        $perPage = $request->input('per_page', 10);
        $page = $request->input('page', 1);

        $usersQuery = User::where('role', UserRole::CANDIDATE);
        $totalUsers = $usersQuery->count();

        // Apply pagination
        $users = $usersQuery->orderBy('id', 'desc')
            ->skip(($page - 1) * $perPage)
            ->take($perPage)
            ->get();

        return Inertia::render('admin/users/user-management', [
            'users' => $users,
            'pagination' => [
                'total' => $totalUsers,
                'per_page' => (int) $perPage,
                'current_page' => (int) $page,
                'last_page' => ceil($totalUsers / $perPage),
            ],
        ]);
    }

    public function getUsers(Request $request)
    {
        $perPage = $request->input('per_page', 10);
        $page = $request->input('page', 1);

        $usersQuery = User::where('role', UserRole::CANDIDATE);
        $totalUsers = $usersQuery->count();

        $users = $usersQuery->orderBy('id', 'desc')
            ->skip(($page - 1) * $perPage)
            ->take($perPage)
            ->get();

        // Make sure returned values are integers
        return response()->json([
            'users' => $users,
            'pagination' => [
                'total' => $totalUsers,
                'per_page' => (int) $perPage,
                'current_page' => (int) $page,
                'last_page' => ceil($totalUsers / $perPage),
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

        return response()->json(['message' => 'User created successfully', 'user' => $user]);
    }

    public function update(Request $request, $id)
    {
        $user = User::find($id);

        if (! $user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,'.$id,
            'role' => 'required|string|in:candidate,hr,head_hr,head_dev,super_admin',
        ]);

        $user->update($validatedData);

        return response()->json([
            'message' => 'User updated successfully',
            'user' => $user,
        ]);
    }

    public function destroy($id)
    {
        $user = User::find($id);
        if ($user) {
            $user->delete();
        }

        return response()->json(['message' => 'User deleted successfully']);
    }
}
