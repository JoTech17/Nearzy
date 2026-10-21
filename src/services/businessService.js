// Nearzy Business, Service & Booking Data Layer
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient'
import {
  INITIAL_CATEGORIES,
  INITIAL_BUSINESSES,
  INITIAL_REVIEWS,
  INITIAL_BOOKINGS,
} from '@/data/mockData'
import {
  TAMIL_NADU_LOCATIONS,
  resolveLocation,
  calculateDistanceKm,
  filterProvidersWithinRadius,
} from '@/data/tamilNaduLocations'

// Local storage keys for caching and offline state
const BIZ_KEY = 'nearzy_businesses_v2_store'
const REVIEWS_KEY = 'nearzy_reviews_v2_store'
const BOOKINGS_KEY = 'nearzy_bookings_v2_store'
const CLAIMS_KEY = 'nearzy_claims_store'
const FAVORITES_KEY = 'nearzy_favorites_store'
const REPORTS_KEY = 'nearzy_reports_store'

function getStored(key, fallback) {
  try {
    if (typeof localStorage === 'undefined') return fallback
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : fallback
  } catch {
    return fallback
  }
}

function setStored(key, value) {
  try {
    if (typeof localStorage === 'undefined') return
    localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    // Ignore storage write errors
  }
}

function getCatalogBusinesses() {
  let stored = getStored(BIZ_KEY, null)
  if (!stored || !Array.isArray(stored) || stored.length < 500) {
    stored = INITIAL_BUSINESSES
    setStored(BIZ_KEY, INITIAL_BUSINESSES)
  }
  return stored
}

// 1. Categories
export async function getCategories() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true })

      if (!error && data?.length) return data
    } catch (err) {
      console.warn('Falling back to local categories:', err)
    }
  }
  return INITIAL_CATEGORIES
}

