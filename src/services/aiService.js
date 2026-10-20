// Nearzy AI Assistant Service
// Natural language search interpretation, platform knowledge & real-database recommendation engine
import { isSupabaseConfigured, supabase } from '@/lib/supabaseClient'
import { searchBusinesses } from '@/services/businessService'
import { TAMIL_NADU_LOCATIONS, resolveLocation, filterProvidersWithinRadius } from '@/data/tamilNaduLocations'

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || ''
const CANDIDATE_MODELS = [
  import.meta.env.VITE_GEMINI_MODEL || 'gemini-3.5-flash',
  'gemini-flash-lite-latest',
  'gemini-3-flash-preview',
  'gemini-3.8-flash'
]

/**
 * Platform Knowledge Engine - Answers general questions about Nearzy,
 * services, business registration, booking process, contact, and safety.
 */
function checkPlatformKnowledge(userQuery, language = 'en') {
  const q = (userQuery || '').toLowerCase().trim()
  const isTa = language === 'ta' || /[\u0B80-\u0BFF]/.test(userQuery)

  // 1. What is Nearzy / About Platform
  if (
    q.includes('what is nearzy') || 
    q.includes('about nearzy') || 
    q.includes('who are you') || 
    q.includes('tell me about nearzy') || 
    q.includes('what is this website') ||
    q.includes('how does nearzy work') ||
    q.includes('பற்றி') ||
    q.includes('என்ன இணையதளம்')
  ) {
    return {
      isKnowledge: true,
      title: isTa ? 'Nearzy பற்றி' : 'About Nearzy',
      explanation: isTa
        ? 'Nearzy ("உங்க ஊரு, உங்க சேவை!") என்பது தமிழ்நாட்டின் அனைத்து 38 மாவட்டங்களிலும் உள்ளூர் சேவைகளையும் கடைகளையும் இணைக்கும் நம்பகமான தளமாகும். பிளம்பிங், எலக்ட்ரீசியன், மெக்கானிக் முதல் 20 அத்தியாவசிய பிரிவுகளில் சரிபார்க்கப்பட்ட நிபுணர்களை 30 கி.மீ சுற்றளவில் கண்டறிந்து முன்பதிவு செய்யலாம்.'
        : 'Nearzy ("Unga Ooru, Unga Service!") is Tamil Nadu\'s premier hyper-local service marketplace spanning all 38 districts. We connect residents directly with 760+ verified local professionals across 20 categories within a 30 km radius—featuring upfront pricing, doorstep arrival, and authentic ratings.',
      links: [
        { label: isTa ? 'சேவை பிரிவுகள்' : 'Explore Categories', path: '/categories' },
        { label: isTa ? 'வணிகத்தை பதிவு செய்' : 'Register Your Business', path: '/register-business' }
      ]
    }
  }

  // 2. Business Registration / How to Add Shop / Partner
  if (
    q.includes('register business') || 
    q.includes('register my shop') || 
    q.includes('add my shop') || 
    q.includes('list business') || 
    q.includes('list service') || 
    q.includes('become a provider') ||
    q.includes('join as partner') ||
    q.includes('கடை பதிவு') ||
    q.includes('வணிக பதிவு')
  ) {
    return {
      isKnowledge: true,
      title: isTa ? 'Nearzy-யில் வணிகத்தை பதிவு செய்வது எப்படி?' : 'How to Register Your Business on Nearzy',
      explanation: isTa
        ? 'உங்கள் கடை அல்லது சேவையை Nearzy-யில் பதிவு செய்வது மிகவும் சுலபம்:\n1. மேலே உள்ள "வணிகத்தை பதிவு செய்" பொத்தானை கிளிக் செய்யவும்.\n2. சேவை வழங்குநர் கணக்கில் உள்நுழையவும்.\n3. தமிழ்நாடு ஊடாடும் வரைபடத்தில் (Map) உங்கள் கடை இருப்பிடத்தை தேர்வு செய்யவும்.\n4. உங்கள் சேவை விவரங்கள் மற்றும் கட்டணங்களை உள்ளிட்டு சேமிக்கவும். உங்கள் வணிகம் உடனே 30 கி.மீ சுற்றளவில் உள்ள வாடிக்கையாளர்களுக்கு காட்டப்படும்!'
        : 'Listing your shop or freelance service on Nearzy takes under 2 minutes:\n1. Click "List Business" on the top navigation bar.\n2. Create or sign in to your Service Partner account.\n3. Pinpoint your shop location directly on our Tamil Nadu interactive map.\n4. Add your services, starting prices, and publish. Your business goes live immediately across your 30 km radius!',
      links: [
        { label: isTa ? 'இப்போதே பதிவு செய்' : 'Register Business Now', path: '/register-business' }
      ]
    }
  }

  // 3. Customer Care / Support / Phone / Helpline / Email
  if (
    q.includes('support') || 
    q.includes('contact') || 
    q.includes('phone') || 
    q.includes('mobile') || 
    q.includes('email') || 
    q.includes('helpline') || 
    q.includes('customer care') ||
    q.includes('call') ||
    q.includes('உதவி') ||
    q.includes('தொலைபேசி') ||
    q.includes('எண்')
  ) {
    return {
      isKnowledge: true,
      title: isTa ? 'Nearzy வாடிக்கையாளர் உதவி மையம்' : 'Nearzy Support & Contact Details',
      explanation: isTa
        ? 'Nearzy வாடிக்கையாளர் மற்றும் சேவை வழங்குநர் ஆதரவு மையம்:\n📞 தொலைபேசி / வாட்ஸ்அப்: +91 88386 97749\n✉️ ஆதரவு மின்னஞ்சல்: jothikap56@gmail.com\n⏰ உதவி நேரம்: திங்கள் முதல் ஞாயிறு வரை (காலை 8:00 - இரவு 9:00 மணி வரை).'
        : 'Nearzy Customer & Partner Support Desk:\n📞 Direct Phone / WhatsApp: +91 88386 97749\n✉️ Official Support Email: jothikap56@gmail.com\n⏰ Operating Hours: Monday to Sunday (8:00 AM – 9:00 PM IST).\nFeel free to reach out for booking assistance, provider verification, or feedback.',
      links: [
        { label: isTa ? 'முகப்பு பக்கம்' : 'Home Page', path: '/' }
      ]
    }
  }

  // 4. How to Book / Booking Process
  if (
    q.includes('how to book') || 
    q.includes('booking process') || 
    q.includes('how do i book') || 
    q.includes('book service') ||
    q.includes('முன்பதிவு')
  ) {
    return {
      isKnowledge: true,
      title: isTa ? 'சேவையை முன்பதிவு செய்வது எப்படி?' : 'How to Book a Service on Nearzy',
      explanation: isTa
        ? 'Nearzy-யில் சேவை முன்பதிவு செய்யும் முறை:\n1. உங்கள் ஊர் அல்லது மாவட்டத்தை தேர்வு செய்து சேவைகளை தேடுங்கள்.\n2. சரிபார்க்கப்பட்ட நிபுணர்களின் விவரம் மற்றும் கட்டணங்களை ஒப்பிடுங்கள்.\n3. "Book Now" கிளிக் செய்து, தேவையான நாள் மற்றும் நேரத்தைத் தேர்வு செய்து முன்பதிவு செய்யுங்கள்.\n4. "My Bookings" பக்கத்தில் நிலையை கண்காணிக்கலாம்.'
        : 'Booking on Nearzy is 100% transparent and convenient:\n1. Search for your required service and specify your town/district.\n2. Browse verified providers within 30 km and compare transparent starting prices.\n3. Click "Book Now" on your preferred provider to select your appointment date, time, and address.\n4. Track live booking confirmation and updates anytime under "My Bookings"!',
      links: [
        { label: isTa ? 'சேவைகள் தேடு' : 'Explore Services', path: '/search' },
        { label: isTa ? 'எனது முன்பதிவுகள்' : 'My Bookings', path: '/my-bookings' }
      ]
    }
  }

  return null
}

