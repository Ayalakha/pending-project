<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class BlogController extends Controller
{
    /**
     * Display all blogs
     */
    public function index()
    {
        $blogs = Blog::with(['author:id,first_name,last_name'])
            ->withCount(['comments' => function ($query) {
                $query->where('status', 'approved');
            }])
            ->where('status', 'approved')
            ->orderBy('created_at', 'desc')
            ->paginate(12);

        return response()->json([
            'status' => 'success',
            'blogs' => $blogs
        ]);
    }

    /**
     * Search blogs by title or content
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

        $blogs = Blog::with(['author:id,first_name,last_name'])
            ->withCount(['comments' => function ($q) {
                $q->where('status', 'approved');
            }])
            ->where('status', 'approved')
            ->where(function ($q) use ($query) {
                $q->where('title', 'LIKE', "%{$query}%")
                  ->orWhere('content', 'LIKE', "%{$query}%");
            })
            ->orderBy('created_at', 'desc')
            ->paginate(12);

        return response()->json([
            'status' => 'success',
            'blogs' => $blogs
        ]);
    }

    /**
     * Store a new blog (superAdmin only)
     */
    public function store(Request $request)
    {
        // Only superAdmins can create blogs
        if (!$request->user()->isSuperAdmin()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized. Only superAdmins can create blogs'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'image' => 'nullable|string|max:255',
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
            'image' => $request->input('image'),
            'user_id' => $request->user()->id,
        ]);

        $blog->load('author:id,first_name,last_name');

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
        // Only show approved blogs to non-admin users
        if ($blog->status !== 'approved' && (!Auth::check() || Auth::user()->role !== 'superAdmin')) {
            return response()->json([
                'status' => 'error',
                'message' => 'Blog not found'
            ], 404);
        }

        $blog->load('author:id,first_name,last_name');

        return response()->json([
            'status' => 'success',
            'blog' => $blog
        ]);
    }

    /**
     * Update a specific blog (superAdmin only)
     */
    public function update(Request $request, Blog $blog)
    {
        // Only superAdmins can update blogs
        if (!$request->user()->isSuperAdmin()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized. Only superAdmins can update blogs'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'image' => 'nullable|string|max:255',
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
            'image' => $request->input('image'),
        ]);

        $blog->load('author:id,first_name,last_name');

        return response()->json([
            'status' => 'success',
            'message' => 'Blog updated successfully',
            'blog' => $blog
        ]);
    }

    /**
     * Remove a specific blog (superAdmin only)
     */
    public function destroy(Request $request, Blog $blog)
    {
        // Only superAdmins can delete blogs
        if (!$request->user()->isSuperAdmin()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized. Only superAdmins can delete blogs'
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
