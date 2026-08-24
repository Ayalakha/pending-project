import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { reviewService } from '../../services/reviewService'
import { useAuth } from '../../contexts/AuthContext'
import ReviewCard from './ReviewCard'
import ReviewForm from './ReviewForm'
import StarRating from './StarRating'
import { Star, MessageSquare, Plus, Filter, Loader2 } from 'lucide-react'

const ReviewList = ({ companyId }) => {
  const { user } = useAuth()
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [filterRating, setFilterRating] = useState(0)

  const { data: reviewsData, isLoading, error } = useQuery({
    queryKey: ['companyReviews', companyId, filterRating],
    queryFn: () => reviewService.getCompanyReviews(companyId),
    staleTime: 5 * 60 * 1000 // 5 minutes
  })

  const { data: userReviewData } = useQuery({
    queryKey: ['userReview', companyId],
    queryFn: () => reviewService.getUserReview(companyId),
    enabled: !!user
  })

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
        <div className="flex items-center justify-center">
          <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
          <span className="text-gray-600 ml-2">Loading reviews...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
        <div className="text-center text-gray-600">
          Failed to load reviews. Please try again later.
        </div>
      </div>
    )
  }

  const reviews = reviewsData?.data?.data || []
  const stats = reviewsData?.company_stats || {}
  const hasUserReview = !!userReviewData?.data

  // Filter reviews by rating if selected
  const filteredReviews = filterRating > 0 
    ? reviews.filter(review => review.rating === filterRating)
    : reviews

  const RatingDistribution = () => (
    <div className="space-y-2">
      {[5, 4, 3, 2, 1].map(rating => {
        const count = stats.rating_distribution?.[rating] || 0
        const percentage = stats.total_reviews > 0 ? (count / stats.total_reviews) * 100 : 0
        
        return (
          <button
            key={rating}
            onClick={() => setFilterRating(filterRating === rating ? 0 : rating)}
            className={`w-full flex items-center space-x-2 p-2  bg-white rounded-lg transition-colors ${
              filterRating === rating ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'
            }`}
          >
            <span className="text-gray-700 text-sm font-medium">{rating}</span>
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-yellow-400 transition-all duration-300"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <span className="text-gray-500 text-xs">{count}</span>
          </button>
        )
      })}
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Reviews Overview */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Summary */}
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start space-x-2 mb-2">
              <span className="text-4xl font-bold text-gray-900">
                {stats.average_rating ? stats.average_rating.toFixed(1) : '0.0'}
              </span>
              <div>
                <StarRating rating={Math.round(stats.average_rating || 0)} readOnly />
                <p className="text-gray-600 text-sm mt-1">
                  {stats.total_reviews} review{stats.total_reviews !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            
            {user && !hasUserReview && (
              <button
                onClick={() => setShowReviewForm(true)}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 mt-4 shadow-sm"
              >
                <Plus className="h-4 w-4" />
                <span>Write a Review</span>
              </button>
            )}

            {hasUserReview && (
              <button
                onClick={() => setShowReviewForm(true)}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-200 mt-4 shadow-sm"
              >
                <MessageSquare className="h-4 w-4" />
                <span>Edit Your Review</span>
              </button>
            )}
          </div>

          {/* Rating Distribution */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3 flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <span>Filter by Rating</span>
            </h4>
            <RatingDistribution />
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.length > 0 ? (
          filteredReviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              companyId={companyId}
              onEdit={() => setShowReviewForm(true)}
            />
          ))
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center shadow-sm">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filterRating > 0 ? `No ${filterRating}-star reviews` : 'No reviews yet'}
            </h3>
            <p className="text-gray-600">
              {filterRating > 0 
                ? 'Try adjusting your filter to see more reviews.'
                : 'Be the first to share your experience with this company.'
              }
            </p>
            {user && !hasUserReview && filterRating === 0 && (
              <button
                onClick={() => setShowReviewForm(true)}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 mt-4 shadow-sm"
              >
                <Plus className="h-4 w-4" />
                <span>Write the First Review</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Review Form Modal */}
      {showReviewForm && (
        <ReviewForm
          companyId={companyId}
          onClose={() => setShowReviewForm(false)}
          onSuccess={() => {
            // Optional: Show success message
          }}
        />
      )}
    </div>
  )
}

export default ReviewList
