import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { 
  Search, MapPin, Sparkles, ArrowRight, 
  ChevronRight, Compass
} from 'lucide-react'
import { CategoryCard } from '@/components/common/CategoryCard'
import { BusinessCard } from '@/components/common/BusinessCard'
import { SkeletonCard } from '@/components/common/SkeletonCard'
import { EmptyState } from '@/components/common/EmptyState'
import { TamilNaduMap } from '@/components/TamilNaduMap'
import { useLanguage } from '@/context/LanguageContext'
import { getCategories, searchBusinesses } from '@/services/businessService'
import { TAMIL_NADU_LOCATIONS, filterProvidersWithinRadius } from '@/data/tamilNaduLocations'
import { LocationAutocomplete } from '@/components/common/LocationAutocomplete'

export function Home({ onOpenAiModal }) {
  const { t, language } = useLanguage()
  const navigate = useNavigate()

  const [categories, setCategories] = useState([])
  const [allBusinesses, setAllBusinesses] = useState([])
  const [featuredBusinesses, setFeaturedBusinesses] = useState([])
  const [mapLocation, setMapLocation] = useState(null) // No default location (Shows all Tamil Nadu)
  const [loading, setLoading] = useState(true)

  // Search hero state
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLocality, setSelectedLocality] = useState('')

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      try {
        const [cats, bizs] = await Promise.all([
          getCategories(),
          searchBusinesses({ limit: 760, sortBy: 'rating' })
        ])
        setCategories(cats)
        setAllBusinesses(bizs)
        setFeaturedBusinesses(bizs.slice(0, 6))
      } catch (err) {
        console.error('Failed to load homepage data:', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (searchQuery.trim()) params.append('q', searchQuery.trim())
    if (selectedLocality) params.append('locality', selectedLocality)
    navigate(`/search?${params.toString()}`)
  }

  // Handle map location switch (e.g. user selects a district or clicks on the map)
  const handleMapLocationChange = (locId) => {
    if (!locId) {
      setMapLocation(null)
      return
    }
    const loc = TAMIL_NADU_LOCATIONS.find(l => l.id === locId || l.name === locId)
    if (loc) {
      setMapLocation(loc)
    }
  }

  const handleMapClick = (lat, lng) => {
    setMapLocation({
      id: 'custom-pin',
      name: `Selected Coordinates (${lat.toFixed(2)}, ${lng.toFixed(2)})`,
      lat,
      lng,
      district: 'Tamil Nadu'
    })
  }

  // Providers within 30km around mapLocation
  let mapProvidersWithin30Km = mapLocation
    ? filterProvidersWithinRadius(allBusinesses, mapLocation.lat, mapLocation.lng, 30)
    : allBusinesses.slice(0, 30)

  // If strict 30km radius returned 0 for any coordinate, find closest providers in that district / area
  if (mapProvidersWithin30Km.length === 0 && mapLocation && allBusinesses.length > 0) {
    const districtMatches = allBusinesses.filter(b => 
      (b.district && b.district.toLowerCase() === mapLocation.district?.toLowerCase()) ||
      (b.city && b.city.toLowerCase() === mapLocation.district?.toLowerCase()) ||
      (b.locality && b.locality.toLowerCase().includes(mapLocation.name?.toLowerCase()))
    )
    if (districtMatches.length > 0) {
      mapProvidersWithin30Km = districtMatches
    } else {
      mapProvidersWithin30Km = filterProvidersWithinRadius(allBusinesses, mapLocation.lat, mapLocation.lng, 60)
    }
  }

  return (
    <div className="space-y-16 pb-20">
      {/* 1. Hero Section (Red, White & Black) */}
      <section className="relative overflow-hidden pt-12 pb-20 bg-gradient-to-b from-red-50/40 via-white to-neutral-50">
        <div className="absolute top-0 right-10 w-96 h-96 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 left-10 w-96 h-96 bg-black/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Tagline Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-neutral-200 shadow-soft mb-6">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
            <span className="text-xs font-black text-black uppercase tracking-wider">
              {t('brandName')} — <span className="text-red-600">{t('tagline')}</span>
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-black tracking-tight max-w-4xl mx-auto leading-tight mb-5">
            {t('heroHeadline')}
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            Discover verified local services within 30 km across all 38 districts of Tamil Nadu. Compare transparent prices and book instantly.
          </p>

          {/* Search Box */}
          <div className="max-w-3xl mx-auto">
            <form
              onSubmit={handleSearchSubmit}
              className="p-2 sm:p-2.5 bg-white rounded-3xl border border-neutral-300 shadow-card flex flex-col md:flex-row items-center gap-2"
            >
              {/* Keyword / Service Input */}
              <div className="flex-1 w-full flex items-center px-4 py-2 border-b md:border-b-0 md:border-r border-neutral-200">
                <Search className="w-5 h-5 text-neutral-400 shrink-0 mr-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('searchPlaceholder')}
                  className="w-full text-sm font-semibold text-black placeholder:text-neutral-400 outline-none bg-transparent"
                />
              </div>

              {/* All Tamil Nadu Locations Typeahead */}
              <div className="w-full md:w-72 px-1">
                <LocationAutocomplete
                  value={selectedLocality}
                  placeholder="Select town or district..."
                  onChange={(val) => setSelectedLocality(val)}
                  onSelect={(loc) => {
                    if (loc) {
                      setSelectedLocality(loc.name)
                      setMapLocation(loc)
                    } else {
                      setSelectedLocality('')
                    }
                  }}
                  inputClassName="border-0 shadow-none text-xs font-bold text-neutral-800 bg-transparent py-2.5 focus:ring-0 focus:border-transparent"
                />
              </div>

              {/* Search Submit Button */}
              <button
                type="submit"
                className="w-full md:w-auto px-7 py-3.5 rounded-2xl bg-red-600 hover:bg-black text-white font-extrabold text-sm shadow-md transition flex items-center justify-center gap-2 shrink-0"
              >
                <span>{t('searchAction')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Actions below search */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs">
              <span className="text-neutral-600 font-bold">
                📍 Showing services within <strong className="text-red-600">30 km radius</strong> across Tamil Nadu
              </span>
              <span className="text-neutral-300">•</span>
              <button
                type="button"
                onClick={onOpenAiModal}
                className="flex items-center gap-1.5 text-red-600 hover:text-black font-extrabold transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-red-600" />
                <span>{t('askAiPrompt')} (Tamil & English)</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Interactive Tamil Nadu Map & 30km Radius Finder */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-neutral-200 shadow-soft p-6 sm:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold uppercase mb-2 border border-red-200">
                <Compass className="w-3.5 h-3.5" />
                Full Tamil Nadu Spatial Coverage
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
                Tamil Nadu Live Services Map (30 km Radius)
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 mt-1 max-w-2xl font-medium">
                Select any of Tamil Nadu's 38 districts to view all verified service providers within 30 km. Click any pin to view services, pricing, and book.
              </p>
            </div>

            {/* Quick District Picker */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-neutral-800 whitespace-nowrap">
                Select District / Town:
              </label>
              <select
                value={mapLocation?.id || ''}
                onChange={(e) => handleMapLocationChange(e.target.value)}
                className="px-3.5 py-2 rounded-xl border border-neutral-300 text-xs font-bold text-neutral-900 bg-neutral-50 outline-none cursor-pointer focus:border-red-600"
              >
                <option value="">-- All Tamil Nadu (Select District / Town) --</option>
                {TAMIL_NADU_LOCATIONS.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name} ({loc.district})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Interactive Map */}
          <TamilNaduMap
            providers={allBusinesses}
            selectedLocation={mapLocation}
            onSelectMapLocation={handleMapClick}
            height="460px"
            radiusKm={30}
          />

          {/* Nearby Providers List Preview */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-neutral-900">
                {mapLocation ? (
                  <>
                    Services Within 30 km of <span className="text-red-600 font-extrabold">{mapLocation.name}</span> ({mapProvidersWithin30Km.length} providers found)
                  </>
                ) : (
                  <>
                    Tamil Nadu Verified Service Providers <span className="text-neutral-500 font-normal">({allBusinesses.length} providers statewide • Select any district or pin)</span>
                  </>
                )}
              </h3>
              <Link
                to={mapLocation ? `/search?locality=${encodeURIComponent(mapLocation.name)}` : '/search'}
                className="text-xs font-bold text-red-600 hover:text-black flex items-center gap-1"
              >
                View all in Search →
              </Link>
            </div>

            {mapProvidersWithin30Km.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {mapProvidersWithin30Km.slice(0, 3).map((biz) => (
                  <BusinessCard key={biz.id} business={biz} />
                ))}
              </div>
            ) : (
              <div className="p-6 text-center bg-neutral-50 rounded-2xl border border-dashed border-neutral-300 text-xs text-neutral-500">
                No providers registered strictly within 30 km of this point. Try selecting a nearby district.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3. Popular Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
              {t('popularCategoriesTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1 font-medium">
              Every category features verified local service providers in every district across Tamil Nadu
            </p>
          </div>
          <Link
            to="/categories"
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-red-600 hover:text-black transition shrink-0"
          >
            {t('viewAllCategories')}
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
          {categories.slice(0, 8).map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      </section>

      {/* 4. AI Assistant Highlight Banner (Black, Red & White) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-black text-white p-8 sm:p-12 shadow-2xl border border-neutral-800">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/30 border border-red-500/40 text-xs font-bold uppercase tracking-wider mb-4 text-red-400">
              <Sparkles className="w-3.5 h-3.5 text-red-400" />
              Powered by Google Gemini AI
            </div>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight mb-3">
              Natural Language Service Discovery Across Tamil Nadu
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed mb-6 font-medium">
              Ask in Tamil or English: "Find an electrician in Salem under ₹400" or "கோவையில் சிறந்த கார் வாட்டர் வாஷ்".
              Gemini extracts your requirements and returns real providers within 30 km without inventing listings.
            </p>
            <button
              onClick={onOpenAiModal}
              className="px-6 py-3.5 rounded-2xl bg-red-600 hover:bg-white hover:text-black text-white font-black text-xs shadow-md transition flex items-center gap-2"
            >
              <span>{t('askAiPrompt')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="hidden lg:block absolute -right-10 -bottom-10 w-80 h-80 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />
        </div>
      </section>

      {/* 5. Featured & Top Rated Businesses */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
              {t('featuredTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1 font-medium">
              {t('featuredSubtitle')}
            </p>
          </div>
          <Link
            to="/search"
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-red-600 hover:text-black transition shrink-0"
          >
            Browse All 760 Providers (All 38 Districts)
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <SkeletonCard key={n} />
            ))}
          </div>
        ) : featuredBusinesses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredBusinesses.map((biz) => (
              <BusinessCard key={biz.id} business={biz} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No businesses found in database"
            description="Start by registering a business or seeding initial data."
            actionLabel="List Your Business"
            onAction={() => navigate('/register-business')}
          />
        )}
      </section>

      {/* 6. Business Owner Callout (Black & Red) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-black text-white rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 border border-neutral-800">
          <div className="max-w-xl space-y-3">
            <span className="text-xs font-black uppercase tracking-wider text-red-500">
              For Providers & Shop Owners
            </span>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
              {t('businessCtaTitle')}
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-medium">
              {t('businessCtaSubtitle')}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
            <Link
              to="/register-business"
              className="text-center px-6 py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-xs shadow-md transition"
            >
              {t('registerYourBusiness')}
            </Link>
            <Link
              to="/claim-business"
              className="text-center px-6 py-3.5 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs border border-neutral-700 transition"
            >
              {t('claimExistingBusiness')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
