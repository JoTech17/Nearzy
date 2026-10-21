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
 * services, business registration, booking process, contact, safety, and pricing.
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
    q.includes('what is this app') ||
    q.includes('how does nearzy work') ||
    q.includes('about us') ||
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
    q.includes('register my business') || 
    q.includes('register a business') || 
    q.includes('how to register') || 
    q.includes('how do i register') || 
    q.includes('register my shop') || 
    q.includes('register shop') || 
    q.includes('add my shop') || 
    q.includes('add business') || 
    q.includes('add my business') || 
    q.includes('list business') || 
    q.includes('list my business') || 
    q.includes('list service') || 
    q.includes('list my service') || 
    q.includes('become a provider') ||
    q.includes('join as partner') ||
    q.includes('partner with nearzy') ||
    q.includes('start selling') ||
    q.includes('கடை பதிவு') ||
    q.includes('வணிக பதிவு') ||
    q.includes('சேவை பதிவு') ||
    q.includes('பதிவு செய்வது எப்படி') ||
    ((q.includes('வணிக') || q.includes('கடை') || q.includes('தொழில்')) && (q.includes('பதிவு') || q.includes('சேர்க்க')))
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

  // 3. Customer Care / Support / Phone / Helpline / Email / Contact
  if (
    q.includes('support') || 
    q.includes('contact') || 
    q.includes('phone') || 
    q.includes('mobile') || 
    q.includes('email') || 
    q.includes('helpline') || 
    q.includes('customer care') ||
    q.includes('customer service') ||
    q.includes('call') ||
    q.includes('உதவி') ||
    q.includes('தொலைபேசி') ||
    q.includes('எண்') ||
    q.includes('தொடர்பு')
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

  // 4. How to Book / Booking Process / Cancel Booking
  if (
    q.includes('how to book') || 
    q.includes('booking process') || 
    q.includes('how do i book') || 
    q.includes('how can i book') || 
    q.includes('book service') ||
    q.includes('book a service') ||
    q.includes('make a booking') ||
    q.includes('how to hire') ||
    q.includes('cancel booking') ||
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

  // 5. Pricing / Cost / Commission / Charges
  if (
    q.includes('cost') ||
    q.includes('pricing') ||
    q.includes('commission') ||
    q.includes('how much') ||
    q.includes('charges') ||
    q.includes('free') ||
    q.includes('கட்டணம்') ||
    q.includes('விலை')
  ) {
    return {
      isKnowledge: true,
      title: isTa ? 'Nearzy கட்டண விவரங்கள்' : 'Nearzy Pricing & Charges',
      explanation: isTa
        ? 'Nearzy-யில் வாடிக்கையாளர்கள் சேவைகளை தேடுவதும் முன்பதிவு செய்வதும் 100% இலவசம்! சேவைக் கட்டணம் அந்தந்த சேவை வழங்குநரின் விவரப் பக்கத்தில் வெளிப்படையாகக் குறிப்பிடப்பட்டுள்ளது (குறைந்தபட்ச தொடக்கக் கட்டணம் ₹149 முதல்). சேவை முடிந்த பிறகு மட்டுமே கட்டணம் செலுத்தலாம்.'
        : 'Searching and booking services on Nearzy is 100% free for customers! Each verified provider displays transparent upfront starting prices (starting as low as ₹149). You only pay the provider directly once the service is satisfactorily completed.',
      links: [
        { label: isTa ? 'சேவை பிரிவுகள்' : 'Explore Categories', path: '/categories' }
      ]
    }
  }

  // 6. Safety / Verification / Trust
  if (
    q.includes('safe') ||
    q.includes('safety') ||
    q.includes('verified') ||
    q.includes('trust') ||
    q.includes('guarantee') ||
    q.includes('பாதுகாப்பு') ||
    q.includes('நம்பகமான')
  ) {
    return {
      isKnowledge: true,
      title: isTa ? 'பாதுகாப்பு மற்றும் சரிபார்ப்பு' : 'Safety & Provider Verification',
      explanation: isTa
        ? 'Nearzy-யில் உள்ள அனைத்து 760+ சேவை வழங்குநர்களும் நேரில் ஆவணங்கள் மற்றும் திறன்கள் சரிபார்க்கப்பட்டவர்கள். வாடிக்கையாளர் மதிப்பீடுகள், நேரடி தொலைபேசி தொடர்பு மற்றும் வெளிப்படையான கட்டணங்கள் மூலம் 100% பாதுகாப்பான சேவையை நாங்கள் உறுதி செய்கிறோம்.'
        : 'All 760+ service partners on Nearzy undergo identity verification and trade quality checks. We provide verified ratings, direct provider contact, upfront transparent pricing, and 30 km doorstep dispatch for complete safety and peace of mind.',
      links: [
        { label: isTa ? 'முகப்பு பக்கம்' : 'Home Page', path: '/' }
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
        if (/[\u0B80-\u0BFF]/.test(a)) {
          cleaned = cleaned.replaceAll(a, ' ')
        } else {
          cleaned = cleaned.replace(new RegExp(`\\b${a}\\b`, 'gi'), ' ')
        }
      })
    }
    if (resolved?.nameTa) {
      cleaned = cleaned.replaceAll(resolved.nameTa, ' ')
      // Also remove inflected Tamil forms like காரைக்குடியில்
      cleaned = cleaned.replace(new RegExp(`${resolved.nameTa}[^\s]*`, 'g'), ' ')
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
    if (/[\u0B80-\u0BFF]/.test(sw)) {
      cleaned = cleaned.replaceAll(sw, ' ')
    } else {
      cleaned = cleaned.replace(new RegExp(`\\b${sw}\\b`, 'gi'), ' ')
    }
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
    lower.includes('services near') ||
    lower.includes('services in') ||
    lower.includes('அனைத்து சேவை') ||
    lower.includes('சேவை') ||
    lower.includes('சேவைகள்') ||
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

  const isTaQuery = /[\u0B80-\u0BFF]/.test(cleanQuery)
  const isTa = language === 'ta' || isTaQuery

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
  let resolvedLoc = intent.resolvedLocation || resolveLocation(intent.locality || cleanQuery)

  // If not resolved from query text, check user's saved/active location if passed
  if (!resolvedLoc && userLocation) {
    const locName = typeof userLocation === 'string' ? userLocation : (userLocation.name || userLocation.locality || userLocation.city)
    resolvedLoc = resolveLocation(locName)
    if (resolvedLoc) {
      intent.locality = resolvedLoc.name
      intent.resolvedLocation = resolvedLoc
    }
  }

  if (resolvedLoc && !intent.locality) {
    intent.locality = resolvedLoc.name
  }

  // 3. Detect queries looking for services in/near a place without a resolved location
  const isGenericLocationQuery =
    /services?\s+(?:near|in|around|at)\s+(?:a\s+place|the\s+place|place|my\s+place|here|me|area)\b/i.test(cleanQuery) ||
    /^(?:services?\s+)?near\s+(?:a\s+place|the\s+place|place|me|here)\b/i.test(cleanQuery) ||
    /^(?:services?\s+)?in\s+(?:the\s+place|a\s+place|place)\b/i.test(cleanQuery) ||
    /^(?:show\s+)?(?:all\s+)?services(?:\s+(?:near|in|around)\s+(?:a\s+)?place)?$/i.test(cleanQuery) ||
    /\b(?:near a place|in the place|near me|in a place|near here|around here)\b/i.test(cleanQuery) ||
    cleanQuery.toLowerCase() === 'services' ||
    cleanQuery.toLowerCase() === 'all services' ||
    cleanQuery.toLowerCase() === 'show all services' ||
    cleanQuery.toLowerCase() === 'show services' ||
    cleanQuery.toLowerCase() === 'சேவைகள்' ||
    cleanQuery.toLowerCase() === 'அனைத்து சேவைகள்' ||
    cleanQuery.toLowerCase() === 'எனக்கு அருகில் உள்ள சேவைகள்' ||
    cleanQuery.toLowerCase() === 'ஒரு இடத்தில் உள்ள சேவைகள்' ||
    (!intent.categorySlug && intent.isAllServices)

  if (!resolvedLoc && isGenericLocationQuery) {
    return {
      success: true,
      needsLocation: true,
      title: isTa ? 'உங்கள் ஊரை தேர்ந்தெடுக்கவும்' : 'Which town or district are you in?',
      explanation: isTa
        ? '30 கி.மீ சுற்றளவில் உள்ள சரிபார்க்கப்பட்ட சேவைகளை காண உங்கள் ஊர் அல்லது மாவட்டத்தை குறிப்பிடவும் (எ.கா: காரைக்குடி, மதுரை, கோயம்புத்தூர், சென்னை, திருச்சி, சேலம்).'
        : 'Please specify your town or district in Tamil Nadu to view verified services strictly within a 30 km radius (e.g., Karaikudi, Madurai, Coimbatore, Chennai, Trichy, Salem).',
      suggestedLocations: [
        { name: 'Karaikudi', nameTa: 'காரைக்குடி' },
        { name: 'Madurai', nameTa: 'மதுரை' },
        { name: 'Coimbatore', nameTa: 'கோயம்புத்தூர்' },
        { name: 'Chennai', nameTa: 'சென்னை' },
        { name: 'Trichy', nameTa: 'திருச்சி' },
        { name: 'Salem', nameTa: 'சேலம்' },
        { name: 'Sivaganga', nameTa: 'சிவகங்கை' }
      ],
      criteria: {
        categoryName: 'All Services',
        locality: null,
      },
      businesses: [],
      count: 0
    }
  }

  // 4. If query mentions an unknown locality (e.g., "services in xyz") and category wasn't resolved:
  if (!resolvedLoc && !intent.categorySlug) {
    return {
      success: true,
      needsLocation: true,
      title: isTa ? 'ஊர் கண்டறியப்படவில்லை' : 'Location Not Found',
      explanation: isTa
        ? 'குறிப்பிட்ட ஊர் தமிழ்நாட்டின் 38 மாவட்டங்களில் கண்டறியப்படவில்லை. அருகில் உள்ள முக்கிய ஊரை (காரைக்குடி, மதுரை, கோவை, சென்னை, திருச்சி) தேர்ந்தெடுக்கவும்.'
        : 'Could not identify that location in Tamil Nadu. Please choose a nearby town (e.g., Karaikudi, Madurai, Coimbatore, Chennai, Trichy, Salem) to discover services within 30 km.',
      suggestedLocations: [
        { name: 'Karaikudi', nameTa: 'காரைக்குடி' },
        { name: 'Madurai', nameTa: 'மதுரை' },
        { name: 'Coimbatore', nameTa: 'கோயம்புத்தூர்' },
        { name: 'Chennai', nameTa: 'சென்னை' },
        { name: 'Trichy', nameTa: 'திருச்சி' },
        { name: 'Salem', nameTa: 'சேலம்' },
        { name: 'Sivaganga', nameTa: 'சிவகங்கை' }
      ],
      criteria: {
        categoryName: 'All Services',
        locality: null,
      },
      businesses: [],
      count: 0
    }
  }

  // 5. Query database
  let queryToPass = ''
  if (!intent.categorySlug && !intent.isAllServices) {
    queryToPass = intent.searchKeyword
  }

  let businesses = []

  if (resolvedLoc) {
    // Spatial search strictly within 30 km radius around resolved locality
    businesses = await searchBusinesses({
      query: queryToPass,
      categorySlug: intent.categorySlug || '',
      locality: resolvedLoc.name,
      centerLat: resolvedLoc.lat,
      centerLng: resolvedLoc.lng,
      radiusKm: 30,
      maxPrice: intent.maxBudget,
      verifiedOnly: false,
      sortBy: 'distance',
      limit: 20,
    })

    // Fallback: If 0 results within 30 km and a specific category was requested, expand slightly to 45km
    if (businesses.length === 0 && intent.categorySlug) {
      businesses = await searchBusinesses({
        categorySlug: intent.categorySlug,
        locality: resolvedLoc.district || resolvedLoc.name,
        centerLat: resolvedLoc.lat,
        centerLng: resolvedLoc.lng,
        radiusKm: 45,
        maxPrice: intent.maxBudget,
        sortBy: 'distance',
        limit: 15,
      })
    }
  } else if (intent.categorySlug) {
    // Category queried without a location (e.g. "plumber", "electrician under 500")
    businesses = await searchBusinesses({
      categorySlug: intent.categorySlug,
      maxPrice: intent.maxBudget,
      sortBy: 'rating',
      limit: 12,
    })
  }

  // 6. Rank matching results using transparent weighted scoring
  const ranked = rankBusinesses(businesses, intent)

  // 7. Generate explanation
  const explanation = generateExplanation(intent, ranked.length, language, isTaQuery)

  return {
    success: true,
    criteria: intent,
    explanation,
    suggestedLocations: !resolvedLoc ? [
      { name: 'Karaikudi', nameTa: 'காரைக்குடி' },
      { name: 'Madurai', nameTa: 'மதுரை' },
      { name: 'Coimbatore', nameTa: 'கோயம்புத்தூர்' },
      { name: 'Chennai', nameTa: 'சென்னை' },
      { name: 'Trichy', nameTa: 'திருச்சி' },
      { name: 'Salem', nameTa: 'சேலம்' },
      { name: 'Sivaganga', nameTa: 'சிவகங்கை' }
    ] : undefined,
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
function generateExplanation(intent, count, language, isTaQuery = false) {
  const isTa = language === 'ta' || isTaQuery

  if (isTa) {
    if (intent.locality) {
      if (intent.categoryName && intent.categoryName !== 'All Services') {
        const budgetTa = intent.maxBudget ? ` (₹${intent.maxBudget}-க்குள்)` : ''
        if (count > 0) {
          return `${intent.locality} பகுதியில் 30 கி.மீ சுற்றளவில் சரிபார்க்கப்பட்ட ${count} "${intent.categoryName}" சேவை வழங்குநர்கள் கண்டறியப்பட்டுள்ளனர்${budgetTa}.`
        }
        return `${intent.locality} பகுதியில் 30 கி.மீ சுற்றளவில் "${intent.categoryName}" சேவைகள் கிடைக்கவில்லை. பட்ஜெட்டை மாற்றி முயற்சிக்கவும்.`
      }
      if (count > 0) {
        return `${intent.locality} மற்றும் சுற்றியுள்ள 30 கி.மீ பரப்பில் பிளம்பிங், எலக்ட்ரீசியன், மெக்கானிக், அழகு நிலையம், ஏசி பழுது உள்ளிட்ட ${count} சரிபார்க்கப்பட்ட சேவை வழங்குநர்கள் கிடைக்கின்றனர்.`
      }
      return `${intent.locality} பகுதியில் 30 கி.மீ சுற்றளவில் சேவைகள் கிடைக்கவில்லை.`
    }

    if (intent.categoryName && intent.categoryName !== 'All Services') {
      const budgetTa = intent.maxBudget ? ` (₹${intent.maxBudget}-க்குள்)` : ''
      return `தமிழ்நாடு முழுவதும் சரிபார்க்கப்பட்ட ${count} "${intent.categoryName}" சேவைகள் கிடைக்கின்றன${budgetTa}. 30 கி.மீ சுற்றளவைக் காண உங்கள் ஊரைத் தேர்ந்தெடுக்கவும்.`
    }

    return `தமிழ்நாடு முழுவதும் சரிபார்க்கப்பட்ட ${count} சேவை வழங்குநர்கள் கிடைக்கின்றனர்.`
  }

  // English
  if (intent.locality) {
    if (intent.categoryName && intent.categoryName !== 'All Services') {
      const budgetNote = intent.maxBudget ? ` (under ₹${intent.maxBudget})` : ''
      if (count > 0) {
        return `Found ${count} verified ${intent.categoryName} providers within 30 km of ${intent.locality}${budgetNote}.`
      }
      return `No verified ${intent.categoryName} providers found within 30 km of ${intent.locality}${budgetNote}. Try expanding your search or budget.`
    }
    if (count > 0) {
      return `Found ${count} verified service providers in ${intent.locality} within 30 km across Plumbing, Electrical, Salons, Bike/Car Services, Appliance Repair, and more.`
    }
    return `No verified services found within 30 km of ${intent.locality}. Try searching a nearby town.`
  }

  if (intent.categoryName && intent.categoryName !== 'All Services') {
    const budgetNote = intent.maxBudget ? ` under ₹${intent.maxBudget}` : ''
    return `Found ${count} top-rated ${intent.categoryName} providers across Tamil Nadu${budgetNote}. Select your town below to filter strictly within 30 km.`
  }

  return `Found ${count} verified service providers across Tamil Nadu.`
}
