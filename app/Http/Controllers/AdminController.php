<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminController extends Controller
{
    /**
     * Display the administration page.
     */
    public function administration()
    {
        return Inertia::render('admin/company/administration');
    }
}