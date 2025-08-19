<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Blog;
use App\Models\Comment;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class ContentModerationController extends Controller
{
    // Get all content for moderation
    public function index(Request $request): JsonResponse
    {
        $type = $request->query('type', 'all');
        $status = $request->query('status', 'all');
        $perPage = $request->query('per_page', 15);

        $content = collect();

        if ($type === 'all' || $type === 'blogs') {
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
            $content = $content->merge($blogs);
        }

        if ($type === 'all' || $type === 'comments') {
            $commentsQuery = Comment::with(['author', 'blog', 'moderatedBy'])
                ->when($status !== 'all', function ($query) use ($status) {
                    return $query->where('status', $status);
                });
            
            $comments = $commentsQuery->get()->map(function ($comment) {
                return [
                    'id' => $comment->id,
                    'type' => 'comment',
                    'title' => 'Comment on: ' . $comment->blog->title,
                    'content' => $comment->content,
                    'author' => $comment->author->name,
                    'status' => $comment->status,
                    'moderation_notes' => $comment->moderation_notes,
                    'moderated_by' => $comment->moderatedBy?->name,
                    'moderated_at' => $comment->moderated_at,
                    'created_at' => $comment->created_at,
                ];
            });
            $content = $content->merge($comments);
        }

        if ($type === 'all' || $type === 'reviews') {
            $reviewsQuery = Review::with(['user', 'company', 'moderatedBy'])
                ->when($status !== 'all', function ($query) use ($status) {
                    return $query->where('status', $status);
                });
            
            $reviews = $reviewsQuery->get()->map(function ($review) {
                return [
                    'id' => $review->id,
                    'type' => 'review',
                    'title' => $review->title,
                    'content' => $review->comment,
                    'author' => $review->user->name,
                    'company' => $review->company->name,
                    'rating' => $review->rating,
                    'status' => $review->status,
                    'moderation_notes' => $review->moderation_notes,
                    'moderated_by' => $review->moderatedBy?->name,
                    'moderated_at' => $review->moderated_at,
                    'created_at' => $review->created_at,
                ];
            });
            $content = $content->merge($reviews);
        }

        // Sort by created_at descending
        $content = $content->sortByDesc('created_at');

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
            'content_type' => 'required|in:blog,comment,review',
            'content_id' => 'required|integer',
            'action' => 'required|in:approve,reject',
            'notes' => 'nullable|string|max:1000'
        ]);

        $contentType = $request->content_type;
        $contentId = $request->content_id;
        $action = $request->action;
        $notes = $request->notes;

        $model = match ($contentType) {
            'blog' => Blog::find($contentId),
            'comment' => Comment::find($contentId),
            'review' => Review::find($contentId),
        };

        if (!$model) {
            return response()->json(['error' => 'Content not found'], 404);
        }

        $status = $action === 'approve' ? 'approved' : 'rejected';

        $model->update([
            'status' => $status,
            'moderation_notes' => $notes,
            'moderated_by' => Auth::id(),
            'moderated_at' => now()
        ]);

        return response()->json([
            'message' => ucfirst($contentType) . ' ' . $action . 'd successfully',
            'content' => $model->fresh()
        ]);
    }

    // Get content details for detailed view
    public function show(string $type, int $id): JsonResponse
    {
        $model = match ($type) {
            'blog' => Blog::with(['author', 'moderatedBy'])->find($id),
            'comment' => Comment::with(['author', 'blog', 'moderatedBy'])->find($id),
            'review' => Review::with(['user', 'company', 'moderatedBy'])->find($id),
            default => null
        };

        if (!$model) {
            return response()->json(['error' => 'Content not found'], 404);
        }

        return response()->json(['data' => $model]);
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
            ],
            'comments' => [
                'pending' => Comment::where('status', 'pending')->count(),
                'approved' => Comment::where('status', 'approved')->count(),
                'rejected' => Comment::where('status', 'rejected')->count(),
                'total' => Comment::count()
            ],
            'reviews' => [
                'pending' => Review::where('status', 'pending')->count(),
                'approved' => Review::where('status', 'approved')->count(),
                'rejected' => Review::where('status', 'rejected')->count(),
                'total' => Review::count()
            ]
        ];

        return response()->json(['data' => $stats]);
    }
}