// 2. Businesses - Search & Filters with 30km Tamil Nadu Radius Support
export async function searchBusinesses({
  query = '',
  categorySlug = '',
  locality = '',
  centerLat = null,
  centerLng = null,
  radiusKm = 30,
  maxPrice = null,
  minRating = null,
  openNow = false,
  bookingOnly = false,
  verifiedOnly = false,
  sortBy = 'relevance',
  limit = 100,
}) {
  let results = []

  let supabaseBusinesses = []

  if (isSupabaseConfigured && supabase) {
    try {
      let q = supabase
        .from('businesses')
        .select(`
          *,
          category:categories(id, name, name_ta, slug, icon),
          services(*),
          opening_hours(*)
        `)
        .eq('listing_status', 'active')

      if (categorySlug) {
        // Find category
        const { data: cat } = await supabase
          .from('categories')
          .select('id')
          .eq('slug', categorySlug)
          .single()
        if (cat) q = q.eq('category_id', cat.id)
      }

      if (locality) {
        q = q.or(`locality.ilike.%${locality}%,city.ilike.%${locality}%,address.ilike.%${locality}%`)
      }

      if (query) {
        q = q.or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      }

      if (verifiedOnly) {
        q = q.eq('is_verified', true)
      }

      if (minRating) {
        q = q.gte('rating', minRating)
      }

      if (maxPrice) {
        q = q.lte('min_price', maxPrice)
      }

      const { data, error } = await q.limit(limit)
      if (!error && data && data.length > 0) {
        supabaseBusinesses = data.map(b => ({
          ...b,
          categoryId: b.category_id,
          categorySlug: b.category?.slug,
          categoryName: b.category?.name,
          categoryNameTa: b.category?.name_ta,
          categoryIcon: b.category?.icon,
          isVerified: b.is_verified,
          minPrice: b.min_price,
          coverImage: b.cover_image,
          reviewCount: b.review_count,
        }))
      }
    } catch (err) {
      console.warn('Supabase query notice, falling back to statewide catalog:', err)
    }
  }

  // Full statewide catalog (all 760 distributed businesses across all 38 districts)
  const stored = getCatalogBusinesses()

  // Merge: Supabase records come first, followed by catalog records (deduplicated by slug)
  const seenSlugs = new Set(supabaseBusinesses.map(b => b.slug))
  const merged = [...supabaseBusinesses]
  for (const b of stored) {
    if (!seenSlugs.has(b.slug)) {
      merged.push(b)
    }
  }

  results = merged

  // Filter by query (name, category, services)
  if (query) {
    const qLower = query.toLowerCase().trim()
    results = results.filter(b => 
      b.name.toLowerCase().includes(qLower) ||
      (b.nameTa && b.nameTa.toLowerCase().includes(qLower)) ||
      b.categoryName.toLowerCase().includes(qLower) ||
      (b.categoryNameTa && b.categoryNameTa.toLowerCase().includes(qLower)) ||
      b.description.toLowerCase().includes(qLower) ||
      b.services?.some(s => s.name.toLowerCase().includes(qLower))
    )
  }

  // Category filter
  if (categorySlug) {
    results = results.filter(b => b.categorySlug === categorySlug)
  }

  // Locality & 30 km Radius Filter
  let targetLat = centerLat
  let targetLng = centerLng

  if ((!targetLat || !targetLng) && locality) {
    const matchedLoc = resolveLocation(locality)
    if (matchedLoc) {
      targetLat = matchedLoc.lat
      targetLng = matchedLoc.lng
    }
  }

  if (targetLat && targetLng) {
    // Calculate distance for all providers
    results = results.map(b => ({
      ...b,
      distanceKm: calculateDistanceKm(targetLat, targetLng, b.latitude, b.longitude)
    }))

    // Filter within 30km radius
    const withinRadius = results.filter(b => b.distanceKm <= radiusKm)
    if (withinRadius.length > 0) {
      results = withinRadius
    } else {
      // Fallback: take closest providers up to 45km
      results.sort((a, b) => a.distanceKm - b.distanceKm)
      results = results.slice(0, 15)
    }

    // Always sort by closest distance
    results.sort((a, b) => a.distanceKm - b.distanceKm)
    results = results.slice(0, 20)
  } else if (locality) {
    const locLower = locality.toLowerCase().trim()
    const filtered = results.filter(b => 
      b.locality?.toLowerCase().includes(locLower) || 
      b.city?.toLowerCase().includes(locLower) ||
      b.district?.toLowerCase()?.includes(locLower)
    )
    if (filtered.length > 0) {
      results = filtered.slice(0, 20)
    }
  }

  // Verified only
  if (verifiedOnly) {
    results = results.filter(b => b.isVerified)
  }

  // Min rating
  if (minRating) {
    results = results.filter(b => (b.rating || 0) >= minRating)
  }

  // Max price
  if (maxPrice) {
    results = results.filter(b => (b.minPrice || 0) <= maxPrice)
  }

  // Booking enabled only
  if (bookingOnly) {
    results = results.filter(b => b.services?.some(s => s.bookingEnabled))
  }

  // Sorting
  if (targetLat && targetLng && (sortBy === 'distance' || sortBy === 'relevance' || sortBy === 'rating')) {
    // Proximity first, tie-break by rating
    results.sort((a, b) => {
      const distDiff = (a.distanceKm || 0) - (b.distanceKm || 0)
      if (Math.abs(distDiff) > 3) return distDiff
      return (b.rating || 0) - (a.rating || 0)
    })
  } else if (sortBy === 'rating') {
    results.sort((a, b) => (b.rating || 0) - (a.rating || 0))
  } else if (sortBy === 'reviews') {
    results.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0))
  } else if (sortBy === 'price_asc') {
    results.sort((a, b) => (a.minPrice || 0) - (b.minPrice || 0))
  } else if (sortBy === 'price_desc') {
    results.sort((a, b) => (b.minPrice || 0) - (a.minPrice || 0))
  } else {
    // Default relevance
    results.sort((a, b) => ((b.rating || 0) * (b.reviewCount || 1)) - ((a.rating || 0) * (a.reviewCount || 1)))
  }

  return results.slice(0, limit)
}

// 3. Get Single Business By Slug
export async function getBusinessBySlug(slug) {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select(`
          *,
          category:categories(id, name, name_ta, slug, icon),
          services(*),
          opening_hours(*)
        `)
        .eq('slug', slug)
        .single()

      if (!error && data) {
        return {
          ...data,
          categoryId: data.category_id,
          categorySlug: data.category?.slug,
          categoryName: data.category?.name,
          categoryNameTa: data.category?.name_ta,
          categoryIcon: data.category?.icon,
          isVerified: data.is_verified,
          minPrice: data.min_price,
          coverImage: data.cover_image,
          reviewCount: data.review_count,
        }
      }
    } catch (err) {
      console.warn('Error fetching business by slug:', err)
    }
  }

  const businesses = getCatalogBusinesses()
  return businesses.find(b => b.slug === slug) || null
}

