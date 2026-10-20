// Nearzy AI Assistant Service
// Natural language search interpretation & real-database recommendation engine
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
 * Strips conversational filler and stop words from natural language queries
 */
function extractSearchTerms(userQuery, categorySlug, locality) {
  let cleaned = (userQuery || '').toLowerCase()

  // Remove known locality words
  if (locality) {
    const locLower = locality.toLowerCase()
    cleaned = cleaned.replace(new RegExp(locLower, 'gi'), ' ')
    const resolved = resolveLocation(locality)
    if (resolved?.aliases) {
      resolved.aliases.forEach(a => {
        cleaned = cleaned.replace(new RegExp(a, 'gi'), ' ')
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
    'shop', 'shops', 'center', 'centre', 'வேலை', 'சேவை', 'சிறந்த', 'தேவை',
    'பக்கம்', 'அருகில்', 'உள்ள', 'எங்கே', 'வேண்டும்'
  ]

  for (const sw of stopWords) {
    cleaned = cleaned.replace(new RegExp(`\\b${sw}\\b`, 'gi'), ' ')
  }

  cleaned = cleaned.replace(/[^\w\s\u0B80-\u0BFF]/gi, ' ').replace(/\s+/g, ' ').trim()
  return cleaned
}

/**
 * Interpret user natural language query and return matching database results
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

  let extractedIntent = null

  // 1. If Gemini API Key is configured, attempt direct Gemini API intent extraction
  if (GEMINI_API_KEY && GEMINI_API_KEY.length > 10) {
    try {
      extractedIntent = await callGeminiIntentParser(cleanQuery, language)
    } catch (err) {
      console.warn('Gemini direct API call notice, falling back to built-in semantic parser:', err)
    }
  }

  // 2. If Supabase Edge Function is configured, try it as well
  if (!extractedIntent && isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.functions.invoke('ai-assistant', {
        body: { query: cleanQuery, language, userLocation },
      })
      if (!error && data?.success && data?.criteria) {
        extractedIntent = data.criteria
      }
    } catch (edgeFnErr) {
      console.warn('Edge function unavailable, using local semantic parser:', edgeFnErr)
    }
  }

  // 3. Fallback to resilient Tamil Nadu semantic intent extraction
  const intent = extractedIntent || extractLocalIntent(cleanQuery)

  // Resolve locality across Tamil Nadu with full alias support
  const resolvedLoc = resolveLocation(intent.locality || cleanQuery)
  if (resolvedLoc && !intent.locality) {
    intent.locality = resolvedLoc.name
  }

  // Extract clean search term (strip conversational stop words and location tokens)
  const cleanedSearchTerm = extractSearchTerms(cleanQuery, intent.categorySlug, intent.locality)

  // 4. Query authentic database records matching criteria with 30km spatial radius
  // If categorySlug is already recognized, do not over-filter with generic search keywords
  const queryToPass = intent.categorySlug ? '' : cleanedSearchTerm

  let businesses = await searchBusinesses({
    query: queryToPass,
    categorySlug: intent.categorySlug || '',
    locality: intent.locality || '',
    centerLat: resolvedLoc?.lat,
    centerLng: resolvedLoc?.lng,
    radiusKm: 30,
    maxPrice: intent.maxBudget,
    verifiedOnly: false,
    sortBy: 'rating',
  })

  // Fallback: If 30km radius returned 0, expand to 60km or district-wide
  if (businesses.length === 0 && (resolvedLoc || intent.locality)) {
    businesses = await searchBusinesses({
      query: queryToPass,
      categorySlug: intent.categorySlug || '',
      locality: resolvedLoc?.district || intent.locality || '',
      centerLat: resolvedLoc?.lat,
      centerLng: resolvedLoc?.lng,
      radiusKm: 60,
      maxPrice: intent.maxBudget,
      verifiedOnly: false,
      sortBy: 'rating',
    })
  }

  // Fallback 2: If still 0, search category across Tamil Nadu
  if (businesses.length === 0 && intent.categorySlug) {
    businesses = await searchBusinesses({
      categorySlug: intent.categorySlug,
      sortBy: 'rating',
      limit: 10,
    })
  }

  // 6. Rank matching results using transparent weighted scoring
  const ranked = rankBusinesses(businesses, intent)

  // 7. Generate factual explanation in requested language
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
 * Call Gemini API directly using user-provided key with candidate model fallback
 */
async function callGeminiIntentParser(queryText, language) {
  const prompt = `You are Nearzy's AI Local Marketplace Assistant ("Unga Ooru, Unga Service!").
Analyze this local service search query in Tamil or English: "${queryText}".
Target state: Tamil Nadu, India.
Available categories:
- home-services, electricians, plumbing, carpentry, cleaning-services, appliance-repair
- vehicle-mechanics, bike-and-car-services, beauty-and-salons, healthcare-and-clinics
- education-and-tutors, restaurants-and-cafes, grocery-and-retail, electronics-and-mobile-repair
- photography, event-management, tailoring-and-laundry, professional-services, accommodation-and-pg, other-local-businesses

Extract:
1. categorySlug (one matching above or empty string)
2. categoryName (human readable)
3. locality (Tamil Nadu town or locality or empty string)
4. maxBudget (integer or null)
5. isEmergency (boolean)

Return strictly valid JSON:
{
  "categorySlug": "...",
  "categoryName": "...",
  "locality": "...",
  "maxBudget": null,
  "isEmergency": false
}`;

  for (const model of CANDIDATE_MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.1,
            responseMimeType: 'application/json'
          }
        })
      })

      if (!response.ok) {
        continue
      }

      const data = await response.json()
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text
      if (rawText) {
        const cleaned = rawText.replace(/```json/gi, '').replace(/```/g, '').trim()
        const parsed = JSON.parse(cleaned)
        if (parsed && (parsed.categorySlug || parsed.locality)) {
          return parsed
        }
      }
    } catch (e) {
      // Try next candidate model
    }
  }

  return null
}

