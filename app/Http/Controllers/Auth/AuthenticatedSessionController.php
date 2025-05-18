<?php

namespace App\Http\Controllers\Auth;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Show the login page.
     */
    public function create(Request $request): Response
    {
        return Inertia::render('auth/login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        // Check rate limiting
        if (RateLimiter::tooManyAttempts('login', 5)) {
            return back()->withErrors([
                'email' => 'Too many login attempts. Please try again later.',
            ])->withInput($request->except('password'));
        }
        
        $request->authenticate();

        // Reset rate limiter after successful login
        RateLimiter::clear('login');
        
        $request->session()->regenerate();

        // Redirect berdasarkan role user
        $user = Auth::user();
        
        // Jika email belum terverifikasi, arahkan ke halaman verifikasi
        if (!$user->hasVerifiedEmail()) {
            return redirect('/email/verify');
        }

        // Jika email sudah terverifikasi
        if ($user->role === UserRole::CANDIDATE->value) {
            return redirect()->intended('/candidate/profile');
        }

        return redirect()->intended(route('admin.dashboard'));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
