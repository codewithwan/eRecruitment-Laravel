<?php
namespace App\Http\Controllers;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index()
    {
        $users = User::all();
        $traffic = $users->groupBy(function($user) {
            return $user->created_at->format('Y-m-d');
        })->map(function($users) {
            return $users->count();
        });

        return Inertia::render('admin/dashboard', ['users' => $users, 'traffic' => $traffic]);
    }

    public function store()
    {
        $users = User::where('role', UserRole::CANDIDATE)->get();
        return Inertia::render('admin/users/user-management', ['users' => $users]);
    }

    public function create(Request $request)
    {
        $validatedData = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role'     => 'required|string|in:candidate,hr,head_hr,head_dev,super_admin',
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
        
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $validatedData = $request->validate([
            'name'  => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $id,
            'role'  => 'required|string|in:candidate,hr,head_hr,head_dev,super_admin',
        ]);

        $user->update($validatedData);

        return response()->json([
            'message' => 'User updated successfully',
            'user' => $user
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