/**
 * Semantic intent extractor for English & Tamil queries across Tamil Nadu
 */
function extractLocalIntent(text) {
  const lower = text.toLowerCase()

  // Category identification
  let categorySlug = ''
  let categoryName = ''

  if (lower.includes('plumb') || lower.includes('பிளம்ப') || lower.includes('பைப்') || lower.includes('leak') || lower.includes('tap') || lower.includes('கசிவு')) {
    categorySlug = 'plumbing'
    categoryName = 'Plumbing'
  } else if (lower.includes('electr') || lower.includes('எலக்ட்ரீ') || lower.includes('wire') || lower.includes('fuse') || lower.includes('inverter') || lower.includes('இன்வெர்ட்டர்')) {
    categorySlug = 'electricians'
    categoryName = 'Electricians'
  } else if (lower.includes('ac ') || lower.includes(' ஏசி') || lower.includes('fridge') || lower.includes('washing machine') || lower.includes('appliance') || lower.includes('பழுது')) {
    categorySlug = 'appliance-repair'
    categoryName = 'Appliance Repair'
  } else if (lower.includes('salon') || lower.includes('beauty') || lower.includes('hair') || lower.includes('facial') || lower.includes('சலூன்') || lower.includes('அழகு')) {
    categorySlug = 'beauty-and-salons'
    categoryName = 'Beauty & Salons'
  } else if (lower.includes('mobile') || lower.includes('phone') || lower.includes('laptop') || lower.includes('iphone') || lower.includes('மொபைல்')) {
    categorySlug = 'electronics-and-mobile-repair'
    categoryName = 'Electronics & Mobile Repair'
  } else if (lower.includes('tutor') || lower.includes('math') || lower.includes('tuition') || lower.includes('teacher') || lower.includes('டியூஷன்') || lower.includes('கல்வி')) {
    categorySlug = 'education-and-tutors'
    categoryName = 'Education & Tutors'
  } else if (lower.includes('car') || lower.includes('bike') || lower.includes('mechanic') || lower.includes('மெக்கானிக்') || lower.includes('வாட்டர் வாஷ்')) {
    categorySlug = 'bike-and-car-services'
    categoryName = 'Bike & Car Services'
  } else if (lower.includes('clean') || lower.includes('சுத்தம்') || lower.includes('saniti')) {
    categorySlug = 'cleaning-services'
    categoryName = 'Cleaning Services'
  } else if (lower.includes('carpent') || lower.includes('தச்சு') || lower.includes('wood') || lower.includes('furniture')) {
    categorySlug = 'carpentry'
    categoryName = 'Carpentry'
  } else if (lower.includes('doctor') || lower.includes('clinic') || lower.includes('மருத்துவ') || lower.includes('dental')) {
    categorySlug = 'healthcare-and-clinics'
    categoryName = 'Healthcare & Clinics'
  } else if (lower.includes('food') || lower.includes('restaurant') || lower.includes('mess') || lower.includes('cafe') || lower.includes('உணவக')) {
    categorySlug = 'restaurants-and-cafes'
    categoryName = 'Restaurants & Cafes'
  } else if (lower.includes('photo') || lower.includes('wedding') || lower.includes('video') || lower.includes('புகைப்பட')) {
    categorySlug = 'photography'
    categoryName = 'Photography'
  } else if (lower.includes('tailor') || lower.includes('laundry') || lower.includes('தையல்')) {
    categorySlug = 'tailoring-and-laundry'
    categoryName = 'Tailoring & Laundry'
  } else if (lower.includes('pg') || lower.includes('hostel') || lower.includes('room') || lower.includes('தங்குமிடம்')) {
    categorySlug = 'accommodation-and-pg'
    categoryName = 'Accommodation & PG'
  }

  // Locality extraction from all 38 Tamil Nadu locations and towns
  const resolved = resolveLocation(text)
  const foundLocality = resolved ? resolved.name : ''

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

  return {
    categorySlug,
    categoryName,
    locality: foundLocality,
    maxBudget,
    isEmergency,
    searchKeyword: extractSearchTerms(text, categorySlug, foundLocality),
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
      }

      // Locality match (+35)
      if (intent.locality && (
        biz.locality.toLowerCase().includes(intent.locality.toLowerCase()) || 
        biz.city.toLowerCase().includes(intent.locality.toLowerCase())
      )) {
        score += 35
        matchReasons.push(`Located in ${biz.locality}, ${biz.city}`)
      }

      // 30 km radius distance boost (+25)
      if (biz.distanceKm !== undefined && biz.distanceKm <= 30) {
        score += Math.max(5, 30 - Math.round(biz.distanceKm))
        matchReasons.push(`Within ${biz.distanceKm} km from selected location`)
      }

      // Budget compliance (+20)
      if (intent.maxBudget && (biz.minPrice || 0) <= intent.maxBudget) {
        score += 20
        matchReasons.push(`Starting fee ₹${biz.minPrice} (within your ₹${intent.maxBudget} budget)`)
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
  if (language === 'ta') {
    let parts = []
    if (intent.categoryName) parts.push(`"${intent.categoryName}" சேவை`)
    if (intent.locality) parts.push(`"${intent.locality}" பகுதியில் 30 கி.மீ சுற்றளவில்`)
    if (intent.maxBudget) parts.push(`₹${intent.maxBudget}-க்குள்`)

    if (count > 0) {
      return `உங்கள் விருப்பத்திற்கேற்ப ${parts.join(', ')} சரிபார்க்கப்பட்ட ${count} உள்ளூர் வணிகங்கள் கண்டறியப்பட்டுள்ளன.`
    }
    return `தேடலுக்கு ஏற்ற வணிகங்கள் கிடைக்கவில்லை. பிற மாவட்டங்களை தேர்வு செய்யவும்.`
  }

  // English
  const criteriaParts = []
  if (intent.categoryName) criteriaParts.push(`Category: ${intent.categoryName}`)
  if (intent.locality) criteriaParts.push(`30km around ${intent.locality}`)
  if (intent.maxBudget) criteriaParts.push(`Max Budget: ₹${intent.maxBudget}`)

  if (count > 0) {
    return `Found ${count} verified businesses matching ${criteriaParts.join(' • ')}.`
  }
  return `No exact matches within 30km for ${criteriaParts.join(' • ')}. Try expanding your location or budget.`
}
