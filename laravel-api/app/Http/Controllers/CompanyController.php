<?php

namespace App\Http\Controllers;

use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class CompanyController extends Controller
{
    /**
     * Display a listing of all companies (Public route)
     */
    public function index(Request $request)
    {
        $query = Company::with(['owner', 'servicesOrProducts', 'approvedReviews'])
            ->where('status', 'active') // Only show active companies
            ->withCount('approvedReviews as total_reviews')
            ->withAvg('approvedReviews as average_rating', 'rating')
            ->orderBy('created_at', 'desc');

        // Add search functionality
        if ($request->has('search') && !empty($request->search)) {
            $searchTerm = $request->search;
            $query->where(function ($q) use ($searchTerm) {
                $q->where('name', 'LIKE', "%{$searchTerm}%")
                  ->orWhere('description', 'LIKE', "%{$searchTerm}%");
            });
        }

        // Filter by category/activity sector. Category labels shown to users can be
        // compound (e.g. "Technology & IT"), so also match on their significant words
        // to still catch companies whose sector is just "Technology".
        if ($request->has('category') && !empty($request->category)) {
            $category = $request->category;
            $words = array_filter(preg_split('/[\s&]+/', $category), fn ($w) => strlen($w) > 2);

            $query->where(function ($q) use ($category, $words) {
                $q->where('activity_sector', 'LIKE', "%{$category}%");
                foreach ($words as $word) {
                    $q->orWhere('activity_sector', 'LIKE', "%{$word}%");
                }
            });
        }

        $companies = $query->paginate(20);

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
            'logo' => 'nullable|image|mimes:jpeg,jpg,png,webp|max:2048',
            'website' => 'nullable|url|max:255',
            'phone_number' => 'nullable|string|max:50',
            'capital' => 'nullable|string|max:100',
            'rc' => 'nullable|string|max:100',
            'legal_form' => 'nullable|string|max:100',
            'city' => 'nullable|string|max:255',
            'region' => 'nullable|string|max:255',
            'ice' => 'nullable|string|max:50',
            'cnss' => 'nullable|string|max:50',
            'patent_number' => 'nullable|string|max:100',
            'activity_sector' => 'nullable|string|max:255',
            'incorporation_date' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        $logoPath = $request->hasFile('logo')
            ? $request->file('logo')->store('company-logos', 'public')
            : null;

        $company = Company::create([
            'name' => $request->name,
            'description' => $request->description,
            'logo' => $logoPath ? Storage::disk('public')->url($logoPath) : null,
            'website' => $request->website,
            'phone_number' => $request->phone_number,
            'capital' => $request->capital,
            'rc' => $request->rc,
            'legal_form' => $request->legal_form,
            'city' => $request->city,
            'region' => $request->region,
            'ice' => $request->ice,
            'cnss' => $request->cnss,
            'patent_number' => $request->patent_number,
            'activity_sector' => $request->activity_sector,
            'incorporation_date' => $request->incorporation_date,
            'owner_id' => $request->user()->id,
            'status' => 'pending', // New companies require approval
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
        // Allow owners and admins to view their companies regardless of status
        $user = auth('sanctum')->user();
        $canViewAnyStatus = $user && ($company->isOwnedBy($user) || $user->isSuperAdmin());
        
        // Only allow viewing active companies for public access
        if (!$canViewAnyStatus && $company->status !== 'active') {
            return response()->json([
                'status' => 'error',
                'message' => 'Company not found or not available'
            ], 404);
        }

        $company->load(['owner', 'servicesOrProducts', 'approvedReviews']);
        $company->loadCount('approvedReviews as total_reviews');
        $company->loadAvg('approvedReviews as average_rating', 'rating');

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
            'logo' => 'nullable|image|mimes:jpeg,jpg,png,webp|max:2048',
            'remove_logo' => 'nullable|boolean',
            'website' => 'nullable|url|max:255',
            'phone_number' => 'nullable|string|max:50',
            'capital' => 'nullable|string|max:100',
            'rc' => 'nullable|string|max:100',
            'legal_form' => 'nullable|string|max:100',
            'city' => 'nullable|string|max:255',
            'region' => 'nullable|string|max:255',
            'ice' => 'nullable|string|max:50',
            'cnss' => 'nullable|string|max:50',
            'patent_number' => 'nullable|string|max:100',
            'activity_sector' => 'nullable|string|max:255',
            'incorporation_date' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        $logo = $company->logo;
        if ($request->hasFile('logo')) {
            Company::deleteStoredLogo($company->logo);
            $logo = Storage::disk('public')->url($request->file('logo')->store('company-logos', 'public'));
        } elseif ($request->boolean('remove_logo')) {
            Company::deleteStoredLogo($company->logo);
            $logo = null;
        }

        $company->update([
            'name' => $request->name,
            'description' => $request->description,
            'logo' => $logo,
            'website' => $request->website,
            'phone_number' => $request->phone_number,
            'capital' => $request->capital,
            'rc' => $request->rc,
            'legal_form' => $request->legal_form,
            'city' => $request->city,
            'region' => $request->region,
            'ice' => $request->ice,
            'cnss' => $request->cnss,
            'patent_number' => $request->patent_number,
            'activity_sector' => $request->activity_sector,
            'incorporation_date' => $request->incorporation_date,
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
        Company::deleteStoredLogo($company->logo);
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
