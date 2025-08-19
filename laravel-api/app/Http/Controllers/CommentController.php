<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Blog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CommentController extends Controller
{
    /**
     * Get all comments for a specific blog
     */
    public function index(Blog $blog)
    {
        $comments = $blog->comments()
            ->with('user:id,username')
            ->where('status', 'approved')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'status' => 'success',
            'comments' => $comments
        ]);
    }

    /**
     * Store a new comment on a blog
     */
    public function store(Request $request, Blog $blog)
    {
        $validator = Validator::make($request->all(), [
            'content' => 'required|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        $comment = Comment::create([
            'content' => $request->input('content'),
            'blog_id' => $blog->id,
            'user_id' => $request->user()->id,
        ]);

        $comment->load('user:id,name');

        return response()->json([
            'status' => 'success',
            'message' => 'Comment added successfully',
            'comment' => $comment
        ], 201);
    }

    /**
     * Update a specific comment
     */
    public function update(Request $request, Comment $comment)
    {
        // Check if user owns the comment or is admin
        if ($comment->user_id !== $request->user()->id && !$request->user()->isSuperAdmin()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized to update this comment'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'content' => 'required|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        $comment->update([
            'content' => $request->input('content'),
        ]);

        $comment->load('user:id,name');

        return response()->json([
            'status' => 'success',
            'message' => 'Comment updated successfully',
            'comment' => $comment
        ]);
    }

    /**
     * Remove a specific comment
     */
    public function destroy(Request $request, Comment $comment)
    {
        // Check if user owns the comment or is admin
        if ($comment->user_id !== $request->user()->id && !$request->user()->isSuperAdmin()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized to delete this comment'
            ], 403);
        }

        $comment->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Comment deleted successfully'
        ]);
    }
}
