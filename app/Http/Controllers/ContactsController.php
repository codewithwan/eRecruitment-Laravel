<?php

namespace App\Http\Controllers;

use App\Models\Contacts;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ContactsController extends Controller
{
    // Tampilkan halaman kontak dengan data dari database
    public function index()
    {
        $contacts = Contacts::all();
        return Inertia::render('landing-page/contact', [
            'contacts' => $contacts,
        ]);
    }

    // Simpan data kontak baru
    public function store(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email|unique:contacts,email',
            'phone' => 'nullable|string',
            'address' => 'nullable|string',
        ]);

        $contact = Contacts::create($validated);

        return redirect()->back()->with('success', 'Kontak berhasil ditambahkan!');
    }
}