/**
 * Strips conversational filler and stop words from natural language queries
 */
function extractSearchTerms(userQuery, categorySlug, locality) {
  let cleaned = (userQuery || '').toLowerCase()

  // Remove known locality words and aliases
  if (locality) {
    const locLower = locality.toLowerCase()
    cleaned = cleaned.replace(new RegExp(`\\b${locLower}\\b`, 'gi'), ' ')
    const resolved = resolveLocation(locality)
    if (resolved?.aliases) {
      resolved.aliases.forEach(a => {
        cleaned = cleaned.replace(new RegExp(`\\b${a}\\b`, 'gi'), ' ')
      })
    }
  }

  // Remove category name if already identified
  if (categorySlug) {
    const catWords = categorySlug.split('-')
    catWords.forEach(w => {
      cleaned = cleaned.replace(new RegExp(`\\b${w}\\b`, 'gi'), ' ')
    })
  }

  // Remove conversational stop words in English & Tamil
  const stopWords = [
    'find', 'the', 'best', 'service', 'services', 'provider', 'providers',
    'in', 'at', 'near', 'near me', 'around', 'top', 'good', 'need', 'want',
    'looking for', 'please', 'help', 'cheap', 'lowest price', 'affordable',
    'shop', 'shops', 'center', 'centre', 'show', 'all', 'any', 'available',
    'list', 'get', 'give', 'me', 'who', 'what', 'are', 'is', 'there',
    'வேலை', 'சேவை', 'சேவைகள்', 'சிறந்த', 'தேவை', 'பக்கம்', 'அருகில்',
    'உள்ள', 'எங்கே', 'வேண்டும்', 'அனைத்து', 'காட்டு'
  ]

  for (const sw of stopWords) {
    cleaned = cleaned.replace(new RegExp(`\\b${sw}\\b`, 'gi'), ' ')
  }

  cleaned = cleaned.replace(/[^\w\s\u0B80-\u0BFF]/gi, ' ').replace(/\s+/g, ' ').trim()
  return cleaned
}

