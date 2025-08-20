<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Blog;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class ContentModerationController extends Controller
{
    // Get all content for moderation
    public function index(Request $request): JsonResponse
    {
        $status = $request->query('status', 'all');
        $perPage = $request->query('per_page', 15);

        $blogsQuery = Blog::with(['author', 'moderatedBy'])
            ->when($status !== 'all', function ($query) use ($status) {
                return $query->where('status', $status);
            });
        
        $blogs = $blogsQuery->get()->map(function ($blog) {
            return [
                'id' => $blog->id,
                'type' => 'blog',
                'title' => $blog->title,
                'content' => substr($blog->content, 0, 200) . '...',
                'author' => $blog->author->name,
                'status' => $blog->status,
                'moderation_notes' => $blog->moderation_notes,
                'moderated_by' => $blog->moderatedBy?->name,
                'moderated_at' => $blog->moderated_at,
                'created_at' => $blog->created_at,
            ];
        });

        // Sort by created_at descending
        $content = $blogs->sortByDesc('created_at');

        // Manual pagination
        $page = $request->query('page', 1);
        $offset = ($page - 1) * $perPage;
        $items = $content->slice($offset, $perPage)->values();
        $total = $content->count();

        return response()->json([
            'data' => $items,
            'current_page' => (int) $page,
            'per_page' => (int) $perPage,
            'total' => $total,
            'last_page' => ceil($total / $perPage)
        ]);
    }

    // Moderate content (approve/reject)
    public function moderate(Request $request): JsonResponse
    {
        $request->validate([
            'content_type' => 'required|in:blog',
            'content_id' => 'required|integer',
            'action' => 'required|in:approve,reject',
            'notes' => 'nullable|string|max:1000'
        ]);

        $contentId = $request->content_id;
        $action = $request->action;
        $notes = $request->notes;

        $blog = Blog::find($contentId);

        if (!$blog) {
            return response()->json(['error' => 'Blog not found'], 404);
        }

        $status = $action === 'approve' ? 'approved' : 'rejected';

        $blog->update([
            'status' => $status,
            'moderation_notes' => $notes,
            'moderated_by' => Auth::id(),
            'moderated_at' => now()
        ]);

        return response()->json([
            'message' => 'Blog ' . $action . 'd successfully',
            'content' => $blog->fresh()
        ]);
    }

    // Get content details for detailed view
    public function show(string $type, int $id): JsonResponse
    {
        if ($type !== 'blog') {
            return response()->json(['error' => 'Invalid content type'], 400);
        }

        $blog = Blog::with(['author', 'moderatedBy'])->find($id);

        if (!$blog) {
            return response()->json(['error' => 'Blog not found'], 404);
        }

        return response()->json(['data' => $blog]);
    }

    // Get moderation statistics
    public function stats(): JsonResponse
    {
        $stats = [
            'blogs' => [
                'pending' => Blog::where('status', 'pending')->count(),
                'approved' => Blog::where('status', 'approved')->count(),
                'rejected' => Blog::where('status', 'rejected')->count(),
                'total' => Blog::count()
            ]
        ];

        return response()->json(['data' => $stats]);
    }
}
