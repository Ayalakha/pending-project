<?php

namespace App\Http\Controllers;

use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CompanyController extends Controller
{
    /**
     * Display a listing of all companies (Public route)
     */
    public function index(Request $request)
    {
        $query = Company::with('owner', 'servicesOrProducts')
            ->orderBy('created_at', 'desc');

        // Add search functionality
        if ($request->has('search') && !empty($request->search)) {
            $searchTerm = $request->search;
            $query->where(function ($q) use ($searchTerm) {
                $q->where('name', 'LIKE', "%{$searchTerm}%")
                  ->orWhere('description', 'LIKE', "%{$searchTerm}%");
            });
        }

        $companies = $query->paginate(10);

        return response()->json([
            'status' => 'success',
            'companies' => $companies
        ]);
    }

    /**
     * Store a newly created company (Owner/Admin only)
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'logo' => 'nullable|string|max:255',
            'website' => 'nullable|url|max:255',
            'phone_number' => 'nullable|string|max:50',
            'capital' => 'nullable|string|max:100',
            'rc' => 'nullable|string|max:100',
            'legal_form' => 'nullable|string|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        $company = Company::create([
            'name' => $request->name,
            'description' => $request->description,
            'logo' => $request->logo,
            'website' => $request->website,
            'phone_number' => $request->phone_number,
            'capital' => $request->capital,
            'rc' => $request->rc,
            'legal_form' => $request->legal_form,
            'owner_id' => $request->user()->id,
        ]);

        // Load relationships for response
        $company->load('owner', 'servicesOrProducts');

        return response()->json([
            'status' => 'success',
            'message' => 'Company created successfully',
            'company' => $company
        ], 201);
    }

    /**
     * Display a specific company (Public route)
     */
    public function show(Company $company)
    {
        $company->load('owner', 'servicesOrProducts');

        return response()->json([
            'status' => 'success',
            'company' => $company
        ]);
    }

    /**
     * Update a specific company (Owner/Admin only)
     */
    public function update(Request $request, Company $company)
    {
        // Check if user owns the company or is admin
        if (!$company->isOwnedBy($request->user()) && !$request->user()->isSuperAdmin()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized to update this company'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'logo' => 'nullable|string|max:255',
            'website' => 'nullable|url|max:255',
            'phone_number' => 'nullable|string|max:50',
            'capital' => 'nullable|string|max:100',
            'rc' => 'nullable|string|max:100',
            'legal_form' => 'nullable|string|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        $company->update([
            'name' => $request->name,
            'description' => $request->description,
            'logo' => $request->logo,
            'website' => $request->website,
            'phone_number' => $request->phone_number,
            'capital' => $request->capital,
            'rc' => $request->rc,
            'legal_form' => $request->legal_form,
        ]);

        $company->load('owner', 'servicesOrProducts');

        return response()->json([
            'status' => 'success',
            'message' => 'Company updated successfully',
            'company' => $company
        ]);
    }

    /**
     * Remove a specific company (Owner/Admin only)
     */
    public function destroy(Request $request, Company $company)
    {
        // Check if user owns the company or is admin
        if (!$company->isOwnedBy($request->user()) && !$request->user()->isSuperAdmin()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized to delete this company'
            ], 403);
        }

        $companyName = $company->name;
        $company->delete();

        return response()->json([
            'status' => 'success',
            'message' => "Company '{$companyName}' deleted successfully"
        ]);
    }

    /**
     * Get companies owned by the authenticated user
     */
    public function userCompanies(Request $request)
    {
        $companies = $request->user()
            ->companies()
            ->with('servicesOrProducts')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'status' => 'success',
            'companies' => $companies
        ]);
    }

    /**
     * Search companies by name or description
     */
    public function search(Request $request)
    {
        $query = $request->get('q');
        
        if (!$query) {
            return response()->json([
                'status' => 'error',
                'message' => 'Search query is required'
            ], 400);
        }

        $companies = Company::with('owner', 'servicesOrProducts')
            ->where('name', 'LIKE', "%{$query}%")
            ->orWhere('description', 'LIKE', "%{$query}%")
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json([
            'status' => 'success',
            'companies' => $companies
        ]);
    }
}