/**
 * Semantic intent extractor for English & Tamil queries across Tamil Nadu
 */
function extractLocalIntent(text) {
  const lower = text.toLowerCase().trim()

  // 1. Locality extraction with token matching and alias support (e.g. kkdi, cbe, mdu, trichy)
  const resolved = resolveLocation(text)
  const foundLocality = resolved ? resolved.name : ''

  // 2. Category identification
  let categorySlug = ''
  let categoryName = ''

  if (lower.includes('plumb') || lower.includes('பிளம்ப') || lower.includes('பைப்') || lower.includes('leak') || lower.includes('tap') || lower.includes('கசிவு') || lower.includes('water pipe')) {
    categorySlug = 'plumbing'
    categoryName = 'Plumbing'
  } else if (lower.includes('electr') || lower.includes('எலக்ட்ரீ') || lower.includes('wire') || lower.includes('fuse') || lower.includes('inverter') || lower.includes('இன்வெர்ட்டர்') || lower.includes('current')) {
    categorySlug = 'electricians'
    categoryName = 'Electricians'
  } else if (lower.includes('ac ') || lower.includes(' ஏசி') || lower.includes('air condition') || lower.includes('fridge') || lower.includes('washing machine') || lower.includes('appliance') || lower.includes('பழுது')) {
    categorySlug = 'appliance-repair'
    categoryName = 'Appliance Repair'
  } else if (lower.includes('salon') || lower.includes('beauty') || lower.includes('hair') || lower.includes('facial') || lower.includes('makeup') || lower.includes('bridal') || lower.includes('சலூன்') || lower.includes('அழகு')) {
    categorySlug = 'beauty-and-salons'
    categoryName = 'Beauty & Salons'
  } else if (lower.includes('mobile') || lower.includes('phone') || lower.includes('laptop') || lower.includes('iphone') || lower.includes('computer') || lower.includes('மொபைல்')) {
    categorySlug = 'electronics-and-mobile-repair'
    categoryName = 'Electronics & Mobile Repair'
  } else if (lower.includes('tutor') || lower.includes('math') || lower.includes('tuition') || lower.includes('teacher') || lower.includes('coaching') || lower.includes('டியூஷன்') || lower.includes('கல்வி')) {
    categorySlug = 'education-and-tutors'
    categoryName = 'Education & Tutors'
  } else if (lower.includes('car') || lower.includes('bike') || lower.includes('mechanic') || lower.includes('auto') || lower.includes('மெக்கானிக்') || lower.includes('வாட்டர் வாஷ்') || lower.includes('garage')) {
    categorySlug = 'bike-and-car-services'
    categoryName = 'Bike & Car Services'
  } else if (lower.includes('clean') || lower.includes('சுத்தம்') || lower.includes('saniti') || lower.includes('housekeep') || lower.includes('deep clean')) {
    categorySlug = 'cleaning-services'
    categoryName = 'Cleaning Services'
  } else if (lower.includes('carpent') || lower.includes('தச்சு') || lower.includes('wood') || lower.includes('furniture') || lower.includes('door repair')) {
    categorySlug = 'carpentry'
    categoryName = 'Carpentry'
  } else if (lower.includes('doctor') || lower.includes('clinic') || lower.includes('மருத்துவ') || lower.includes('dental') || lower.includes('dentist') || lower.includes('physio')) {
    categorySlug = 'healthcare-and-clinics'
    categoryName = 'Healthcare & Clinics'
  } else if (lower.includes('food') || lower.includes('restaurant') || lower.includes('mess') || lower.includes('cafe') || lower.includes('catering') || lower.includes('உணவக')) {
    categorySlug = 'restaurants-and-cafes'
    categoryName = 'Restaurants & Cafes'
  } else if (lower.includes('photo') || lower.includes('wedding') || lower.includes('video') || lower.includes('candid') || lower.includes('புகைப்பட')) {
    categorySlug = 'photography'
    categoryName = 'Photography'
  } else if (lower.includes('tailor') || lower.includes('laundry') || lower.includes('stitching') || lower.includes('தையல்')) {
    categorySlug = 'tailoring-and-laundry'
    categoryName = 'Tailoring & Laundry'
  } else if (lower.includes('pg') || lower.includes('hostel') || lower.includes('room') || lower.includes('rent') || lower.includes('தங்குமிடம்')) {
    categorySlug = 'accommodation-and-pg'
    categoryName = 'Accommodation & PG'
  } else if (lower.includes('event') || lower.includes('stage') || lower.includes('decoration') || lower.includes('dj') || lower.includes('நிகழ்ச்சி')) {
    categorySlug = 'event-management'
    categoryName = 'Event Management'
  } else if (lower.includes('grocery') || lower.includes('supermarket') || lower.includes('provision') || lower.includes('மளிகை')) {
    categorySlug = 'grocery-and-retail'
    categoryName = 'Grocery & Retail'
  }

  // 3. Check if user requested "all services" or broad overview
  const isAllServices = 
    lower.includes('all service') || 
    lower.includes('all services') || 
    lower.includes('available service') ||
    lower.includes('any service') || 
    lower.includes('show services') || 
    lower.includes('list services') ||
    lower.includes('what services') ||
    lower.includes('அனைத்து சேவை') ||
    (!categorySlug && (lower.includes('service') || lower.includes('services') || lower.includes('providers')))

  if (isAllServices && !categorySlug) {
    categoryName = 'All Services'
  }

  // Budget extraction (e.g., "under 500", "₹1000", "< 600", "500-க்குள்")
  let maxBudget = null
  const budgetMatch = text.match(/(?:under|below|less than|within|₹|rs\.?|inr)\s*(\d+)/i) || 
                      text.match(/(\d+)\s*(?:ரூபாய்|க்குள்)/)
  if (budgetMatch && budgetMatch[1]) {
    maxBudget = parseInt(budgetMatch[1], 10)
  }

  // Emergency or immediate requirement
  const isEmergency = lower.includes('emergency') || 
                      lower.includes('urgent') || 
                      lower.includes('today') || 
                      lower.includes('now') || 
                      lower.includes('உடனடி') || 
                      lower.includes('இன்றே')

  const searchKeyword = extractSearchTerms(text, categorySlug, foundLocality)

  return {
    categorySlug,
    categoryName,
    locality: foundLocality,
    resolvedLocation: resolved,
    maxBudget,
    isEmergency,
    isAllServices,
    searchKeyword,
  }
}

