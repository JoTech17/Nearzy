import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  Phone, Mail, MessageSquare, Clock, MapPin, Sparkles, 
  HelpCircle, ChevronDown, Send, CheckCircle2, ShieldCheck, 
  ArrowRight, ExternalLink, AlertCircle
} from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { useToast } from '@/context/ToastContext'
import { PageTransition } from '@/components/common/PageTransition'

export function HelpSupport({ onOpenAiModal }) {
  const { language, t } = useLanguage()
  const isTa = language === 'ta'
  const toast = useToast()

  const [openFaq, setOpenFaq] = useState(0)
  const [ticketName, setTicketName] = useState('')
  const [ticketEmail, setTicketEmail] = useState('')
  const [ticketPhone, setTicketPhone] = useState('')
  const [ticketCategory, setTicketCategory] = useState('booking')
  const [ticketMessage, setTicketMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const faqs = [
    {
      q: isTa 
        ? 'Nearzy 30 கி.மீ சுற்றளவு எவ்வாறு செயல்படுகிறது?' 
        : 'How does the 30 km spatial radius search work?',
      a: isTa
        ? 'Nearzy-யில் உங்கள் ஊர் அல்லது இருப்பிடத்தைத் தேர்ந்தெடுக்கும்போது, கணித ஹாவர்சைன் (Haversine) முறையில் உங்கள் இடத்திலிருந்து துல்லியமாக 30 கி.மீ சுற்றளவில் உள்ள சரிபார்க்கப்பட்ட நிபுணர்கள் மட்டுமே வரிசைப்படுத்தப்படுகிறார்கள். இதனால் மிகக் குறைந்த நேரத்தில் உங்கள் இல்லத்திற்கு சேவை கிடைப்பது உறுதி செய்யப்படுகிறது.'
        : 'When you search or specify your town/district, Nearzy computes the exact geodesic distance to all verified providers using the Haversine formula. Only providers located within a strict 30 km radius are retrieved and ranked by proximity and rating, guaranteeing rapid doorstep arrival.'
    },
    {
      q: isTa 
        ? 'சேவையை முன்பதிவு செய்வது எப்படி?' 
        : 'How do I book a local service provider on Nearzy?',
      a: isTa
        ? '1. முகப்பு அல்லது தேடல் பக்கத்தில் உங்கள் சேவை வகையைத் தேர்ந்தெடுக்கவும்.\n2. உங்கள் ஊரைக் குறிப்பிட்டு 30 கி.மீ சுற்றளவில் உள்ள நிபுணர்களின் விவரம் மற்றும் கட்டணங்களை ஒப்பிடுங்கள்.\n3. "Book Now" பொத்தானை அழுத்தி, தேதி, நேரம் மற்றும் முகவரியை உள்ளிட்டு முன்பதிவை உறுதிசெய்யவும்.'
        : '1. Browse categories or use the AI Assistant to find your required service.\n2. Compare transparent starting fees, verified community reviews, and travel distances within 30 km.\n3. Click "Book Now" on your preferred provider, choose your date/time slot, and submit. You can track live confirmation under "My Bookings"!'
    },
    {
      q: isTa 
        ? 'என் கடையை அல்லது சேவையை Nearzy-யில் பதிவு செய்வது எப்படி?' 
        : 'How do I register my business or service on Nearzy?',
      a: isTa
        ? 'மேல் உள்ள வழிசெலுத்தல் பட்டியில் "வணிகத்தை இணைக்கவும்" (List Business) கிளிக் செய்யவும். உங்கள் கடைப் பெயர், தமிழ்நாடு வரைபடத்தில் சரியான இடம், தொலைபேசி எண் மற்றும் தொடக்கக் கட்டணங்களை உள்ளிட்டால் உங்கள் வணிகம் உடனடியாக வாடிக்கையாளர்களுக்குத் தெரியும்!'
        : 'Click "List Business" on the navigation bar. Create a Service Partner account, pinpoint your shop location directly on our Tamil Nadu interactive map, add your service list with starting prices, and publish. Your listing goes live across your 30 km territory within minutes!'
    },
    {
      q: isTa 
        ? 'Nearzy சேவை வழங்குநர்கள் எவ்வாறு சரிபார்க்கப்படுகிறார்கள்?' 
        : 'How does Nearzy verify service partners and ensure quality?',
      a: isTa
        ? 'அனைத்து சேவை வழங்குநர்களும் நேரில் ஆவணங்கள், வணிக முகவரி, தொழில் அனுபவம் மற்றும் தொடர்பு எண்களை சரிபார்த்த பிறகே "Verified" முத்திரை பெறுகின்றனர். மேலும் வாடிக்கையாளர் மதிப்பீடுகள் மூலம் தொடர் தரம் கண்காணிக்கப்படுகிறது.'
        : 'All service partners undergo identity verification, physical storefront inspection, and trade experience checks. Real customer ratings and transparent feedback loops ensure sustained service quality.'
    },
    {
      q: isTa 
        ? 'Nearzy தளத்தைப் பயன்படுத்த வாடிக்கையாளர்களுக்கு கட்டணம் உண்டா?' 
        : 'Is Nearzy free to use for customers?',
      a: isTa
        ? 'ஆம்! Nearzy தளத்தில் சேவைகளை தேடுவதும், AI உதவியாளரைப் பயன்படுத்துவதும், முன்பதிவு செய்வதும் 100% இலவசம். சேவை முடிந்த பிறகு ஒப்புக்கொண்ட கட்டணத்தை மட்டுமே நேரடியாக சேவை வழங்குநரிடம் செலுத்த வேண்டும்.'
        : 'Yes! Searching, AI queries, provider comparisons, and booking requests on Nearzy are completely 100% free for all customers. You only settle the transparent service fee directly with your specialist after the job is completed.'
    },
    {
      q: isTa 
        ? 'முன்பதிவை ரத்து செய்வது அல்லது மாற்றுவது எப்படி?' 
        : 'How do I cancel or reschedule an appointment?',
      a: isTa
        ? 'உங்கள் "My Bookings" பக்கத்திற்குச் சென்று, நிலுவையில் உள்ள எந்த முன்பதிவையும் சேவை வழங்குநர் புறப்படுவதற்கு முன் இலவசமாக ரத்து செய்யலாம் அல்லது நேரத்தை மாற்றிக்கொள்ளலாம்.'
        : 'Navigate to "My Bookings" from the menu. You can cancel or reschedule any upcoming booking free of penalty prior to provider dispatch.'
    }
  ]

  const handleTicketSubmit = (e) => {
    e.preventDefault()
    if (!ticketName || !ticketEmail || !ticketPhone || !ticketMessage) {
      toast.error('Please fill in all required contact fields.')
      return
    }

    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      setSubmitted(true)
      toast.success('Your support ticket has been received. Our team will contact you shortly!')
    }, 900)
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Header Banner */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 sm:p-10 rounded-3xl bg-neutral-900 text-white border border-neutral-800 shadow-xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/20 text-red-400 border border-red-500/30 text-xs font-bold">
                  <HelpCircle className="w-4 h-4" />
                  <span>{isTa ? '24/7 உதவி & வாடிக்கையாளர் மையம்' : 'Customer & Partner Support Hub'}</span>
                </div>
                <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
                  {isTa ? 'உங்களுக்கு உதவ நாங்கள் தயார்!' : 'How can we help you today?'}
                </h1>
                <p className="text-xs sm:text-sm text-neutral-300 max-w-xl leading-relaxed font-medium">
                  {isTa
                    ? 'Nearzy உதவி மையம் மூலம் நேரடி தொலைபேசி அழைப்பு, வாட்ஸ்அப் அல்லது AI உதவியாளர் மூலம் உங்கள் சந்தேகங்களுக்கு உடனடி தீர்வைப் பெறுங்கள்.'
                    : 'Get fast support for service bookings, provider verification, tariff enquiries, or platform guidance across Tamil Nadu.'}
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={onOpenAiModal}
                    className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-white hover:text-black text-white text-xs font-black transition flex items-center gap-2 shadow-sm"
                  >
                    <Sparkles className="w-4 h-4 animate-pulse" />
                    <span>{isTa ? 'Nearzy AI-யிடம் உடனடி விடை கேளுங்கள்' : 'Ask Nearzy AI Assistant'}</span>
                  </button>
                  <a
                    href="tel:+918838697749"
                    className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold transition flex items-center gap-2 border border-neutral-700"
                  >
                    <Phone className="w-3.5 h-3.5 text-red-400" />
                    <span>+91 88386 97749</span>
                  </a>
                </div>
              </div>

              <div className="w-20 h-20 rounded-2xl bg-white p-3 flex items-center justify-center shrink-0 shadow-xl border border-neutral-800">
                <img src="/logo.png" alt="Nearzy Logo" className="w-full h-full object-contain" />
              </div>
            </div>
          </motion.div>

          {/* Quick Contact Channel Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Phone Card */}
            <motion.a
              href="tel:+918838697749"
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="p-6 rounded-3xl bg-white border border-neutral-200 shadow-soft hover:border-red-500 hover:shadow-card transition flex flex-col justify-between group"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-4 group-hover:bg-red-600 group-hover:text-white transition">
                  <Phone className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-base text-black mb-1">
                  {isTa ? 'தொலைபேசி ஆதரவு' : 'Phone Helpline'}
                </h3>
                <p className="text-xs text-neutral-500 font-medium leading-relaxed mb-3">
                  {isTa ? 'நேரடி அழைப்பு மூலம் முன்பதிவு உதவி பெறுங்கள்.' : 'Speak directly with our support specialists.'}
                </p>
              </div>
              <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs font-black text-red-600">
                <span>+91 88386 97749</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.a>

            {/* WhatsApp Card */}
            <motion.a
              href="https://wa.me/918838697749?text=Hello%20Nearzy%20Support,%20I%20need%20assistance%20with%20a%20service."
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="p-6 rounded-3xl bg-white border border-neutral-200 shadow-soft hover:border-green-500 hover:shadow-card transition flex flex-col justify-between group"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center mb-4 group-hover:bg-green-600 group-hover:text-white transition">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-base text-black mb-1">
                  WhatsApp Chat
                </h3>
                <p className="text-xs text-neutral-500 font-medium leading-relaxed mb-3">
                  {isTa ? 'வாட்ஸ்அப் மூலம் உடனடி தகவல் மற்றும் உதவி.' : 'Quick messaging, photos & booking queries.'}
                </p>
              </div>
              <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs font-black text-green-600">
                <span>Chat on WhatsApp</span>
                <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.a>

            {/* Email Card */}
            <motion.a
              href="mailto:jothikap56@gmail.com"
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="p-6 rounded-3xl bg-white border border-neutral-200 shadow-soft hover:border-red-500 hover:shadow-card transition flex flex-col justify-between group"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-4 group-hover:bg-red-600 group-hover:text-white transition">
                  <Mail className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-base text-black mb-1">
                  {isTa ? 'மின்னஞ்சல் உதவி' : 'Email Support'}
                </h3>
                <p className="text-xs text-neutral-500 font-medium leading-relaxed mb-3">
                  {isTa ? 'விரிவான கோரிக்கைகள் மற்றும் வணிக பதிவுகள்.' : 'Official enquiries, claims & partner support.'}
                </p>
              </div>
              <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs font-black text-red-600">
                <span className="truncate">jothikap56@gmail.com</span>
                <ArrowRight className="w-3.5 h-3.5 shrink-0 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.a>

            {/* Operating Hours Card */}
            <motion.div
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="p-6 rounded-3xl bg-white border border-neutral-200 shadow-soft transition flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-neutral-100 text-neutral-800 flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-base text-black mb-1">
                  {isTa ? 'செயல்படும் நேரம்' : 'Hours & Coverage'}
                </h3>
                <p className="text-xs text-neutral-500 font-medium leading-relaxed mb-3">
                  {isTa ? 'திங்கள் - ஞாயிறு (காலை 8:00 - இரவு 9:00)' : 'Mon – Sun: 8:00 AM – 9:00 PM IST across 38 districts.'}
                </p>
              </div>
              <div className="pt-2 border-t border-neutral-100 flex items-center gap-1.5 text-xs font-bold text-neutral-700">
                <MapPin className="w-3.5 h-3.5 text-red-600" />
                <span>Tamil Nadu Statewide</span>
              </div>
            </motion.div>
          </div>

          {/* Two-Column Layout: FAQ Accordion + Interactive Support Ticket Form */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: FAQ Accordion (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="space-y-1 mb-6">
                <span className="text-xs font-black uppercase tracking-wider text-red-600">
                  {isTa ? 'அடிக்கடி கேட்கப்படும் கேள்விகள்' : 'Frequently Asked Questions'}
                </span>
                <h2 className="text-2xl font-black text-black tracking-tight">
                  {isTa ? 'பொதுவான கேள்விகளும் பதில்களும்' : 'Got questions? We have answers.'}
                </h2>
              </div>

              <div className="space-y-3">
                {faqs.map((faq, idx) => {
                  const isOpen = openFaq === idx
                  return (
                    <motion.div
                      key={idx}
                      initial={false}
                      className="rounded-2xl border border-neutral-200 bg-white overflow-hidden shadow-soft transition"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaq(isOpen ? null : idx)}
                        className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-black hover:text-red-600 transition"
                      >
                        <span className="font-extrabold text-sm text-black flex items-center gap-2.5">
                          <span className="w-6 h-6 rounded-full bg-neutral-100 text-neutral-700 text-xs flex items-center justify-center shrink-0 font-black">
                            {idx + 1}
                          </span>
                          <span>{faq.q}</span>
                        </span>
                        <ChevronDown className={`w-4 h-4 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-red-600' : 'text-neutral-400'}`} />
                      </button>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="px-5 pb-5 text-xs text-neutral-600 leading-relaxed font-medium whitespace-pre-line border-t border-neutral-100 pt-3"
                          >
                            {faq.a}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )
                })}
              </div>
            </div>

            {/* Right: Support Ticket Form (5 cols) */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-white border border-neutral-200 shadow-soft space-y-6"
            >
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-red-600 block mb-1">
                  {isTa ? 'நேரடி செய்தி' : 'Direct Message'}
                </span>
                <h3 className="text-xl font-black text-black tracking-tight">
                  {isTa ? 'ஆதரவுக் குழுவிற்கு செய்தி அனுப்பவும்' : 'Submit a Support Ticket'}
                </h3>
                <p className="text-xs text-neutral-500 font-medium mt-1">
                  {isTa ? 'எங்கள் குழு உங்கள் செய்திக்கு 2 மணி நேரத்தில் பதிலளிக்கும்.' : 'Our help desk responds within 2 hours.'}
                </p>
              </div>

              {submitted ? (
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="p-6 rounded-2xl bg-red-50 border border-red-200 text-center space-y-3"
                >
                  <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="font-black text-base text-black">
                    {isTa ? 'செய்தி பெறப்பட்டது!' : 'Ticket Received!'}
                  </h4>
                  <p className="text-xs text-neutral-600 font-medium">
                    {isTa
                      ? 'உங்கள் கோரிக்கையை பெற்றுக்கொண்டோம். விரைவில் எங்கள் வாடிக்கையாளர் அலுவலர் உங்களைத் தொடர்புகொள்வார்.'
                      : 'Thank you for reaching out. A Nearzy support representative will contact you via email or phone shortly.'}
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false)
                      setTicketMessage('')
                    }}
                    className="mt-2 px-4 py-2 rounded-xl bg-black text-white text-xs font-bold hover:bg-neutral-800 transition"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleTicketSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                      {isTa ? 'உங்கள் பெயர் *' : 'Full Name *'}
                    </label>
                    <input
                      type="text"
                      value={ticketName}
                      onChange={(e) => setTicketName(e.target.value)}
                      placeholder="e.g. Anandha Kumar"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:border-red-600 focus:ring-2 focus:ring-red-100 outline-none font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                        {isTa ? 'மின்னஞ்சல் *' : 'Email *'}
                      </label>
                      <input
                        type="email"
                        value={ticketEmail}
                        onChange={(e) => setTicketEmail(e.target.value)}
                        placeholder="you@email.com"
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:border-red-600 focus:ring-2 focus:ring-red-100 outline-none font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                        {isTa ? 'தொலைபேசி எண் *' : 'Phone *'}
                      </label>
                      <input
                        type="tel"
                        value={ticketPhone}
                        onChange={(e) => setTicketPhone(e.target.value)}
                        placeholder="+91 98..."
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:border-red-600 focus:ring-2 focus:ring-red-100 outline-none font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                      {isTa ? 'கோரிக்கை வகை' : 'Category / Topic'}
                    </label>
                    <select
                      value={ticketCategory}
                      onChange={(e) => setTicketCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:border-red-600 focus:ring-2 focus:ring-red-100 outline-none font-medium bg-white"
                    >
                      <option value="booking">Service Booking Assistance</option>
                      <option value="business">List My Shop / Business Registration</option>
                      <option value="dispute">Tariff & Provider Dispute</option>
                      <option value="feedback">General Feedback & Suggestion</option>
                      <option value="other">Other Inquiry</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                      {isTa ? 'உங்கள் செய்தி / சிக்கல் *' : 'How can we help? *'}
                    </label>
                    <textarea
                      rows={4}
                      value={ticketMessage}
                      onChange={(e) => setTicketMessage(e.target.value)}
                      placeholder={isTa ? 'உங்கள் தேவை அல்லது சிக்கலை விரிவாக எழுதவும்...' : 'Describe your request, booking ID, or shop enquiry in detail...'}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:border-red-600 focus:ring-2 focus:ring-red-100 outline-none font-medium resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 rounded-xl bg-red-600 hover:bg-black text-white text-xs font-black transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                  >
                    {submitting ? (
                      <span>Sending Message...</span>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>{isTa ? 'செய்தியை அனுப்புக' : 'Send Support Ticket'}</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
