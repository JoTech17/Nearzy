import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { 
  MapPin, Phone, Globe, ShieldCheck, Heart, Share2, 
  Clock, AlertTriangle, CheckCircle2, Star, Calendar, 
  MessageSquare, User, Briefcase, ExternalLink, ArrowRight
} from 'lucide-react'
import { RatingStars } from '@/components/common/RatingStars'
import { BookingModal } from '@/components/BookingModal'
import { ReportModal } from '@/components/ReportModal'
import { SkeletonCard } from '@/components/common/SkeletonCard'
import { useLanguage } from '@/context/LanguageContext'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { getServiceImage } from '@/data/serviceImages'
import { 
  getBusinessBySlug, 
  getBusinessReviews, 
  createReview, 
  toggleFavorite,
  getFavoriteBusinessIds 
} from '@/services/businessService'

export function BusinessDetailPage() {
  const { slug } = useParams()
  const { t, language } = useLanguage()
  const { user } = useAuth()
  const toast = useToast()

  const [business, setBusiness] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)

  // Modals
  const [bookingModalOpen, setBookingModalOpen] = useState(false)
  const [selectedService, setSelectedService] = useState(null)
  const [reportModalOpen, setReportModalOpen] = useState(false)

  // Write Review form state
  const [newRating, setNewRating] = useState(5)
  const [newComment, setNewComment] = useState('')
  const [submittingReview, setSubmittingReview] = useState(false)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const biz = await getBusinessBySlug(slug)
        setBusiness(biz)
        if (biz) {
          const revs = await getBusinessReviews(biz.id)
          setReviews(revs)
          const favs = await getFavoriteBusinessIds(user?.id || 'guest')
          setIsFavorite(favs.includes(biz.id))
        }
      } catch (err) {
        console.error('Failed to load business details:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [slug, user])

  const handleToggleFavorite = async () => {
    if (!business) return
    const newState = !isFavorite
    setIsFavorite(newState)
    await toggleFavorite(user?.id || 'guest', business.id)
    toast.success(newState ? 'Added to your favorites' : 'Removed from favorites')
  }

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard!')
    }
  }

  const handleBookServiceClick = (service) => {
    setSelectedService(service)
    setBookingModalOpen(true)
  }

  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    if (!user) {
      toast.error('Please sign in to write a review.')
      navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`)
      return
    }
    if (!newComment.trim()) return

    setSubmittingReview(true)
    try {
      const added = await createReview({
        businessId: business.id,
        customerName: user?.displayName || 'Customer',
        rating: newRating,
        comment: newComment,
      })
      setReviews(prev => [added, ...prev])
      setNewComment('')
      setNewRating(5)
      toast.success('Thank you! Your review has been published.')
    } catch (err) {
      toast.error('Failed to submit review.')
    } finally {
      setSubmittingReview(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <SkeletonCard />
      </div>
    )
  }

  if (!business) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-800">Business Listing Not Found</h2>
        <p className="text-sm text-slate-500 mt-2 mb-6">
          The business you are looking for might have been moved or removed.
        </p>
        <Link to="/search" className="px-5 py-2.5 rounded-xl bg-brand-blue text-white text-xs font-bold">
          Explore Other Local Services
        </Link>
      </div>
    )
  }

  const displayName = language === 'ta' && business.nameTa ? business.nameTa : business.name
  const displayCategory = language === 'ta' && business.categoryNameTa ? business.categoryNameTa : business.categoryName
  const displayDesc = language === 'ta' && business.descriptionTa ? business.descriptionTa : business.description

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Header Banner & Title */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-200 shadow-card">
        {/* Banner image */}
        <div className="h-64 sm:h-80 w-full relative">
          <img
            src={business.coverImage || getServiceImage(business.categorySlug)}
            alt={business.name}
            onError={(e) => {
              e.currentTarget.onerror = null
              e.currentTarget.src = getServiceImage(business.categorySlug)
            }}
            className="w-full h-full object-cover opacity-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

          {/* Top Actions */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              onClick={handleToggleFavorite}
              className="p-2.5 rounded-2xl bg-white/90 hover:bg-white text-slate-700 hover:text-red-500 shadow-md transition backdrop-blur-md"
              title="Save to favorites"
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
            </button>
            <button
              onClick={handleShare}
              className="p-2.5 rounded-2xl bg-white/90 hover:bg-white text-slate-700 shadow-md transition backdrop-blur-md"
              title="Share listing"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          {/* Header Info Overlay */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-blue text-white shadow-sm">
                  {displayCategory}
                </span>
                {business.isVerified && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500 text-white flex items-center gap-1 shadow-sm">
                    <ShieldCheck className="w-4 h-4" />
                    {t('verifiedBadge')}
                  </span>
                )}
                {!business.isClaimed && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500 text-white shadow-sm">
                    {t('unclaimedBadge')}
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
                {displayName}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-200">
                <div className="flex items-center gap-1.5">
                  <RatingStars rating={business.rating || 0} size="sm" />
                  <span className="font-bold text-white text-sm">
                    {business.rating ? business.rating.toFixed(1) : 'New'}
                  </span>
                  <span>({reviews.length} reviews)</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-brand-orange" />
                  <span>{business.address}, {business.locality}, {business.city}</span>
                </div>
              </div>
            </div>

            {/* Quick Contact & Book buttons */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <a
                href={`tel:${business.phone}`}
                className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition flex items-center gap-1.5 backdrop-blur-md"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{business.phone}</span>
              </a>
              <button
                onClick={() => handleBookServiceClick(business.services?.[0])}
                className="px-6 py-2.5 rounded-2xl bg-brand-orange hover:bg-orange-600 text-white font-black text-xs shadow-glow transition flex items-center gap-1.5"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>{t('bookNow')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Unclaimed Claim Banner (if unclaimed) */}
      {!business.isClaimed && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-amber-950 uppercase">
                Are you the business owner?
              </h4>
              <p className="text-xs text-amber-800">
                Claim this listing to verify your identity, update opening hours, edit services, and accept booking requests directly.
              </p>
            </div>
          </div>
          <Link
            to={`/claim-business?id=${business.id}`}
            className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shrink-0 shadow-sm transition"
          >
            Claim This Listing
          </Link>
        </div>
      )}

      {/* 3. Main Content Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (Services, Overview, Reviews) */}
        <div className="lg:col-span-2 space-y-8">
          {/* About Provider */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft space-y-4">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
              {t('aboutProvider')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {displayDesc}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-3 border-t border-slate-100 text-xs">
              <div>
                <span className="text-slate-400 block">{t('yearsExperience')}</span>
                <strong className="font-bold text-slate-800 text-sm">{business.experienceYears} Years</strong>
              </div>
              <div>
                <span className="text-slate-400 block">{t('serviceModes')}</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {business.serviceMode?.map((mode) => (
                    <span key={mode} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold text-[10px]">
                      {mode === 'at_doorstep' ? 'Doorstep' : mode === 'at_shop' ? 'Shop/Clinic' : 'Online'}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-slate-400 block">Starting Fee</span>
                <strong className="font-extrabold text-brand-dark text-sm">₹{business.minPrice}</strong>
              </div>
            </div>
          </div>

          {/* Services & Pricing Menu */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">
                {t('servicesOffered')}
              </h3>
              <span className="text-xs font-semibold text-brand-blue bg-blue-50 px-2.5 py-1 rounded-full">
                {business.services?.length || 0} services
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {business.services?.map((svc) => (
                <div key={svc.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-sm">
                        {language === 'ta' && svc.nameTa ? svc.nameTa : svc.name}
                      </h4>
                      <span className="text-[11px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md font-medium">
                        {svc.durationMinutes} mins
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 max-w-lg leading-relaxed">
                      {svc.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 uppercase block">
                        {svc.pricingType === 'starting_at' ? 'Starts at' : svc.pricingType === 'quote' ? 'Estimate' : 'Fixed'}
                      </span>
                      <strong className="text-base font-black text-slate-900">
                        ₹{svc.price}
                      </strong>
                    </div>

                    <button
                      onClick={() => handleBookServiceClick(svc)}
                      className="px-4 py-2 rounded-xl bg-blue-50 text-brand-blue hover:bg-brand-blue hover:text-white font-bold text-xs transition duration-200"
                    >
                      {t('bookNow')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Reviews & Feedback Section */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {t('customerReviews')}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <RatingStars rating={business.rating || 0} size="md" />
                  <span className="font-bold text-slate-800 text-sm">
                    {business.rating ? business.rating.toFixed(1) : '5.0'}
                  </span>
                  <span className="text-xs text-slate-400">
                    based on {reviews.length} verified ratings
                  </span>
                </div>
              </div>
            </div>

            {/* Existing Reviews List */}
            <div className="space-y-4">
              {reviews.map((rev) => (
                <div key={rev.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-blue-100 text-brand-blue font-bold text-xs flex items-center justify-center">
                        {rev.customerName?.charAt(0) || 'U'}
                      </div>
                      <span className="font-bold text-xs text-slate-800">{rev.customerName}</span>
                    </div>
                    <RatingStars rating={rev.rating} size="sm" />
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {rev.comment}
                  </p>

                  {/* Business owner official response if present */}
                  {rev.ownerResponse && (
                    <div className="mt-3 pl-3 border-l-2 border-brand-orange bg-orange-50/50 p-2.5 rounded-r-xl">
                      <span className="text-[10px] font-bold text-brand-orange uppercase block mb-1">
                        {t('ownerResponseLabel')}
                      </span>
                      <p className="text-xs text-slate-700 italic">
                        "{rev.ownerResponse}"
                      </p>
                    </div>
                  )}
                </div>
              ))}

              {reviews.length === 0 && (
                <p className="text-xs text-slate-400 italic py-4 text-center">
                  {t('noReviewsYet')}
                </p>
              )}
            </div>

            {/* Write Review Form */}
            <div className="pt-6 border-t border-slate-100 space-y-3">
              <h4 className="text-sm font-bold text-slate-800">
                {t('writeReviewTitle')}
              </h4>
              <form onSubmit={handleReviewSubmit} className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-slate-600">{t('rateYourExperience')}:</span>
                  <RatingStars rating={newRating} interactive onRate={(r) => setNewRating(r)} size="lg" />
                </div>
                <textarea
                  rows={3}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder={t('reviewCommentPlaceholder')}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-brand-blue outline-none resize-none"
                />
                <button
                  type="submit"
                  disabled={submittingReview || !newComment.trim()}
                  className="px-5 py-2.5 rounded-xl bg-brand-blue hover:bg-brand-electric disabled:opacity-50 text-white font-bold text-xs transition shadow-sm"
                >
                  {submittingReview ? 'Publishing...' : t('submitReview')}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Contact, Working Hours, Actions */}
        <aside className="space-y-6">
          {/* Contact Details Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-3">
              {t('contactDetailsTitle')}
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-400 block">{t('phoneLabel')}</span>
                  <a href={`tel:${business.phone}`} className="font-bold text-brand-blue hover:underline">
                    {business.phone}
                  </a>
                </div>
              </div>

              {business.email && (
                <div className="flex items-start gap-3">
                  <Globe className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 block">{t('emailLabel')}</span>
                    <a href={`mailto:${business.email}`} className="font-medium text-slate-700 hover:underline">
                      {business.email}
                    </a>
                  </div>
                </div>
              )}

              {business.website && (
                <div className="flex items-start gap-3">
                  <ExternalLink className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 block">{t('websiteLabel')}</span>
                    <a href={business.website} target="_blank" rel="noreferrer" className="font-medium text-brand-blue hover:underline line-clamp-1">
                      {business.website}
                    </a>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-400 block">{t('addressLabel')}</span>
                  <p className="font-medium text-slate-700 leading-relaxed">
                    {business.address}, {business.locality}, {business.city} - {business.postalCode}
                  </p>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-2 flex flex-col gap-2">
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(business.name + ' ' + business.address)}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs text-center flex items-center justify-center gap-1.5 transition"
              >
                <MapPin className="w-3.5 h-3.5 text-brand-orange" />
                <span>{t('directions')}</span>
              </a>
              <button
                onClick={() => setReportModalOpen(true)}
                className="w-full py-2 text-slate-400 hover:text-red-600 text-[11px] font-semibold text-center transition flex items-center justify-center gap-1"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{t('reportListing')}</span>
              </button>
            </div>
          </div>

          {/* Opening Hours Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-blue" />
              {t('openingHoursTitle')}
            </h3>

            <div className="space-y-2 text-xs">
              {business.openingHours?.map((slot) => {
                const dayName = daysOfWeek[slot.day]
                const isToday = new Date().getDay() === slot.day
                return (
                  <div
                    key={slot.day}
                    className={`flex items-center justify-between py-1 px-2 rounded-lg ${
                      isToday ? 'bg-blue-50 font-bold text-brand-blue' : 'text-slate-600'
                    }`}
                  >
                    <span>{dayName}</span>
                    <span>
                      {slot.closed ? 'Closed' : `${slot.open} - ${slot.close}`}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </aside>
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        business={business}
        initialService={selectedService}
      />

      {/* Report Modal */}
      <ReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        businessId={business.id}
        businessName={business.name}
      />
    </div>
  )
}
