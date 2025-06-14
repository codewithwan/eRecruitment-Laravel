<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Company;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CompanyManagementController extends Controller
{
    public function index()
    {
        $companies = Company::all();
        
        return Inertia::render('admin/company-management/index', [
            'companies' => $companies
        ]);
    }

    // Hanya keep destroy method, create dan edit menggunakan CompaniesController
    public function destroy(Company $company)
    {
        $company->delete();

        return redirect()->route('company-management.index')
            ->with('success', 'Company deleted successfully.');
    }
}