/**
 * Interpret user natural language query and return matching database results or platform knowledge
 */
export async function queryAIAssistant(userQuery, language = 'en', userLocation = null) {
  const cleanQuery = (userQuery || '').trim()
  if (!cleanQuery) {
    return {
      success: false,
      explanation: 'Please enter what service you are looking for.',
      criteria: {},
      businesses: [],
    }
  }

  // 1. Check if the query is a general website knowledge question
  const knowledgeMatch = checkPlatformKnowledge(cleanQuery, language)
  if (knowledgeMatch) {
    return {
      success: true,
      isKnowledge: true,
      title: knowledgeMatch.title,
      explanation: knowledgeMatch.explanation,
      links: knowledgeMatch.links,
      businesses: [],
      criteria: {
        categoryName: 'Nearzy Platform Knowledge',
      },
      count: 0
    }
  }

  // 2. Extract semantic intent locally with complete Tamil Nadu knowledge
  const intent = extractLocalIntent(cleanQuery)
  const resolvedLoc = intent.resolvedLocation || resolveLocation(intent.locality || cleanQuery)

  if (resolvedLoc && !intent.locality) {
    intent.locality = resolvedLoc.name
  }

  // 3. Determine query string to pass to businessService
  // If user asked for a specific category or "all services", do NOT pass literal text keywords that block results
  let queryToPass = ''
  if (!intent.categorySlug && !intent.isAllServices) {
    queryToPass = intent.searchKeyword
  }

  // 4. Query database with spatial radius around resolved locality
  let businesses = await searchBusinesses({
    query: queryToPass,
    categorySlug: intent.categorySlug || '',
    locality: intent.locality || '',
    centerLat: resolvedLoc?.lat || null,
    centerLng: resolvedLoc?.lng || null,
    radiusKm: 30,
    maxPrice: intent.maxBudget,
    verifiedOnly: false,
    sortBy: 'rating',
    limit: 60,
  })

  // Fallback 1: If 30km radius returned 0, expand to 60km or district-wide
  if (businesses.length === 0 && (resolvedLoc || intent.locality)) {
    businesses = await searchBusinesses({
      query: '', // Drop strict text filter on fallback
      categorySlug: intent.categorySlug || '',
      locality: resolvedLoc?.district || intent.locality || '',
      centerLat: resolvedLoc?.lat,
      centerLng: resolvedLoc?.lng,
      radiusKm: 60,
      maxPrice: intent.maxBudget,
      verifiedOnly: false,
      sortBy: 'rating',
      limit: 60,
    })
  }

  // Fallback 2: If still 0 and category specified, search category across Tamil Nadu
  if (businesses.length === 0 && intent.categorySlug) {
    businesses = await searchBusinesses({
      categorySlug: intent.categorySlug,
      sortBy: 'rating',
      limit: 20,
    })
  }

  // Fallback 3: If still 0 and locality was specified, fetch all top-rated services in that district
  if (businesses.length === 0 && resolvedLoc) {
    businesses = await searchBusinesses({
      locality: resolvedLoc.district || resolvedLoc.name,
      centerLat: resolvedLoc.lat,
      centerLng: resolvedLoc.lng,
      radiusKm: 60,
      sortBy: 'rating',
      limit: 20,
    })
  }

  // 5. Rank matching results using transparent weighted scoring
  const ranked = rankBusinesses(businesses, intent)

  // 6. Generate human-friendly, transparent explanation
  const explanation = generateExplanation(intent, ranked.length, language)

  return {
    success: true,
    criteria: intent,
    explanation,
    businesses: ranked,
    count: ranked.length,
  }
}

