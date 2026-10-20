import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { 
  Search as SearchIcon, Filter, X, SlidersHorizontal, 
  LayoutGrid, List, Sparkles, MapPin, Check, ArrowUpDown,
  Map as MapIcon, Compass
} from 'lucide-react'
import { BusinessCard } from '@/components/common/BusinessCard'
import { SkeletonCard } from '@/components/common/SkeletonCard'
import { EmptyState } from '@/components/common/EmptyState'
import { TamilNaduMap } from '@/components/TamilNaduMap'
import { useLanguage } from '@/context/LanguageContext'
import { getCategories, searchBusinesses } from '@/services/businessService'
import { TAMIL_NADU_LOCATIONS, resolveLocation } from '@/data/tamilNaduLocations'
import { LocationAutocomplete } from '@/components/common/LocationAutocomplete'

export function SearchPage({ onOpenAiModal }) {
  const { t, language } = useLanguage()
  const [searchParams, setSearchParams] = useSearchParams()

  const [categories, setCategories] = useState([])
  const [businesses, setBusinesses] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState('grid') // 'grid' | 'list' | 'map'
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)

  // Filter states
  const queryParam = searchParams.get('q') || ''
  const categoryParam = searchParams.get('category') || ''
  const localityParam = searchParams.get('locality') || ''
  const verifiedOnlyParam = searchParams.get('verified') === 'true'
  const bookingOnlyParam = searchParams.get('booking') === 'true'
  const minRatingParam = searchParams.get('rating') ? Number(searchParams.get('rating')) : null
  const maxPriceParam = searchParams.get('max_price') ? Number(searchParams.get('max_price')) : null
  const sortByParam = searchParams.get('sort') || 'relevance'

  // Match active location object with full alias support (e.g. sivagangai -> Sivaganga, karaikudi -> Karaikudi)
  const activeLocationObj = resolveLocation(localityParam)

  // Fetch categories once
  useEffect(() => {
    async function fetchCats() {
      const cats = await getCategories()
      setCategories(cats)
    }
    fetchCats()
  }, [])

  // Execute database search whenever filters update
  useEffect(() => {
    async function executeSearch() {
      setLoading(true)
      try {
        const results = await searchBusinesses({
          query: queryParam,
          categorySlug: categoryParam,
          locality: localityParam,
          centerLat: activeLocationObj?.lat || null,
          centerLng: activeLocationObj?.lng || null,
          radiusKm: 30,
          maxPrice: maxPriceParam,
          minRating: minRatingParam,
          bookingOnly: bookingOnlyParam,
          verifiedOnly: verifiedOnlyParam,
          sortBy: sortByParam,
          limit: 760,
        })
        setBusinesses(results)
      } catch (err) {
        console.error('Search error:', err)
      } finally {
        setLoading(false)
      }
    }
    executeSearch()
  }, [
    queryParam, categoryParam, localityParam, 
    verifiedOnlyParam, bookingOnlyParam, minRatingParam, 
    maxPriceParam, sortByParam, activeLocationObj
  ])

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams)
    if (value === null || value === '' || value === false) {
      newParams.delete(key)
    } else {
      newParams.set(key, value.toString())
    }
    setSearchParams(newParams)
  }

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams())
  }

  const hasActiveFilters = Boolean(
    categoryParam || localityParam || verifiedOnlyParam || 
    bookingOnlyParam || minRatingParam || maxPriceParam
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Search Bar & Controls */}
      <div className="flex flex-col md:flex-row items-center gap-3 bg-white p-3.5 rounded-2xl border border-neutral-200 shadow-sm">
        {/* Search input */}
        <div className="relative flex-1 w-full flex items-center">
          <SearchIcon className="w-4 h-4 text-neutral-400 absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            value={queryParam}
            onChange={(e) => updateFilter('q', e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-300 text-xs font-semibold focus:border-red-600 outline-none"
          />
        </div>

        {/* Tamil Nadu Locations Typeahead */}
        <div className="w-full md:w-64">
          <LocationAutocomplete
            value={localityParam}
            placeholder="Filter town/district..."
            onChange={(val) => updateFilter('locality', val)}
            onSelect={(loc) => {
              if (loc) {
                updateFilter('locality', loc.name)
              } else {
                updateFilter('locality', '')
              }
            }}
          />
        </div>

        {/* Sort Select */}
        <div className="w-full md:w-44">
          <select
            value={sortByParam}
            onChange={(e) => updateFilter('sort', e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-neutral-300 text-xs font-bold text-neutral-800 outline-none"
          >
            <option value="relevance">{t('sortRelevance')}</option>
            <option value="rating">{t('sortRating')}</option>
            <option value="reviews">{t('sortReviews')}</option>
            <option value="price_asc">{t('sortPriceLowHigh')}</option>
            <option value="price_desc">{t('sortPriceHighLow')}</option>
          </select>
        </div>

        {/* AI Helper trigger */}
        <button
          onClick={onOpenAiModal}
          className="w-full md:w-auto px-4 py-2.5 rounded-xl bg-red-600 text-white hover:bg-black font-black text-xs flex items-center justify-center gap-1.5 transition shrink-0 shadow-sm"
        >
          <Sparkles className="w-4 h-4" />
          <span>AI Assist</span>
        </button>

        {/* View Toggle: Grid, List, Map (Mobile Friendly) */}
        <div className="flex items-center justify-center w-full sm:w-auto gap-1 border-t sm:border-t-0 sm:border-l border-neutral-200 pt-2 sm:pt-0 sm:pl-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`flex-1 sm:flex-initial px-3 py-2 rounded-lg transition text-xs font-bold flex items-center justify-center gap-1 ${
              viewMode === 'grid' ? 'bg-black text-white' : 'text-neutral-500 hover:text-black bg-neutral-50 sm:bg-transparent'
            }`}
            title="Grid View"
          >
            <LayoutGrid className="w-4 h-4" />
            <span className="sm:hidden">Grid</span>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`flex-1 sm:flex-initial px-3 py-2 rounded-lg transition text-xs font-bold flex items-center justify-center gap-1 ${
              viewMode === 'list' ? 'bg-black text-white' : 'text-neutral-500 hover:text-black bg-neutral-50 sm:bg-transparent'
            }`}
            title="List View"
          >
            <List className="w-4 h-4" />
            <span className="sm:hidden">List</span>
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`flex-1 sm:flex-initial px-3 py-2 rounded-lg transition flex items-center justify-center gap-1 text-xs font-bold ${
              viewMode === 'map' ? 'bg-red-600 text-white' : 'text-neutral-500 hover:text-black bg-neutral-50 sm:bg-transparent'
            }`}
            title="Map View (30 km Radius)"
          >
            <MapIcon className="w-4 h-4" />
            <span>Map</span>
          </button>
        </div>

        {/* Mobile filter toggle */}
        <button
          onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
          className="md:hidden w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-neutral-100 text-xs font-bold text-neutral-800"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>{t('filtersHeading')}</span>
        </button>
      </div>

      {/* Radius Banner if Locality is selected */}
      {localityParam && (
        <div className="p-3 bg-red-50/70 border border-red-200 rounded-2xl flex items-center justify-between text-xs text-red-950">
          <div className="flex items-center gap-2 font-medium">
            <Compass className="w-4 h-4 text-red-600 shrink-0" />
            <span>
              Showing services within <strong className="text-red-700">30 km radius</strong> of <strong>{localityParam}</strong> across Tamil Nadu.
            </span>
          </div>
          <button
            onClick={() => updateFilter('locality', null)}
            className="text-xs font-bold text-red-600 hover:underline shrink-0 ml-2"
          >
            Reset Location
          </button>
        </div>
      )}

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-neutral-400 uppercase">Active:</span>
          {categoryParam && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 text-xs font-bold">
              Category: {categoryParam}
              <X className="w-3.5 h-3.5 cursor-pointer" onClick={() => updateFilter('category', null)} />
            </span>
          )}
          {localityParam && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black text-white text-xs font-bold">
              District: {localityParam} (30km)
              <X className="w-3.5 h-3.5 cursor-pointer" onClick={() => updateFilter('locality', null)} />
            </span>
          )}
          {verifiedOnlyParam && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-800 border border-neutral-300 text-xs font-semibold">
              Verified Only
              <X className="w-3.5 h-3.5 cursor-pointer" onClick={() => updateFilter('verified', null)} />
            </span>
          )}
          {bookingOnlyParam && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 text-xs font-semibold">
              Booking Available
              <X className="w-3.5 h-3.5 cursor-pointer" onClick={() => updateFilter('booking', null)} />
            </span>
          )}
          {minRatingParam && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-900 border border-neutral-300 text-xs font-semibold">
              Rating ≥ {minRatingParam}★
              <X className="w-3.5 h-3.5 cursor-pointer" onClick={() => updateFilter('rating', null)} />
            </span>
          )}
          <button
            onClick={clearAllFilters}
            className="text-xs font-bold text-red-600 hover:underline ml-2"
          >
            {t('clearAll')}
          </button>
        </div>
      )}

      {/* Main Grid: Sidebar Filters + Result Stream */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <aside
          className={`space-y-6 md:block ${
            mobileFilterOpen ? 'block' : 'hidden md:block'
          } bg-white p-5 rounded-2xl border border-neutral-200 shadow-soft h-fit`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
            <h3 className="text-sm font-black text-black flex items-center gap-2">
              <Filter className="w-4 h-4 text-red-600" />
              {t('filtersHeading')}
            </h3>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-[11px] font-bold text-red-600 hover:underline"
              >
                {t('clearAll')}
              </button>
            )}
          </div>

          {/* Category List */}
          <div>
            <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-2">
              {t('categoryFilter')}
            </label>
            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              <button
                type="button"
                onClick={() => updateFilter('category', null)}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-bold transition ${
                  !categoryParam ? 'bg-red-600 text-white' : 'text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                All 20 Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => updateFilter('category', cat.slug)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition line-clamp-1 ${
                    categoryParam === cat.slug
                      ? 'bg-red-600 text-white font-bold'
                      : 'text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  {language === 'ta' && cat.name_ta ? cat.name_ta : cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Rating filter */}
          <div>
            <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-2">
              {t('ratingFilter')}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[4.5, 4.0, 3.5].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => updateFilter('rating', minRatingParam === val ? null : val)}
                  className={`py-1.5 px-2 rounded-xl border text-xs font-bold text-center transition ${
                    minRatingParam === val
                      ? 'border-red-600 bg-red-600 text-white'
                      : 'border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  {val}★+
                </button>
              ))}
            </div>
          </div>

          {/* Quick Checkbox toggles */}
          <div className="space-y-3 pt-3 border-t border-neutral-100">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-neutral-800">
              <input
                type="checkbox"
                checked={verifiedOnlyParam}
                onChange={(e) => updateFilter('verified', e.target.checked)}
                className="rounded border-neutral-300 text-red-600 focus:ring-red-600 w-4 h-4"
              />
              <span>{t('verifiedOnly')}</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-neutral-800">
              <input
                type="checkbox"
                checked={bookingOnlyParam}
                onChange={(e) => updateFilter('booking', e.target.checked)}
                className="rounded border-neutral-300 text-red-600 focus:ring-red-600 w-4 h-4"
              />
              <span>{t('bookingEnabledOnly')}</span>
            </label>
          </div>
        </aside>

        {/* Results Stream / Map View */}
        <main className="md:col-span-3 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-black">
              {loading ? 'Searching providers across Tamil Nadu...' : `${businesses.length} service providers found`}
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode(viewMode === 'map' ? 'grid' : 'map')}
                className="text-xs font-bold text-red-600 hover:text-black flex items-center gap-1"
              >
                <MapIcon className="w-3.5 h-3.5 text-red-600" />
                {viewMode === 'map' ? 'Switch to Grid View' : 'Switch to Tamil Nadu Map'}
              </button>
            </div>
          </div>

          {/* Interactive Map View */}
          {viewMode === 'map' && (
            <div className="space-y-4">
              <TamilNaduMap
                providers={businesses}
                selectedLocation={activeLocationObj}
                onSelectMapLocation={(lat, lng) => {
                  updateFilter('locality', `Location (${lat.toFixed(2)}, ${lng.toFixed(2)})`)
                }}
                height="520px"
                radiusKm={30}
              />
              <p className="text-xs text-neutral-500 italic">
                * Click on any marker to view services, fee estimates, and book directly.
              </p>
            </div>
          )}

          {/* Grid / List Results */}
          {viewMode !== 'map' && (
            <>
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <SkeletonCard key={n} />
                  ))}
                </div>
              ) : businesses.length > 0 ? (
                <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'flex flex-col gap-4'}>
                  {businesses.map((biz) => (
                    <BusinessCard key={biz.id} business={biz} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  title={t('noBusinessesFound')}
                  description="No service providers found within 30 km of your selected search criteria. Try choosing another Tamil Nadu district or clearing filters."
                  actionLabel="Reset Search Filters"
                  onAction={clearAllFilters}
                />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
}
