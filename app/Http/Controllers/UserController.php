<?php
namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        $users = User::where('role', 'user')->select('id', 'name', 'email', 'role', 'created_at')->get();

        return Inertia::render('dashboard', ['users' => $users]);
    }

    public function userManagement()
    {
        $users = User::where('role', 'user')->select('id', 'name', 'email', 'role', 'created_at')->get();

        return Inertia::render('user/user-management', ['users' => $users]);
    }
}