// 3b. Get Business By ID
export async function getBusinessById(id) {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select(`
          *,
          category:categories(id, name, name_ta, slug, icon),
          services(*),
          opening_hours(*)
        `)
        .eq('id', id)
        .single()

      if (!error && data) {
        return {
          ...data,
          categoryId: data.category_id,
          categorySlug: data.category?.slug,
          categoryName: data.category?.name,
          categoryNameTa: data.category?.name_ta,
          categoryIcon: data.category?.icon,
          isVerified: data.is_verified,
          minPrice: data.min_price,
          coverImage: data.cover_image,
          reviewCount: data.review_count,
        }
      }
    } catch (err) {
      console.warn('Error fetching business by id:', err)
    }
  }

  const businesses = getCatalogBusinesses()
  return businesses.find(b => b.id === id) || null
}

// 4. Create Business (Enforces 1 Business Per Account)
export async function createBusiness(businessData) {
  if (businessData.ownerId) {
    const existing = await getOwnerBusiness(businessData.ownerId)
    if (existing) {
      throw new Error('Each account can only register one business. You already have an active business listing.')
    }
  }

  const businesses = getCatalogBusinesses()
  const slug = (businessData.name || 'service')
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-') + '-' + Math.random().toString(36).substring(2, 6)

  // Resolve latitude & longitude accurately
  let latitude = Number(businessData.latitude)
  let longitude = Number(businessData.longitude)
  if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) {
    const locMatch = resolveLocation(businessData.locality || businessData.city)
    if (locMatch) {
      latitude = locMatch.lat
      longitude = locMatch.lng
    } else {
      latitude = 13.0827
      longitude = 80.2707
    }
  }

  const newBusiness = {
    ...businessData,
    id: 'b_' + Date.now(),
    slug,
    ownerId: businessData.ownerId || null,
    rating: null, // New business starts with no fake rating or reviews
    reviewCount: 0,
    isVerified: false,
    isClaimed: true,
    listingStatus: 'active',
    latitude,
    longitude,
    createdAt: new Date().toISOString(),
  }

  businesses.unshift(newBusiness)
  setStored(BIZ_KEY, businesses)

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('businesses').insert({
        name: businessData.name,
        slug,
        category_id: businessData.categoryId,
        description: businessData.description,
        address: businessData.address,
        locality: businessData.locality,
        city: businessData.city || 'Tamil Nadu',
        latitude,
        longitude,
        phone: businessData.phone,
        email: businessData.email,
        website: businessData.website,
        cover_image: businessData.coverImage,
        min_price: businessData.minPrice || 0,
        owner_id: businessData.ownerId || null,
      })
    } catch (err) {
      console.error('Supabase business insert failed:', err)
    }
  }

  return newBusiness
}

// 4b. Update Business (for Shop Owner edit details)
export async function updateBusiness(id, updatedFields) {
  const businesses = getCatalogBusinesses()
  const index = businesses.findIndex(b => b.id === id)
  if (index !== -1) {
    let latitude = updatedFields.latitude !== undefined ? Number(updatedFields.latitude) : businesses[index].latitude
    let longitude = updatedFields.longitude !== undefined ? Number(updatedFields.longitude) : businesses[index].longitude

    if (updatedFields.locality && (!updatedFields.latitude || !updatedFields.longitude)) {
      const locMatch = resolveLocation(updatedFields.locality)
      if (locMatch) {
        latitude = locMatch.lat
        longitude = locMatch.lng
      }
    }

    businesses[index] = {
      ...businesses[index],
      ...updatedFields,
      latitude,
      longitude,
      updatedAt: new Date().toISOString(),
    }
    setStored(BIZ_KEY, businesses)

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('businesses')
          .update(updatedFields)
          .eq('id', id)
      } catch (err) {
        console.warn('Supabase business update failed:', err)
      }
    }

    return businesses[index]
  }
  return null
}

