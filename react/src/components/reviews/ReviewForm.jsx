import { useState, useEffect } from 'react'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { reviewService } from '../../services/reviewService'
import { useAuth } from '../../contexts/AuthContext'
import StarRating from './StarRating'
import { X, Loader2 } from 'lucide-react'

const ReviewForm = ({ companyId, onClose, onSuccess }) => {
    const { user } = useAuth()
    const queryClient = useQueryClient()

    const [formData, setFormData] = useState({
        rating: 0,
        title: '',
        comment: ''
    })

    // Check if user already has a review for this company
    const { data: existingReview } = useQuery({
        queryKey: ['userReview', companyId],
        queryFn: () => reviewService.getUserReview(companyId),
        enabled: !!user
    })

    // Pre-populate form if editing existing review
    useEffect(() => {
        if (existingReview?.data) {
            setFormData({
                rating: existingReview.data.rating,
                title: existingReview.data.title || '',
                comment: existingReview.data.comment || ''
            })
        }
    }, [existingReview])

    const submitMutation = useMutation({
        mutationFn: (data) => reviewService.submitReview(companyId, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['companyReviews', companyId])
            queryClient.invalidateQueries(['userReview', companyId])
            onSuccess?.()
            onClose()
        }
    })

    const updateMutation = useMutation({
        mutationFn: (data) => reviewService.updateReview(existingReview.data.id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['companyReviews', companyId])
            queryClient.invalidateQueries(['userReview', companyId])
            onSuccess?.()
            onClose()
        }
    })

    const handleSubmit = (e) => {
        e.preventDefault()

        if (formData.rating === 0) {
            alert('Please select a rating')
            return
        }

        if (existingReview?.data) {
            updateMutation.mutate(formData)
        } else {
            submitMutation.mutate(formData)
        }
    }

    const isLoading = submitMutation.isPending || updateMutation.isPending

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl border border-gray-200 w-full max-w-md p-6 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-900">
                        {existingReview?.data ? 'Update Review' : 'Write a Review'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full bg-white text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors focus:outline-none"
                    >
                        <X className="h-5 w-5" />
                    </button>



                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Rating */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Rating *
                        </label>
                        <StarRating
                            rating={formData.rating}
                            onRatingChange={(rating) => setFormData(prev => ({ ...prev, rating }))}
                            size="w-6 h-6"
                        />
                    </div>

                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Review Title
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="Summarize your experience"
                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            maxLength={255}
                        />
                    </div>

                    {/* Comment */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Your Review
                        </label>
                        <textarea
                            value={formData.comment}
                            onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
                            placeholder="Share your experience with this company..."
                            rows={4}
                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            maxLength={1000}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            {formData.comment.length}/1000 characters
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3 pt-4 ">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-700 rounded-lg transition-all duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading || formData.rating === 0}
                            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-sm"
                        >
                            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                            <span>{existingReview?.data ? 'Update' : 'Submit'} Review</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ReviewForm
