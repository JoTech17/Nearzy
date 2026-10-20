import React from 'react'
import { Star } from 'lucide-react'

export function RatingStars({ rating = 0, max = 5, size = 'md', interactive = false, onRate = null }) {
  const sizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
    xl: 'w-6 h-6',
  }

  const starSize = sizes[size] || sizes.md

  return (
    <div className="flex items-center gap-1">
      {[...Array(max)].map((_, i) => {
        const starNumber = i + 1
        const isFilled = starNumber <= Math.round(rating)
        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onRate && onRate(starNumber)}
            className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}`}
          >
            <Star
              className={`${starSize} ${
                isFilled
                  ? 'fill-amber-400 text-amber-400'
                  : 'fill-slate-100 text-slate-300'
              }`}
            />
          </button>
        )
      })}
    </div>
  )
}