// 4c. Get Owner Business strictly isolated per login
export async function getOwnerBusiness(userId, businessId = null) {
  if (!userId && !businessId) return null

  // 1. If Supabase is configured, check database first
  if (isSupabaseConfigured && supabase && userId) {
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select(`
          *,
          category:categories(id, name, name_ta, slug, icon),
          services(*),
          opening_hours(*)
        `)
        .eq('owner_id', userId)
        .limit(1)

      if (!error && data && data.length > 0) {
        const b = data[0]
        return {
          ...b,
          categoryId: b.category_id,
          categorySlug: b.category?.slug,
          categoryName: b.category?.name,
          categoryNameTa: b.category?.name_ta,
          categoryIcon: b.category?.icon,
          isVerified: b.is_verified,
          minPrice: b.min_price,
          coverImage: b.cover_image,
          reviewCount: b.review_count,
        }
      }
    } catch (err) {
      console.warn('Supabase getOwnerBusiness notice:', err)
    }
  }

  // 2. Local storage check
  const businesses = getCatalogBusinesses()

  // Check explicit businessId
  if (businessId) {
    const matched = businesses.find(b => b.id === businessId)
    if (matched) return matched
  }

  // Check ownerId
  if (userId) {
    const owned = businesses.find(b => b.ownerId === userId)
    if (owned) return owned
  }

  return null
}

// 5. Claim Business Workflow
export async function submitBusinessClaim({
  businessId,
  claimantUserId,
  claimantName,
  claimantPhone,
  evidenceText,
  documentUrls = [],
}) {
  const claims = getStored(CLAIMS_KEY, [
    {
      id: 'claim-001',
      businessId: 'b0000001-0000-0000-0000-000000000005',
      businessName: 'OMR iTech Laptop & Mobile Hospital',
      claimantUserId: 'u99',
      claimantName: 'Ramesh Sundar',
      claimantPhone: '+91 90030 11223',
      evidenceText: 'I am the founding proprietor of OMR iTech. Attached GST certificate and Tamil Nadu shop act license.',
      status: 'pending',
      createdAt: '2026-10-17T12:00:00Z',
    }
  ])

  const businesses = getCatalogBusinesses()
  const biz = businesses.find(b => b.id === businessId)

  const newClaim = {
    id: 'claim_' + Date.now(),
    businessId,
    businessName: biz?.name || 'Local Business',
    claimantUserId,
    claimantName,
    claimantPhone,
    evidenceText,
    documentUrls,
    status: 'pending',
    createdAt: new Date().toISOString(),
  }

  claims.unshift(newClaim)
  setStored(CLAIMS_KEY, claims)

  return newClaim
}

export async function getBusinessClaims() {
  return getStored(CLAIMS_KEY, [
    {
      id: 'claim-001',
      businessId: 'b0000001-0000-0000-0000-000000000005',
      businessName: 'OMR iTech Laptop & Mobile Hospital',
      claimantUserId: 'u99',
      claimantName: 'Ramesh Sundar',
      claimantPhone: '+91 90030 11223',
      evidenceText: 'I am the founding proprietor of OMR iTech. Attached GST certificate and Tamil Nadu shop act license.',
      status: 'pending',
      createdAt: '2026-10-17T12:00:00Z',
    }
  ])
}

export async function reviewBusinessClaim(claimId, status, reviewerNotes = '') {
  const claims = getStored(CLAIMS_KEY, [])
  const claimIndex = claims.findIndex(c => c.id === claimId)
  if (claimIndex !== -1) {
    claims[claimIndex].status = status
    claims[claimIndex].reviewerNotes = reviewerNotes
    claims[claimIndex].reviewedAt = new Date().toISOString()
    setStored(CLAIMS_KEY, claims)

    // If approved, mark business as claimed and verified
    if (status === 'approved') {
      const businesses = getCatalogBusinesses()
      const bizIndex = businesses.findIndex(b => b.id === claims[claimIndex].businessId)
      if (bizIndex !== -1) {
        businesses[bizIndex].isClaimed = true
        businesses[bizIndex].isVerified = true
        setStored(BIZ_KEY, businesses)
      }
    }
  }
  return true
}

// 6. Reviews & Ratings
export async function getBusinessReviews(businessId) {
  const reviews = getStored(REVIEWS_KEY, INITIAL_REVIEWS)
  return reviews.filter(r => r.businessId === businessId)
}

