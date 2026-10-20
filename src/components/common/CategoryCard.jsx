import React from 'react'
import { Link } from 'react-router-dom'
import { IconResolver } from './IconResolver'
import { useLanguage } from '@/context/LanguageContext'
import { getServiceImage } from '@/data/serviceImages'

export function CategoryCard({ category }) {
  const { language } = useLanguage()

  const displayName = language === 'ta' && category.name_ta ? category.name_ta : category.name
  const subName = language === 'ta' ? category.name : category.name_ta
  const imageUrl = getServiceImage(category.slug)

  return (
    <Link
      to={`/search?category=${category.slug}`}
      className="group flex flex-col bg-white rounded-2xl border border-neutral-200 shadow-soft hover:shadow-card hover:-translate-y-1 hover:border-red-600 transition-all duration-300 overflow-hidden"
    >
      {/* Category Image Header */}
      <div className="relative w-full h-24 overflow-hidden bg-neutral-100">
        <img
          src={imageUrl}
          alt={displayName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        
        {/* Floating Category Icon */}
        <div className="absolute bottom-2 left-3 w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-md border border-white/80">
          <IconResolver name={category.icon} className="w-4 h-4" />
        </div>
      </div>

      {/* Category Details */}
      <div className="p-3 flex flex-col items-start text-left">
        <span className="font-extrabold text-black text-xs sm:text-sm group-hover:text-red-600 transition line-clamp-1">
          {displayName}
        </span>
        {subName && (
          <span className="text-[11px] text-neutral-500 line-clamp-1 font-medium mt-0.5">
            {subName}
          </span>
        )}
        <span className="text-[10px] text-neutral-500 font-bold mt-2 bg-neutral-50 px-2 py-0.5 rounded-full border border-neutral-200">
          All 38 Districts
        </span>
      </div>
    </Link>
  )
}
