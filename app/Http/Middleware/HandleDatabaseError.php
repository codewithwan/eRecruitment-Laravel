<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HandleDatabaseError
{
    public function handle(Request $request, Closure $next)
    {
        try {
            return $next($request);
        } catch (QueryException $e) {
            // Match different database connection error messages
            if (str_contains($e->getMessage(), 'SQLSTATE[HY000] [2002]') ||
                str_contains($e->getMessage(), 'target machine actively refused it') ||
                str_contains($e->getMessage(), 'Connection refused') ||
                str_contains($e->getMessage(), 'No connection could be made')) {

                return Inertia::render('errors/500', [
                    'error' => 'Database connection error',
                    'message' => 'Unable to connect to database server',
                ]);
            }
            throw $e;
        }
    }
}
