<?php

namespace App\Http\Controllers;

use App\Models\AboutUs;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AboutUsController extends Controller
{
    public function index()
    {
        // Ambil semua data about_us beserta relasi company
        $aboutUs = AboutUs::with('companies')->get();

        return Inertia::render('landing-page/about-us', [
            'aboutUs' => $aboutUs,
        ]);
    }
}
