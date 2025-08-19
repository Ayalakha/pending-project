<?php

namespace App\Http\Controllers;

use App\Models\Review;
use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class ReviewController extends Controller
{
    /**
     * Display reviews for a specific company
     */
    public function index(Company $company): JsonResponse
    {
        $reviews = $company->approvedReviews()
            ->with('user:id,name')
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json([
            'success' => true,
            'data' => $reviews,
            'company_stats' => [
                'average_rating' => round($company->average_rating, 1),
                'total_reviews' => $company->total_reviews,
                'rating_distribution' => $company->rating_distribution
            ]
        ]);
    }

    /**
     * Store a newly created review
     */
    public function store(Request $request, Company $company): JsonResponse
    {
        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'title' => 'nullable|string|max:255',
            'comment' => 'nullable|string|max:1000'
        ]);

        // Check if user already reviewed this company
        $existingReview = Review::where('user_id', Auth::id())
            ->where('company_id', $company->id)
            ->first();

        if ($existingReview) {
            return response()->json([
                'success' => false,
                'message' => 'You have already reviewed this company'
            ], 409);
        }

        $review = Review::create([
            'user_id' => Auth::id(),
            'company_id' => $company->id,
            'rating' => $validated['rating'],
            'title' => $validated['title'],
            'comment' => $validated['comment'],
        ]);

        $review->load('user:id,name');

        return response()->json([
            'success' => true,
            'message' => 'Review submitted successfully',
            'data' => $review
        ], 201);
    }

    /**
     * Update an existing review
     */
    public function update(Request $request, Review $review): JsonResponse
    {
        // Check if user owns this review
        if ($review->user_id !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'title' => 'nullable|string|max:255',
            'comment' => 'nullable|string|max:1000'
        ]);

        $review->update($validated);
        $review->load('user:id,name');

        return response()->json([
            'success' => true,
            'message' => 'Review updated successfully',
            'data' => $review
        ]);
    }

    /**
     * Delete a review
     */
    public function destroy(Review $review): JsonResponse
    {
        $user = Auth::user();
        
        // Check if user owns this review or is admin
        if ($review->user_id !== $user->id && $user->role !== 'superAdmin') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $review->delete();

        return response()->json([
            'success' => true,
            'message' => 'Review deleted successfully'
        ]);
    }

    /**
     * Toggle helpful vote for a review
     */
    public function toggleHelpful(Review $review): JsonResponse
    {
        $userId = Auth::id();
        $helpfulVotes = $review->helpful_votes ?? [];

        if (in_array($userId, $helpfulVotes)) {
            // Remove vote
            $helpfulVotes = array_filter($helpfulVotes, fn($id) => $id !== $userId);
        } else {
            // Add vote
            $helpfulVotes[] = $userId;
        }

        $review->update(['helpful_votes' => array_values($helpfulVotes)]);

        return response()->json([
            'success' => true,
            'helpful_count' => count($helpfulVotes),
            'user_voted' => in_array($userId, $helpfulVotes)
        ]);
    }

    /**
     * Get user's review for a specific company
     */
    public function getUserReview(Company $company): JsonResponse
    {
        $review = Review::where('user_id', Auth::id())
            ->where('company_id', $company->id)
            ->with('user:id,name')
            ->first();

        return response()->json([
            'success' => true,
            'data' => $review
        ]);
    }
}
