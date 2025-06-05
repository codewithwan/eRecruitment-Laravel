<?php
namespace App\Http\Controllers\Auth;

    use App\Enums\UserRole;
    use App\Http\Controllers\Controller;
    use App\Models\User;
    use Illuminate\Auth\Events\Registered;
    use Illuminate\Http\RedirectResponse;
    use Illuminate\Http\Request;
    use Illuminate\Support\Facades\Auth;
    use Illuminate\Support\Facades\Hash;
    use Illuminate\Validation\Rules\Password;
    use Inertia\Inertia;
    use Inertia\Response;
    use App\Http\Requests\Auth\RegisterRequest;

    class RegisteredUserController extends Controller
    {
        /**
         * Show the registration page.
         */
        public function create(): Response
        {
            return Inertia::render('auth/register');
        }

        /**
         * Handle an incoming registration request.
         *
         * @throws \Illuminate\Validation\ValidationException
         */
        public function store(RegisterRequest $request): RedirectResponse
        {
            $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
                'password' => ['required', 'confirmed', Password::defaults()],
            ]);

            $user = User::create([
                'no_ektp' => $request->no_ektp,
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => UserRole::CANDIDATE->value,
            ]);

            event(new Registered($user));

            Auth::login($user);

            return redirect()->route('verification.notice');
        }
    }