export async function createReview({
  businessId,
  customerName,
  rating,
  comment,
  bookingId = null,
}) {
  const reviews = getStored(REVIEWS_KEY, INITIAL_REVIEWS)
  const newReview = {
    id: 'rev_' + Date.now(),
    businessId,
    customerName,
    rating: Number(rating),
    comment,
    bookingId,
    createdAt: new Date().toISOString(),
    ownerResponse: null,
  }

  reviews.unshift(newReview)
  setStored(REVIEWS_KEY, reviews)

  // Recalculate business rating
  const businesses = getCatalogBusinesses()
  const bizIndex = businesses.findIndex(b => b.id === businessId)
  if (bizIndex !== -1) {
    const bizReviews = reviews.filter(r => r.businessId === businessId)
    const avg = bizReviews.reduce((acc, curr) => acc + curr.rating, 0) / bizReviews.length
    businesses[bizIndex].rating = Number(avg.toFixed(1))
    businesses[bizIndex].reviewCount = bizReviews.length
    setStored(BIZ_KEY, businesses)
  }

  return newReview
}

export async function respondToReview(reviewId, responseText) {
  const reviews = getStored(REVIEWS_KEY, INITIAL_REVIEWS)
  const rev = reviews.find(r => r.id === reviewId)
  if (rev) {
    rev.ownerResponse = responseText
    rev.ownerRespondedAt = new Date().toISOString()
    setStored(REVIEWS_KEY, reviews)
  }
  return true
}

// 7. Bookings Management
export async function createBooking(bookingData) {
  const bookings = getStored(BOOKINGS_KEY, INITIAL_BOOKINGS)
  const newBooking = {
    ...bookingData,
    id: 'bk_' + Date.now().toString().slice(-6),
    status: 'pending',
    createdAt: new Date().toISOString(),
  }

  bookings.unshift(newBooking)
  setStored(BOOKINGS_KEY, bookings)
  return newBooking
}

export async function getCustomerBookings(customerId) {
  const bookings = getStored(BOOKINGS_KEY, INITIAL_BOOKINGS)
  return bookings.filter(b => b.customerId === customerId || b.customerPhone === customerId)
}

export async function getOwnerBookings(businessId) {
  const bookings = getStored(BOOKINGS_KEY, INITIAL_BOOKINGS)
  if (!businessId) return []
  return bookings.filter(b => b.businessId === businessId)
}

export async function updateBookingStatus(bookingId, status, reason = '') {
  const bookings = getStored(BOOKINGS_KEY, INITIAL_BOOKINGS)
  const bk = bookings.find(b => b.id === bookingId)
  if (bk) {
    bk.status = status
    if (reason) bk.cancellationReason = reason
    bk.updatedAt = new Date().toISOString()
    setStored(BOOKINGS_KEY, bookings)
  }
  return bk
}

// 8. Favorites
export async function toggleFavorite(userId, businessId) {
  const favorites = getStored(FAVORITES_KEY, ['b0000001-0000-0000-0000-000000000001'])
  let updated
  if (favorites.includes(businessId)) {
    updated = favorites.filter(id => id !== businessId)
  } else {
    updated = [...favorites, businessId]
  }
  setStored(FAVORITES_KEY, updated)
  return updated.includes(businessId)
}

export async function getFavoriteBusinessIds(userId) {
  return getStored(FAVORITES_KEY, ['b0000001-0000-0000-0000-000000000001'])
}

// 9. Reports & Complaints
export async function submitReport({
  reporterId,
  businessId = null,
  reviewId = null,
  reason,
  description,
}) {
  const reports = getStored(REPORTS_KEY, [])
  const newReport = {
    id: 'rep_' + Date.now(),
    reporterId,
    businessId,
    reviewId,
    reason,
    description,
    status: 'pending',
    createdAt: new Date().toISOString(),
  }
  reports.unshift(newReport)
  setStored(REPORTS_KEY, reports)
  return newReport
}

export async function getReports() {
  return getStored(REPORTS_KEY, [
    {
      id: 'rep-01',
      businessId: 'b0000001-0000-0000-0000-000000000005',
      businessName: 'OMR iTech Laptop & Mobile Hospital',
      reason: 'Incorrect phone number listed',
      description: 'The phone number connects to a private residence instead of the service desk.',
      status: 'pending',
      createdAt: '2026-10-16T14:20:00Z',
    }
  ])
}

export async function resolveReport(reportId, resolutionNotes) {
  const reports = getStored(REPORTS_KEY, [])
  const rep = reports.find(r => r.id === reportId)
  if (rep) {
    rep.status = 'resolved'
    rep.resolutionNotes = resolutionNotes
    rep.resolvedAt = new Date().toISOString()
    setStored(REPORTS_KEY, reports)
  }
  return true
}
