import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Heart, ShieldCheck, Clock, ArrowRight, Sparkles } from 'lucide-react'
import { RatingStars } from './RatingStars'
import { useLanguage } from '@/context/LanguageContext'
import { useToast } from '@/context/ToastContext'
import { toggleFavorite } from '@/services/businessService'
import { useAuth } from '@/context/AuthContext'
import { getServiceImage } from '@/data/serviceImages'

export function BusinessCard({ business, isFav = false, onToggleFav = null }) {
  const { t, language } = useLanguage()
  const { user } = useAuth()
  const toast = useToast()
  const [favorite, setFavorite] = useState(isFav)

  const handleFavoriteClick = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    const newState = !favorite
    setFavorite(newState)
    await toggleFavorite(user?.id || 'guest', business.id)
    if (onToggleFav) onToggleFav(business.id, newState)
    toast.success(newState ? 'Added to your favorites' : 'Removed from favorites')
  }

  // Calculate open / closed status based on hours
  const isOpenNow = () => {
    if (!business.openingHours || business.openingHours.length === 0) return true
    const now = new Date()
    const currentDay = now.getDay()
    const currentHourMin = now.toTimeString().slice(0, 5)

    const todaySchedule = business.openingHours.find(h => h.day === currentDay)
    if (!todaySchedule || todaySchedule.closed) return false

    return currentHourMin >= todaySchedule.open && currentHourMin <= todaySchedule.close
  }

  const openStatus = isOpenNow()
  const displayName = language === 'ta' && business.nameTa ? business.nameTa : business.name
  const displayCategory = language === 'ta' && business.categoryNameTa ? business.categoryNameTa : business.categoryName

  return (
    <div className="group bg-white rounded-2xl border border-neutral-200 shadow-soft hover:shadow-card hover:border-neutral-400 transition-all duration-300 flex flex-col overflow-hidden">
      {/* Thumbnail Banner */}
      <div className="relative h-48 w-full overflow-hidden bg-neutral-100">
        <img
          src={business.coverImage || business.photos?.[0] || getServiceImage(business.categorySlug)}
          alt={business.name}
          onError={(e) => {
            e.currentTarget.onerror = null
            e.currentTarget.src = getServiceImage(business.categorySlug)
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

        {/* Category pill */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-white text-black shadow-sm backdrop-blur-md">
            {displayCategory}
          </span>
          {business.isVerified && (
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-black text-white shadow-sm flex items-center gap-1 border border-neutral-700">
              <ShieldCheck className="w-3.5 h-3.5 text-red-500" />
              {t('verifiedBadge')}
            </span>
          )}
        </div>

        {/* Favorite button */}
        <button
          onClick={handleFavoriteClick}
          aria-label="Add to favorites"
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white text-neutral-800 hover:text-red-600 shadow-sm transition backdrop-blur-md"
        >
          <Heart className={`w-4 h-4 ${favorite ? 'fill-red-600 text-red-600' : ''}`} />
        </button>

        {/* Status chip over image bottom */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold text-white backdrop-blur-md ${openStatus ? 'bg-red-600/90' : 'bg-neutral-800/90'}`}>
            <Clock className="w-3 h-3" />
            {openStatus ? t('openNow') : t('closedNow')}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Rating and Reviews */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <RatingStars rating={business.rating || 0} size="sm" />
            <span className="text-xs font-black text-black">
              {business.rating ? business.rating.toFixed(1) : 'New'}
            </span>
            <span className="text-xs text-neutral-500 font-medium">
              ({business.reviewCount || 0})
            </span>
          </div>
          {business.experienceYears > 0 && (
            <span className="text-xs text-neutral-600 font-bold">
              {business.experienceYears}y exp.
            </span>
          )}
        </div>

        {/* Title */}
        <Link to={`/business/${business.slug}`} className="block">
          <h3 className="font-extrabold text-black text-base group-hover:text-red-600 transition line-clamp-1 mb-1">
            {displayName}
          </h3>
        </Link>

        {/* Locality & Address & Distance */}
        <div className="flex items-center justify-between text-xs text-neutral-600 mb-3">
          <div className="flex items-center gap-1.5 line-clamp-1">
            <MapPin className="w-3.5 h-3.5 text-red-600 shrink-0" />
            <span className="line-clamp-1 font-medium">
              {business.locality}, {business.city}
            </span>
          </div>
          {business.distanceKm !== undefined && (
            <span className="px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200 font-extrabold text-[10px] shrink-0">
              {business.distanceKm} km
            </span>
          )}
        </div>

        {/* Short description */}
        <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed mb-4">
          {language === 'ta' && business.descriptionTa ? business.descriptionTa : business.description}
        </p>

        {/* AI match reasons if present */}
        {business.matchReasons && business.matchReasons.length > 0 && (
          <div className="mb-4 p-2 rounded-lg bg-red-50/70 border border-red-200 flex items-start gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
            <span className="text-[11px] text-red-950 font-bold line-clamp-1">
              {business.matchReasons[0]}
            </span>
          </div>
        )}

        {/* Card Footer: Starting Price & Details Link */}
        <div className="mt-auto pt-3 border-t border-neutral-100 flex items-center justify-between">
          <div>
            <span className="block text-[11px] text-neutral-500 font-medium">
              {t('startingFrom')}
            </span>
            <span className="text-base font-black text-black">
              ₹{business.minPrice || 199}
            </span>
          </div>

          <Link
            to={`/business/${business.slug}`}
            className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-black text-white font-bold text-xs transition duration-200 shadow-sm"
          >
            {t('viewDetails')}
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  )
}
