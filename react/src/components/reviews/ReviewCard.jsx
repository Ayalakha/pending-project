import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { reviewService } from '../../services/reviewService'
import { useAuth } from '../../contexts/AuthContext'
import StarRating from './StarRating'
import { ThumbsUp, MoreVertical, Trash2, Edit, Calendar } from 'lucide-react'

const ReviewCard = ({ review, companyId, onEdit }) => {
    const { user } = useAuth()
    const queryClient = useQueryClient()
    const [showMenu, setShowMenu] = useState(false)

    const helpfulMutation = useMutation({
        mutationFn: () => reviewService.toggleHelpful(review.id),
        onSuccess: () => {
            queryClient.invalidateQueries(['companyReviews', companyId])
        }
    })

    const deleteMutation = useMutation({
        mutationFn: () => reviewService.deleteReview(review.id),
        onSuccess: () => {
            queryClient.invalidateQueries(['companyReviews', companyId])
            queryClient.invalidateQueries(['userReview', companyId])
        }
    })

    const handleHelpful = () => {
        if (!user) {
            alert('Please login to vote')
            return
        }
        helpfulMutation.mutate()
    }

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this review?')) {
            deleteMutation.mutate()
        }
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    const isOwner = user && review.user_id === user.id
    const isAdmin = user && user.role === 'superAdmin'

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-all duration-300 shadow-sm">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                            {review.user?.name?.charAt(0).toUpperCase()}
                        </span>
                    </div>
                    <div>
                        <h4 className="font-medium text-gray-900">{review.user?.name}</h4>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(review.created_at)}</span>
                        </div>
                    </div>
                </div>

                {/* Menu */}
                {(isOwner || isAdmin) && (
                    <div className="relative">
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="text-gray-400 bg-white hover:text-gray-600 transition-colors p-1"
                        >
                            <MoreVertical className="h-4 w-4" />
                        </button>

                        {showMenu && (
                            <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                {isOwner && (
                                    <button
                                        onClick={() => {
                                            onEdit();
                                            setShowMenu(false);
                                        }}
                                        className="w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center space-x-2 text-sm rounded-md shadow-sm bg-white "
                                    >
                                        <Edit className="h-4 w-4" />
                                        <span>Edit</span>
                                    </button>
                                )}
                                <button
                                    onClick={() => {
                                        handleDelete();
                                        setShowMenu(false);
                                    }}
                                    className="w-full px-3 py-2 text-left text-red-600 hover:bg-red-50 flex items-center space-x-2 text-sm rounded-md shadow-sm bg-white"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    <span>Delete</span>
                                </button>

                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Rating */}
            <div className="mb-3">
                <StarRating rating={review.rating} readOnly size="w-4 h-4" />
            </div>

            {/* Title */}
            {review.title && (
                <h5 className="font-medium text-gray-900 mb-2">{review.title}</h5>
            )}

            {/* Comment */}
            {review.comment && (
                <p className="text-gray-700 mb-4 leading-relaxed">{review.comment}</p>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <button
                    onClick={handleHelpful}
                    disabled={!user || helpfulMutation.isPending}
                    className={`flex items-center space-x-2 text-sm  bg-white transition-colors ${review.is_helpful_to_user
                            ? 'text-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                    <ThumbsUp className="h-4 w-4" />
                    <span>
                        Helpful ({review.helpful_votes_count || 0})
                    </span>
                </button>

                {review.is_verified && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                        Verified Purchase
                    </span>
                )}
            </div>
        </div>
    )
}

export default ReviewCard
