import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShieldCheck, Lock, Eye, MapPin, Database, Bell, UserCheck, Mail, Phone, ChevronRight, FileText, CheckCircle2 } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { PageTransition } from '@/components/common/PageTransition'

export function PrivacyPolicy() {
  const { language } = useLanguage()
  const isTa = language === 'ta'
  const [activeSection, setActiveSection] = useState('overview')

  const sections = [
    {
      id: 'overview',
      title: isTa ? '1. அறிமுகம் & நோக்கம்' : '1. Overview & Scope',
      icon: ShieldCheck,
      content: isTa ? (
        <div className="space-y-3">
          <p>
            Nearzy ("உங்க ஊரு, உங்க சேவை!") தமிழ்நாட்டின் 38 மாவட்டங்களிலும் உள்ளூர் சேவைகளையும் பொதுமக்களையும் இணைக்கும் நம்பகமான தளமாகும். உங்கள் தனிப்பட்ட தகவல்களின் பாதுகாப்பை உறுதி செய்வது எங்களின் முதன்மை கடமையாகும்.
          </p>
          <p>
            இந்த தனியுரிமைக் கொள்கை, நீங்கள் Nearzy வலைத்தளம் அல்லது சேவைகளைப் பயன்படுத்தும்போது உங்கள் தகவல்கள் எவ்வாறு சேகரிக்கப்படுகின்றன, பயன்படுத்தப்படுகின்றன மற்றும் பாதுகாக்கப்படுகின்றன என்பதை விளக்குகிறது.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <p>
            Nearzy ("Unga Ooru, Unga Service!") is committed to safeguarding your personal data and privacy across all 38 revenue districts of Tamil Nadu. This Privacy Policy details our transparent policies regarding the collection, use, spatial calculation, and protection of your personal information.
          </p>
          <p>
            By accessing or using the Nearzy marketplace, booking verified services, or listing a local business, you acknowledge the practices described in this policy.
          </p>
        </div>
      )
    },
    {
      id: 'collection',
      title: isTa ? '2. நாங்கள் சேகரிக்கும் தகவல்கள்' : '2. Information We Collect',
      icon: Database,
      content: isTa ? (
        <div className="space-y-3">
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>கணக்கு விவரங்கள்:</strong> பெயர், மின்னஞ்சல் முகவரி, தொடர்பு தொலைபேசி எண் மற்றும் கடவுச்சொல்.</li>
            <li><strong>சேவை முன்பதிவு தகவல்கள்:</strong> முன்பதிவு செய்யும் நாள், நேரம், சேவை முகவரி மற்றும் சிறப்பு தேவைகள்.</li>
            <li><strong>வணிக வழங்குநர் விவரங்கள்:</strong> வணிகப் பெயர், கடை முகவரி, ஜி.பி.எஸ் ஆயத்தொலைவுகள் (Latitude/Longitude), சேவைப் பிரிவுகள் மற்றும் ஆரம்ப கட்டணங்கள்.</li>
            <li><strong>AI தேடல் தகவல்கள்:</strong> AI உதவியாளரிடம் கேட்கப்படும் சேவைத் தேவைகள் மற்றும் பட்ஜெட் விவரங்கள்.</li>
          </ul>
        </div>
      ) : (
        <div className="space-y-3">
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Personal Account Credentials:</strong> Full name, verified mobile phone number, email address, and authentication tokens.</li>
            <li><strong>Service Request & Booking Information:</strong> Scheduled appointment dates, preferred time slots, doorstep service address, and optional service notes.</li>
            <li><strong>Service Provider & Business Data:</strong> Business entity name, trade category, physical storefront address, exact GPS coordinates, starting tariffs, and trade verification documents.</li>
            <li><strong>AI Assistant Conversations:</strong> Natural language queries submitted to Nearzy AI for interpreting category, budget, and local recommendations.</li>
          </ul>
        </div>
      )
    },
    {
      id: 'spatial-privacy',
      title: isTa ? '3. 30 கி.மீ சுற்றளவு மற்றும் இருப்பிட தனியுரிமை' : '3. 30 km Radius & Spatial Privacy',
      icon: MapPin,
      content: isTa ? (
        <div className="space-y-3">
          <p>
            Nearzy என்பது ஹைப்பர்-லோக்கல் (Hyper-local) சந்தையாகும். உங்கள் இருப்பிடத்தை அடிப்படையாகக் கொண்டு 30 கி.மீ சுற்றளவில் உள்ள சரிபார்க்கப்பட்ட நிபுணர்களைக் கண்டறிய மட்டுமே உங்களின் அனுமதி பெற்ற பின்னரே ஜி.பி.எஸ் அல்லது ஊர் பெயர் பயன்படுத்தப்படுகிறது.
          </p>
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-950 font-medium text-xs">
            🔒 உங்கள் நேரடி ஜி.பி.எஸ் இருப்பிடம் ஒருபோதும் மூன்றாம் தரப்பினருக்கு விற்கப்படாது. சேவை முன்பதிவு செய்யப்படும் போது மட்டுமே தொடர்புடைய சேவை வழங்குநருக்கு உங்கள் முகவரி பகிரப்படும்.
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <p>
            Nearzy functions as a true hyper-local marketplace. Location coordinates are strictly processed using the mathematical Haversine formula to identify verified service providers operating within a 30 km radius of your selected town or device location.
          </p>
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-950 font-medium text-xs">
            🔒 We never track your background location without explicit user intent. Exact doorstep coordinates are shared solely with the specific verified professional you choose to book.
          </div>
        </div>
      )
    },
    {
      id: 'data-use',
      title: isTa ? '4. தகவல்கள் எவ்வாறு பயன்படுத்தப்படுகின்றன?' : '4. How We Use Your Data',
      icon: Eye,
      content: isTa ? (
        <div className="space-y-3">
          <ul className="list-disc pl-5 space-y-2">
            <li>உங்களுக்கு அருகில் உள்ள 30 கி.மீ சுற்றளவில் உள்ள சிறந்த சேவை வழங்குநர்களைக் காட்டுதல்.</li>
            <li>முன்பதிவு நிலையை உறுதிசெய்து உடனடி எஸ்.எம்.எஸ் / தொலைபேசி அறிவிப்புகளை வழங்குதல்.</li>
            <li>Nearzy AI உதவியாளர் மூலம் துல்லியமான பட்ஜெட் மற்றும் நிபுணர்களைப் பரிந்துரைத்தல்.</li>
            <li>மோசடிகளைத் தவிர்த்து தளத்தின் நம்பகத்தன்மையை உறுதி செய்தல்.</li>
          </ul>
        </div>
      ) : (
        <div className="space-y-3">
          <ul className="list-disc pl-5 space-y-2">
            <li>Matching you with verified service specialists situated strictly within 30 km of your locality.</li>
            <li>Dispatching booking confirmation receipts, status changes, and arrival alerts to your registered contact.</li>
            <li>Powering the Nearzy AI Recommendation Engine to rank providers transparently by proximity, budget, and customer rating.</li>
            <li>Protecting the community against fraudulent listings through multi-step identity verification.</li>
          </ul>
        </div>
      )
    },
    {
      id: 'security',
      title: isTa ? '5. தரவு பாதுகாப்பு & சேமிப்பு' : '5. Data Security & Encryption',
      icon: Lock,
      content: isTa ? (
        <div className="space-y-3">
          <p>
            அனைத்து பயனர் தரவுகளும் நவீன SSL/TLS குறியாக்கத்துடன் (Encryption) மற்றும் பாதுகாப்பான PostgreSQL தரவுத்தளத்தில் Row Level Security (RLS) விதிகளின் கீழ் பாதுகாக்கப்படுகின்றன.
          </p>
          <p>
            உங்கள் கடவுச்சொற்கள் குறியாக்கம் செய்யப்பட்டே சேமிக்கப்படுகின்றன; நிர்வாகிகளாலும் அவற்றை நேரடியாகப் பார்க்க முடியாது.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <p>
            All network transactions on Nearzy are encrypted in transit via industry-standard TLS 1.3 encryption. Database persistence is safeguarded by PostgreSQL Row-Level Security (RLS) protocols.
          </p>
          <p>
            User passwords and sensitive credentials undergo irreversible one-way cryptographic hashing before storage.
          </p>
        </div>
      )
    },
    {
      id: 'rights',
      title: isTa ? '6. உங்கள் உரிமைகள் & கட்டுப்பாடு' : '6. Your Rights & Data Controls',
      icon: UserCheck,
      content: isTa ? (
        <div className="space-y-3">
          <p>
            உங்கள் கணக்கு விவரங்களை எந்த நேரத்திலும் திருத்தவோ அல்லது நீக்கவோ உங்களுக்கு முழு உரிமை உண்டு. தரவு நீக்கம் அல்லது மாற்றத்திற்கு எங்கள் உதவி மையத்தைத் தொடர்பு கொள்ளலாம்.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <p>
            You retain full sovereignty over your personal data. You may inspect, rectify, or request deletion of your account and transaction history at any time by contacting our support desk.
          </p>
        </div>
      )
    },
    {
      id: 'contact',
      title: isTa ? '7. தொடர்பு & தனியுரிமை அலுவலர்' : '7. Contact & Privacy Desk',
      icon: Mail,
      content: (
        <div className="space-y-3">
          <p className="text-xs sm:text-sm">
            {isTa
              ? 'தனியுரிமைக் கொள்கை குறித்த கேள்விகள் அல்லது தரவு தொடர்பான கோரிக்கைகளுக்கு எங்களை நேரடியாகத் தொடர்பு கொள்ளவும்:'
              : 'If you have any questions or concerns regarding our privacy practices, please contact our dedicated Data Protection Desk:'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <a
              href="mailto:jothikap56@gmail.com"
              className="p-3.5 rounded-xl bg-neutral-900 text-white flex items-center gap-3 hover:bg-red-600 transition shadow-sm"
            >
              <Mail className="w-4 h-4 text-red-400" />
              <div>
                <span className="block text-[10px] text-neutral-400 uppercase font-bold">Email Support</span>
                <span className="text-xs font-bold">jothikap56@gmail.com</span>
              </div>
            </a>
            <a
              href="tel:+918838697749"
              className="p-3.5 rounded-xl bg-neutral-900 text-white flex items-center gap-3 hover:bg-red-600 transition shadow-sm"
            >
              <Phone className="w-4 h-4 text-red-400" />
              <div>
                <span className="block text-[10px] text-neutral-400 uppercase font-bold">Helpline & WhatsApp</span>
                <span className="text-xs font-bold">+91 88386 97749</span>
              </div>
            </a>
          </div>
        </div>
      )
    }
  ]

  return (
    <PageTransition>
      <div className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Header Banner */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 rounded-3xl bg-neutral-900 text-white border border-neutral-800 shadow-xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/20 text-red-400 border border-red-500/30 text-xs font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isTa ? 'அதிகாரப்பூர்வ தனியுரிமைக் கொள்கை' : 'Official Nearzy Privacy Policy'}</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                  {isTa ? 'தனியுரிமைக் கொள்கை' : 'Privacy Policy'}
                </h1>
                <p className="text-xs sm:text-sm text-neutral-400 max-w-xl leading-relaxed">
                  {isTa
                    ? 'Nearzy தளத்தில் உங்கள் தனிப்பட்ட தகவல்கள் மற்றும் 30 கி.மீ இருப்பிடத் தரவுகள் எவ்வாறு பாதுகாக்கப்படுகின்றன என்பதை அறியுங்கள்.'
                    : 'Learn how Nearzy protects your account, communication, and 30 km hyper-local spatial data across Tamil Nadu.'}
                </p>
                <div className="pt-2 text-[11px] text-neutral-500 font-medium">
                  {isTa ? 'கடைசியாக புதுப்பிக்கப்பட்டது: அக்டோபர் 2026' : 'Last Updated: October 2026 • Effective Statewide'}
                </div>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-white p-2.5 flex items-center justify-center shrink-0 shadow-lg border border-neutral-800">
                <img src="/logo.png" alt="Nearzy Logo" className="w-full h-full object-contain" />
              </div>
            </div>
          </motion.div>

          {/* Quick Jump & Sections Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar TOC */}
            <div className="lg:col-span-1 space-y-2">
              <span className="block text-xs font-black uppercase tracking-wider text-neutral-500 mb-3 px-2">
                {isTa ? 'பொருளடக்கம்' : 'Contents'}
              </span>
              <div className="space-y-1 sticky top-24">
                {sections.map(s => {
                  const Icon = s.icon
                  const isActive = activeSection === s.id
                  return (
                    <button
                      key={s.id}
                      onClick={() => {
                        setActiveSection(s.id)
                        const el = document.getElementById(s.id)
                        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
                      }}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-between ${
                        isActive
                          ? 'bg-red-600 text-white shadow-sm'
                          : 'bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-200'
                      }`}
                    >
                      <span className="flex items-center gap-2 truncate">
                        <Icon className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{s.title}</span>
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 opacity-60 shrink-0" />
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Sections Detailed Content */}
            <div className="lg:col-span-3 space-y-6">
              {sections.map((s, idx) => {
                const Icon = s.icon
                return (
                  <motion.div
                    key={s.id}
                    id={s.id}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    className="p-6 sm:p-7 rounded-3xl bg-white border border-neutral-200 shadow-soft space-y-4 hover:border-neutral-300 transition"
                  >
                    <div className="flex items-center gap-3 pb-3 border-b border-neutral-100">
                      <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <h2 className="text-lg font-black text-black">
                        {s.title}
                      </h2>
                    </div>

                    <div className="text-xs sm:text-sm text-neutral-700 leading-relaxed font-medium">
                      {s.content}
                    </div>
                  </motion.div>
                )
              })}

              {/* Bottom Quick Links */}
              <div className="p-6 rounded-2xl bg-neutral-100 border border-neutral-200 flex flex-wrap items-center justify-between gap-4">
                <span className="text-xs text-neutral-600 font-bold">
                  {isTa ? 'பிற கொள்கைகளை படிக்கவும்:' : 'Explore other platform documents:'}
                </span>
                <div className="flex items-center gap-4 text-xs font-black">
                  <Link to="/terms" className="text-red-600 hover:underline">
                    {isTa ? 'விதிமுறைகள் & நிபந்தனைகள்' : 'Terms of Service'}
                  </Link>
                  <span className="text-neutral-400">•</span>
                  <Link to="/support" className="text-red-600 hover:underline">
                    {isTa ? 'உதவி மையம்' : 'Help & Support Desk'}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
