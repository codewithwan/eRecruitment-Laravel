<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

use function PHPUnit\Framework\returnSelf;

class QuestionController extends Controller
{
    public function store()
    {
        return Inertia::render('admin/questions/question-management');
    }

    public function create(Request $request)
    {
        return Inertia::render('admin/questions/add-questions');
    }
}
