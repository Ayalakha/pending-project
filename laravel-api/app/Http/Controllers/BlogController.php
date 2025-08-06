<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class BlogController extends Controller
{
    /**
     * Display blogs for a specific company
     */
    public function index(Company $company)
    {
        $blogs = $company->blogs()
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'status' => 'success',
            'blogs' => $blogs
        ]);
    }

    /**
     * Store a new blog for a company
     */
    public function store(Request $request, Company $company)
    {
        // Check if user owns the company or is admin
        if (!$company->isOwnedBy($request->user()) && !$request->user()->isSuperAdmin()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized to create blogs for this company'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        $blog = Blog::create([
            'title' => $request->input('title'),
            'content' => $request->input('content'),
            'company_id' => $company->id,
        ]);

        $blog->load('company');

        return response()->json([
            'status' => 'success',
            'message' => 'Blog created successfully',
            'blog' => $blog
        ], 201);
    }

    /**
     * Display a specific blog
     */
    public function show(Blog $blog)
    {
        $blog->load('company.owner', 'comments.user');

        return response()->json([
            'status' => 'success',
            'blog' => $blog
        ]);
    }

    /**
     * Update a specific blog
     */
    public function update(Request $request, Blog $blog)
    {
        // Check if user owns the company or is admin
        if (!$blog->company->isOwnedBy($request->user()) && !$request->user()->isSuperAdmin()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized to update this blog'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        $blog->update([
            'title' => $request->input('title'),
            'content' => $request->input('content'),
        ]);

        $blog->load('company');

        return response()->json([
            'status' => 'success',
            'message' => 'Blog updated successfully',
            'blog' => $blog
        ]);
    }

    /**
     * Remove a specific blog
     */
    public function destroy(Request $request, Blog $blog)
    {
        // Check if user owns the company or is admin
        if (!$blog->company->isOwnedBy($request->user()) && !$request->user()->isSuperAdmin()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized to delete this blog'
            ], 403);
        }

        $blogTitle = $blog->title;
        $blog->delete();

        return response()->json([
            'status' => 'success',
            'message' => "Blog '{$blogTitle}' deleted successfully"
        ]);
    }
}
