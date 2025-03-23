<?php

namespace App\Http\Controllers\Settings;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Show the user's profile settings page.
     */
    public function edit(Request $request): Response
    {
        $authUser = Auth::user();
        // Log::info('Auth ID:', ['id' => Auth::id()]);
        // Log::info('Database role:', ['role' => $authUser->role]);
        // Log::info('Enum HR value:', ['value' => UserRole::HR->value]);

        // Log::info($authUser);
        // return Inertia::render('admin/settings/profile', [
        //     'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
        //     'status'          => $request->session()->get('status'),
        // ]);
        if ($authUser->role->value == UserRole::HR->value) {
            return Inertia::render('admin/settings/profile', [
                'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
                'status' => $request->session()->get('status'),
            ]);
        } else {
            return Inertia::render('candidate/settings/password', [
                'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
                'status' => $request->session()->get('status'),
            ]);
        }

        // return Inertia::render('admin/settings/profile', [
        //     'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
        //     'status' => $request->session()->get('status'),
        // ]);
    }

    /**
     * Update the user's profile settings.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return to_route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
