import React, { createContext, useContext, useState, useEffect } from 'react'

const translations = {
  en: {
    // Brand & Header
    brandName: 'Nearzy',
    tagline: 'Unga Ooru, Unga Service!',
    navHome: 'Home',
    navExplore: 'Explore',
    navCategories: 'Categories',
    navHowItWorks: 'How It Works',
    navListBusiness: 'List Your Business',
    navLogin: 'Login',
    navSignUp: 'Sign Up',
    navDashboard: 'Dashboard',
    navCustomerPortal: 'Customer Dashboard',
    navOwnerPortal: 'Business Portal',
    navAdminPortal: 'Admin Console',
    navLogout: 'Sign Out',

    // Hero
    heroHeadline: 'Your Local Needs. One Smart Place.',
    heroSubtitle: 'Discover trusted local businesses, compare services, and find the right people for your everyday needs across Tamil Nadu.',
    searchPlaceholder: 'Find a plumber, salon, electrician, mechanic, tutor...',
    allLocalities: 'All Areas / Localities',
    searchAction: 'Search',
    askAiPrompt: 'Ask Nearzy AI',
    detectLocation: 'Detect My Location',
    detectingLocation: 'Detecting...',

    // Categories
    popularCategoriesTitle: 'Popular Categories',
    popularCategoriesSubtitle: 'Find skilled professionals and businesses for every local requirement',
    viewAllCategories: 'View All 20 Categories',
    servicesAvailable: 'services',

    // Featured & Businesses
    featuredTitle: 'Featured Local Services',
    featuredSubtitle: 'Top-rated, verified local service professionals ready to assist you',
    verifiedBadge: 'Verified',
    unverifiedBadge: 'Community Listing',
    claimedBadge: 'Claimed',
    unclaimedBadge: 'Unclaimed Listing',
    openNow: 'Open Now',
    closedNow: 'Closed',
    startingFrom: 'Starts from',
    approxDistance: 'approx.',
    viewDetails: 'View Details',
    bookNow: 'Book Service',

    // How it works
    howItWorksTitle: 'How Nearzy Works',
    howItWorksSubtitle: 'Simplifying local service discovery and reliable bookings in 4 simple steps',
    step1Title: 'Search or Ask AI',
    step1Desc: 'Describe what you need in Tamil or English, or browse 20+ specialized local categories.',
    step2Title: 'Compare & Select',
    step2Desc: 'Inspect upfront transparent prices, verified reviews, distance, and business photos.',
    step3Title: 'Book Instantly',
    step3Desc: 'Schedule a doorstep visit or clinic/shop appointment at your preferred date and time.',
    step4Title: 'Service Delivered',
    step4Desc: 'Receive certified service, pay directly, and leave honest feedback for our community.',

    // Business CTA
    businessCtaTitle: 'Are You a Local Business Owner or Service Professional?',
    businessCtaSubtitle: 'Join thousands of providers on Nearzy. Grow your customer reach, manage appointments online, and establish local trust.',
    registerYourBusiness: 'Register New Business',
    claimExistingBusiness: 'Claim Existing Listing',

    // Search Page
    searchTitle: 'Explore Local Businesses & Services',
    filtersHeading: 'Filters',
    clearAll: 'Clear All',
    categoryFilter: 'Category',
    localityFilter: 'Locality / Area',
    priceFilter: 'Starting Price (Max)',
    ratingFilter: 'Minimum Rating',
    availabilityFilter: 'Availability',
    openNowOnly: 'Open Now Only',
    bookingEnabledOnly: 'Instant Booking Available',
    verifiedOnly: 'Verified Businesses Only',
    sortBy: 'Sort By',
    sortRelevance: 'Relevance',
    sortRating: 'Highest Rated',
    sortReviews: 'Most Reviews',
    sortPriceLowHigh: 'Price: Low to High',
    sortPriceHighLow: 'Price: High to Low',
    noBusinessesFound: 'No businesses found matching your criteria',
    noBusinessesSubtitle: 'Try clearing filters, selecting another locality, or asking our AI Assistant for recommendations.',

    // Business Details
    overviewTab: 'Overview & Services',
    reviewsTab: 'Customer Reviews',
    aboutProvider: 'About Provider',
    yearsExperience: 'Years of Experience',
    serviceModes: 'Service Modes Available',
    modeDoorstep: 'At Customer Doorstep',
    modeShop: 'At Business Shop/Clinic',
    modeRemote: 'Online / Remote Consultation',
    openingHoursTitle: 'Working Hours',
    contactDetailsTitle: 'Contact Information',
    phoneLabel: 'Phone',
    emailLabel: 'Email',
    addressLabel: 'Address',
    websiteLabel: 'Website',
    callNow: 'Call Now',
    directions: 'Get Directions',
    reportListing: 'Report Listing',
    claimThisListing: 'Are you the owner of this business? Claim it now',

    // Reviews
    writeReviewTitle: 'Write a Review',
    rateYourExperience: 'Rate Your Experience',
    reviewCommentPlaceholder: 'Share details of your experience, service quality, and pricing punctuality...',
    submitReview: 'Submit Review',
    ownerResponseLabel: 'Business Owner Response',
    noReviewsYet: 'No customer reviews yet. Be the first to share your experience!',

    // Booking Modal
    bookingModalTitle: 'Book a Service',
    selectServiceLabel: 'Select Service',
    selectDateLabel: 'Service Date',
    selectTimeLabel: 'Preferred Time Slot',
    selectModeLabel: 'Service Mode',
    yourPhoneLabel: 'Contact Phone Number',
    doorstepAddressLabel: 'Service Location / Address',
    specialNotesLabel: 'Additional Details / Notes',
    estimatedTotal: 'Estimated Price',
    confirmBookingBtn: 'Confirm & Send Booking Request',
    bookingSuccessTitle: 'Booking Request Submitted!',
    bookingSuccessDesc: 'The business owner has been notified and will confirm your appointment shortly.',

    // Statuses
    statusPending: 'Pending Confirmation',
    statusAccepted: 'Accepted',
    statusRejected: 'Declined',
    statusConfirmed: 'Confirmed',
    statusInProgress: 'In Progress',
    statusCompleted: 'Completed',
    statusCancelled: 'Cancelled',

    // AI Assistant
    aiAssistantTitle: 'Nearzy AI Assistant',
    aiAssistantSubtitle: 'Tell us what you need in Tamil or English. We will interpret your requirements and find verified local businesses matching your budget.',
    aiInputPlaceholder: 'e.g. Find an AC technician in Velachery under ₹500 or தமிழ் பேசும் பிளம்பர்...',
    aiTryPrompts: 'Try asking:',
    aiSearchBtn: 'Interpret & Find',
    aiThinking: 'Interpreting requirements with Gemini AI...',
    aiInterpretedIntent: 'Parsed Intent',
    aiMatchReason: 'Why this matched',

    // Footer
    footerDesc: 'Nearzy is Tamil Nadu’s premier AI-powered local services marketplace. Connecting customers with verified neighbourhood businesses with transparent pricing and real-time bookings.',
    quickLinks: 'Quick Links',
    topCategories: 'Top Categories',
    popularLocalities: 'Popular Cities & Localities',
    copyright: '© 2026 Nearzy Technologies. All rights reserved. "Unga Ooru, Unga Service!"',
    privacyPolicy: 'Privacy Policy',
    termsOfService: 'Terms of Service',
    contactSupport: 'Help & Support',
  },

  ta: {
    // Brand & Header
    brandName: 'Nearzy',
    tagline: 'உங்க ஊரு, உங்க சர்வீஸ்!',
    navHome: 'முகப்பு',
    navExplore: 'சேவைகள்',
    navCategories: 'வகைகள்',
    navHowItWorks: 'எப்படி செயல்படுகிறது',
    navListBusiness: 'வணிகத்தை இணைக்கவும்',
    navLogin: 'உள்நுழை',
    navSignUp: 'பதிவு செய்',
    navDashboard: 'கட்டுப்பாட்டு அறை',
    navCustomerPortal: 'வாடிக்கையாளர் பக்கம்',
    navOwnerPortal: 'வணிகர் பக்கம்',
    navAdminPortal: 'நிர்வாகி பக்கம்',
    navLogout: 'வெளியேறு',

    // Hero
    heroHeadline: 'உங்கள் உள்ளூர் தேவைகள். ஒரே ஸ்மார்ட் தளம்.',
    heroSubtitle: 'நம்பகமான உள்ளூர் வணிகங்களைக் கண்டறியுங்கள், கட்டணங்களை ஒப்பிடுங்கள், எளிய முன்பதிவு செய்து சிறந்த சேவையைப் பெறுங்கள்.',
    searchPlaceholder: 'பிளம்பர், சலூன், எலக்ட்ரீஷியன், மெக்கானிக், டியூஷன் தேடுங்கள்...',
    allLocalities: 'அனைத்து பகுதிகள்',
    searchAction: 'தேடு',
    askAiPrompt: 'ஜோவாலா AI-யிடம் கேளுங்கள்',
    detectLocation: 'இருப்பிடத்தைக் கண்டறி',
    detectingLocation: 'கண்டறியப்படுகிறது...',

    // Categories
    popularCategoriesTitle: 'முக்கிய சேவை வகைகள்',
    popularCategoriesSubtitle: 'உங்கள் அனைத்து வீட்டு மற்றும் தொழில்முறை தேவைகளுக்கான திறமையான வல்லுநர்கள்',
    viewAllCategories: 'அனைத்து 20 வகைகளையும் காண்க',
    servicesAvailable: 'சேவைகள்',

    // Featured & Businesses
    featuredTitle: 'சிறந்த உள்ளூர் சேவைகள்',
    featuredSubtitle: 'உயர் மதிப்பீடு பெற்ற, சரிபார்க்கப்பட்ட நம்பகமான சேவை வழங்குநர்கள்',
    verifiedBadge: 'சரிபார்க்கப்பட்டது',
    unverifiedBadge: 'பொதுப் பதிவு',
    claimedBadge: 'உரிமைகோரிய வணிகம்',
    unclaimedBadge: 'உரிமைகோராத வணிகம்',
    openNow: 'இப்போது திறந்துள்ளது',
    closedNow: 'மூடப்பட்டுள்ளது',
    startingFrom: 'ஆரம்ப விலை',
    approxDistance: 'சுமார்',
    viewDetails: 'முழு விவரங்கள்',
    bookNow: 'முன்பதிவு செய்',

    // How it works
    howItWorksTitle: 'ஜோவாலா எப்படி செயல்படுகிறது?',
    howItWorksSubtitle: 'உள்ளூர் சேவை தேடலை 4 எளிய படிகளில் எளிதாக்குகிறது',
    step1Title: 'தேடுங்கள் அல்லது AI-யிடம் கேளுங்கள்',
    step1Desc: 'உங்கள் தேவையை தமிழில் அல்லது ஆங்கிலத்தில் தட்டச்சு செய்யுங்கள் அல்லது வகைகளை ஆராயுங்கள்.',
    step2Title: 'ஒப்பிட்டு தேர்வு செய்யுங்கள்',
    step2Desc: 'வெளிப்படையான கட்டணங்கள், வாடிக்கையாளர் மதிப்புரைகள் மற்றும் புகைப்படங்களை ஒப்பிடுங்கள்.',
    step3Title: 'உடனடி முன்பதிவு',
    step3Desc: 'உங்களுக்கு வசதியான தேதி மற்றும் நேரத்தில் இல்லத்திற்கோ கடைக்கோ முன்பதிவு செய்யுங்கள்.',
    step4Title: 'தரமான சேவை',
    step4Desc: 'சிறந்த சேவையைப் பெற்று, நேரடியாக கட்டணம் செலுத்தி, உங்கள் கருத்தைப் பகிருங்கள்.',

    // Business CTA
    businessCtaTitle: 'நீங்கள் உள்ளூர் வணிக உரிமையாளரா அல்லது சேவை வழங்குநரா?',
    businessCtaSubtitle: 'ஜோவாலாவில் இப்போதே இணையுங்கள். புதிய வாடிக்கையாளர்களைப் பெறுங்கள், உங்கள் வணிகத்தை எளிதாக நிர்வகியுங்கள்.',
    registerYourBusiness: 'புதிய வணிகத்தைப் பதிவு செய்',
    claimExistingBusiness: 'உங்கள் வணிகத்தை உரிமை கோருங்கள்',

    // Search Page
    searchTitle: 'உள்ளூர் வணிகங்கள் & சேவைகள்',
    filtersHeading: 'வடிகட்டிகள்',
    clearAll: 'அனைத்தையும் நீக்கு',
    categoryFilter: 'சேவை வகை',
    localityFilter: 'பகுதி / ஊர்',
    priceFilter: 'அதிகபட்ச கட்டணம்',
    ratingFilter: 'குறைந்தபட்ச மதிப்பீடு',
    availabilityFilter: 'கிடைக்கும் நிலை',
    openNowOnly: 'திறந்துள்ளவை மட்டும்',
    bookingEnabledOnly: 'முன்பதிவு வசதி உள்ளவை',
    verifiedOnly: 'சரிபார்க்கப்பட்டவை மட்டும்',
    sortBy: 'வரிசைப்படுத்து',
    sortRelevance: 'பொருத்தம்',
    sortRating: 'உயர்ந்த மதிப்பீடு',
    sortReviews: 'அதிக மதிப்புரைகள்',
    sortPriceLowHigh: 'கட்டணம்: குறைவு முதல் அதிகம்',
    sortPriceHighLow: 'கட்டணம்: அதிகம் முதல் குறைவு',
    noBusinessesFound: 'பொருத்தமான வணிகங்கள் எதுவும் கிடைக்கவில்லை',
    noBusinessesSubtitle: 'வடிகட்டிகளை மாற்றிப் பாருங்கள் அல்லது ஜோவாலா AI உதவியைப் பெறுங்கள்.',

    // Business Details
    overviewTab: 'விவரங்கள் & சேவைகள்',
    reviewsTab: 'வாடிக்கையாளர் மதிப்புரைகள்',
    aboutProvider: 'வழங்குநர் பற்றி',
    yearsExperience: 'ஆண்டுகள் அனுபவம்',
    serviceModes: 'கிடைக்கும் சேவை முறைகள்',
    modeDoorstep: 'இல்லத்துக்கே வந்து செய்யும் சேவை',
    modeShop: 'கடை / கிளினிக்கில் சேவை',
    modeRemote: 'இணையவழி ஆலோசனை',
    openingHoursTitle: 'செயல்படும் நேரம்',
    contactDetailsTitle: 'தொடர்பு விவரங்கள்',
    phoneLabel: 'தொலைபேசி',
    emailLabel: 'மின்னஞ்சல்',
    addressLabel: 'முகவரி',
    websiteLabel: 'வலைத்தளம்',
    callNow: 'அழைக்கவும்',
    directions: 'வழித்தடம் காண்க',
    reportListing: 'புகார் அளிக்கவும்',
    claimThisListing: 'நீங்கள் இதன் உரிமையாளரா? இப்போது உரிமை கோருங்கள்',

    // Reviews
    writeReviewTitle: 'மதிப்புரை எழுதவும்',
    rateYourExperience: 'உங்கள் மதிப்பீடு',
    reviewCommentPlaceholder: 'சேவையின் தரம், நேரம் தவறாமை மற்றும் கட்டணம் பற்றிய உங்கள் கருத்தைப் பகிருங்கள்...',
    submitReview: 'மதிப்புரையைச் சமர்ப்பி',
    ownerResponseLabel: 'வணிக உரிமையாளரின் பதில்',
    noReviewsYet: 'இன்னும் மதிப்புரைகள் இல்லை. முதல் மதிப்புரையை நீங்களே வழங்குங்கள்!',

    // Booking Modal
    bookingModalTitle: 'சேவை முன்பதிவு',
    selectServiceLabel: 'சேவையைத் தேர்ந்தெடுக்கவும்',
    selectDateLabel: 'விரும்பும் தேதி',
    selectTimeLabel: 'விரும்பும் நேரம்',
    selectModeLabel: 'சேவை முறை',
    yourPhoneLabel: 'தொடர்பு தொலைபேசி எண்',
    doorstepAddressLabel: 'சேவை முகவரி',
    specialNotesLabel: 'கூடுதல் குறிப்புகள்',
    estimatedTotal: 'மதிப்பிடப்பட்ட தொகை',
    confirmBookingBtn: 'முன்பதிவை உறுதி செய்',
    bookingSuccessTitle: 'முன்பதிவு கோரிக்கை அனுப்பப்பட்டது!',
    bookingSuccessDesc: 'வணிக உரிமையாளர் உங்கள் முன்பதிவை விரைவில் உறுதி செய்வார்.',

    // Statuses
    statusPending: 'நிலுவையில் உள்ளது',
    statusAccepted: 'ஏற்றுக்கொள்ளப்பட்டது',
    statusRejected: 'நிராகரிக்கப்பட்டது',
    statusConfirmed: 'உறுதிசெய்யப்பட்டது',
    statusInProgress: 'நடைபெறுகிறது',
    statusCompleted: 'நிறைவுற்றது',
    statusCancelled: 'ரத்து செய்யப்பட்டது',

    // AI Assistant
    aiAssistantTitle: 'Nearzy AI உதவியாளர்',
    aiAssistantSubtitle: 'உங்கள் தேவையை தமிழில் அல்லது ஆங்கிலத்தில் சொல்லுங்கள். ஜெமினி AI உங்கள் தேவையைப் புரிந்து கொண்டு சரியான வணிகங்களை பரிந்துரைக்கும்.',
    aiInputPlaceholder: 'உதா: வேளச்சேரியில் ₹500-க்குள் ஏசி மெக்கானிக் அல்லது அண்ணா நகரில் பிளம்பர்...',
    aiTryPrompts: 'உதாரணக் கேள்விகள்:',
    aiSearchBtn: 'புரிந்து கொண்டு தேடு',
    aiThinking: 'ஜெமினி AI உங்கள் தேவையை ஆராய்கிறது...',
    aiInterpretedIntent: 'கண்டறியப்பட்ட தேவை',
    aiMatchReason: 'பொருந்தியதற்கான காரணம்',

    // Footer
    footerDesc: 'Nearzy - தமிழ்நாட்டின் நவீன AI உள்ளூர் சேவை சந்தை. வெளிப்படையான கட்டணங்கள் மற்றும் எளிய முன்பதிவு வசதியுடன் உள்ளூர் வல்லுநர்களை இணைக்கிறது.',
    quickLinks: 'முக்கிய இணைப்புகள்',
    topCategories: 'முக்கிய பிரிவுகள்',
    popularLocalities: 'பிரபல பகுதிகள்',
    copyright: '© 2026 Nearzy டெக்னாலஜிஸ். அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை. "உங்க ஊரு, உங்க சர்வீஸ்!"',
    privacyPolicy: 'தனியுரிமைக் கொள்கை',
    termsOfService: 'விதிமுறைகள் & நிபந்தனைகள்',
    contactSupport: 'உதவி மையம்',
  }
}

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('nearzy_lang') || 'en'
  })

  useEffect(() => {
    localStorage.setItem('nearzy_lang', language)
    document.documentElement.lang = language
  }, [language])

  const t = (key) => {
    const currentDict = translations[language] || translations.en
    return currentDict[key] || translations.en[key] || key
  }

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'en' ? 'ta' : 'en'))
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