/**
 * Transparent weighted scoring algorithm for ranking
 */
function rankBusinesses(businesses, intent) {
  return businesses
    .map(biz => {
      let score = 0
      const matchReasons = []

      // Category match (+30)
      if (intent.categorySlug && biz.categorySlug === intent.categorySlug) {
        score += 30
        matchReasons.push(`Category: ${biz.categoryName}`)
      } else if (intent.isAllServices) {
        score += 20
        matchReasons.push(`${biz.categoryName}`)
      }

      // Locality match (+35)
      if (intent.locality && (
        biz.locality.toLowerCase().includes(intent.locality.toLowerCase()) || 
        biz.city.toLowerCase().includes(intent.locality.toLowerCase()) ||
        biz.district?.toLowerCase() === intent.resolvedLocation?.district?.toLowerCase()
      )) {
        score += 35
        matchReasons.push(`Located in ${biz.locality}`)
      }

      // 30 km radius distance boost (+25)
      if (biz.distanceKm !== undefined && biz.distanceKm <= 30) {
        score += Math.max(5, 30 - Math.round(biz.distanceKm))
        matchReasons.push(`Within ${biz.distanceKm} km radius`)
      }

      // Budget compliance (+20)
      if (intent.maxBudget && (biz.minPrice || 0) <= intent.maxBudget) {
        score += 20
        matchReasons.push(`Starting fee ₹${biz.minPrice} (within ₹${intent.maxBudget} budget)`)
      }

      // Rating boost (up to +15 based on rating)
      const rating = biz.rating || 0
      score += Math.round(rating * 3)
      if (rating >= 4.5) {
        matchReasons.push(`Verified community rating: ${rating} ★`)
      }

      // Verified provider boost (+10)
      if (biz.isVerified) {
        score += 10
        matchReasons.push('Verified local business')
      }

      return {
        ...biz,
        aiScore: score,
        matchReasons,
      }
    })
    .sort((a, b) => b.aiScore - a.aiScore)
}

