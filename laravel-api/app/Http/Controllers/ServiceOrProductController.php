<?php

namespace App\Http\Controllers;

use App\Models\ServiceOrProduct;
use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ServiceOrProductController extends Controller
{
    /**
     * Display services/products for a specific company
     */
    public function index(Company $company)
    {
        $items = $company->servicesOrProducts()
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'status' => 'success',
            'items' => $items
        ]);
    }

    /**
     * Store a new service/product for a company
     */
    public function store(Request $request, Company $company)
    {
        // Check if user owns the company or is admin
        if (!$company->isOwnedBy($request->user()) && !$request->user()->isSuperAdmin()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized to add items to this company'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'price' => 'required|numeric|min:0|max:999999.99',
            'type' => 'required|in:service,product',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        $item = ServiceOrProduct::create([
            'name' => $request->name,
            'description' => $request->description,
            'price' => $request->price,
            'type' => $request->type,
            'company_id' => $company->id,
        ]);

        $item->load('company');

        return response()->json([
            'status' => 'success',
            'message' => ucfirst($item->type) . ' created successfully',
            'item' => $item
        ], 201);
    }

    /**
     * Display a specific service/product
     */
    public function show(ServiceOrProduct $serviceOrProduct)
    {
        $serviceOrProduct->load('company.owner');

        return response()->json([
            'status' => 'success',
            'item' => $serviceOrProduct
        ]);
    }

    /**
     * Update a specific service/product
     */
    public function update(Request $request, ServiceOrProduct $serviceOrProduct)
    {
        // Check if user owns the company or is admin
        if (!$serviceOrProduct->company->isOwnedBy($request->user()) && !$request->user()->isSuperAdmin()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized to update this item'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'price' => 'required|numeric|min:0|max:999999.99',
            'type' => 'required|in:service,product',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        $serviceOrProduct->update([
            'name' => $request->name,
            'description' => $request->description,
            'price' => $request->price,
            'type' => $request->type,
        ]);

        $serviceOrProduct->load('company');

        return response()->json([
            'status' => 'success',
            'message' => ucfirst($serviceOrProduct->type) . ' updated successfully',
            'item' => $serviceOrProduct
        ]);
    }

    /**
     * Remove a specific service/product
     */
    public function destroy(Request $request, ServiceOrProduct $serviceOrProduct)
    {
        // Check if user owns the company or is admin
        if (!$serviceOrProduct->company->isOwnedBy($request->user()) && !$request->user()->isSuperAdmin()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized to delete this item'
            ], 403);
        }

        $itemName = $serviceOrProduct->name;
        $itemType = $serviceOrProduct->type;
        $serviceOrProduct->delete();

        return response()->json([
            'status' => 'success',
            'message' => ucfirst($itemType) . " '{$itemName}' deleted successfully"
        ]);
    }
}
