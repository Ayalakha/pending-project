import { Star } from 'lucide-react'

const StarRating = ({ rating, onRatingChange, readOnly = false, size = 'w-5 h-5' }) => {
  const stars = [1, 2, 3, 4, 5]

  return (
    <div className="flex items-center space-x-1 bg">
      {stars.map((star) => (
        <Star
          key={star}
          className={`${size} cursor-${readOnly ? 'default' : 'pointer'} transition-colors duration-200 ${
            star <= rating
              ? 'fill-yellow-400 text-yellow-400'
              : 'fill-gray-200 text-gray-200 hover:fill-yellow-300 hover:text-yellow-300'
          }`}
          onClick={() => !readOnly && onRatingChange && onRatingChange(star)}
        />
      ))}
    </div>
  )
}

export default StarRating