/**
 * Generate human-friendly, transparent explanation
 */
function generateExplanation(intent, count, language) {
  const isTa = language === 'ta'

  if (isTa) {
    if (intent.isAllServices && intent.locality) {
      return `${intent.locality} மற்றும் சுற்றியுள்ள 30 கி.மீ பரப்பில் பிளம்பிங், எலக்ட்ரீசியன், மெக்கானிக், அழகு நிலையம், ஏசி பழுது உள்ளிட்ட ${count} சரிபார்க்கப்பட்ட சேவை வழங்குநர்கள் கிடைக்கின்றனர்.`
    }
    let parts = []
    if (intent.categoryName && intent.categoryName !== 'All Services') parts.push(`"${intent.categoryName}" சேவை`)
    if (intent.locality) parts.push(`"${intent.locality}" பகுதியில் 30 கி.மீ சுற்றளவில்`)
    if (intent.maxBudget) parts.push(`₹${intent.maxBudget}-க்குள்`)

    if (count > 0) {
      return `உங்கள் விருப்பத்திற்கேற்ப ${parts.join(', ')} சரிபார்க்கப்பட்ட ${count} உள்ளூர் வணிகங்கள் கண்டறியப்பட்டுள்ளன.`
    }
    return `தேடலுக்கு ஏற்ற வணிகங்கள் கிடைக்கவில்லை. பிற மாவட்டங்களை தேர்வு செய்யவும்.`
  }

  // English
  if (intent.isAllServices && intent.locality) {
    return `Found ${count} verified service providers in ${intent.locality} within 30 km across Plumbing, Electrical, Salons, Bike/Car Services, Appliance Repair, and more.`
  }

  const criteriaParts = []
  if (intent.categoryName && intent.categoryName !== 'All Services') criteriaParts.push(`Category: ${intent.categoryName}`)
  if (intent.locality) criteriaParts.push(`30km around ${intent.locality}`)
  if (intent.maxBudget) criteriaParts.push(`Max Budget: ₹${intent.maxBudget}`)

  if (count > 0) {
    const matched = criteriaParts.length > 0 ? criteriaParts.join(' • ') : 'Tamil Nadu'
    return `Found ${count} verified businesses matching ${matched}.`
  }
  return `No exact matches within 30km for ${criteriaParts.join(' • ')}. Try expanding your location or budget.`
}
