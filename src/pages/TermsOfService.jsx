import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FileText, CheckCircle2, AlertTriangle, ShieldCheck, DollarSign, Clock, HelpCircle, Mail, Phone, ChevronRight, Scale } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { PageTransition } from '@/components/common/PageTransition'

export function TermsOfService() {
  const { language } = useLanguage()
  const isTa = language === 'ta'
  const [activeSection, setActiveSection] = useState('acceptance')

  const terms = [
    {
      id: 'acceptance',
      title: isTa ? '1. விதிமுறைகளை ஏற்றுக்கொள்ளுதல்' : '1. Acceptance of Terms',
      icon: Scale,
      content: isTa ? (
        <div className="space-y-3">
          <p>
            Nearzy ("உங்க ஊரு, உங்க சேவை!") தளத்தை அணுகுவதன் மூலமோ அல்லது பயன்படுத்துவதன் மூலமோ, நீங்கள் இந்த விதிமுறைகள் மற்றும் நிபந்தனைகளை முழுமையாக ஏற்றுக்கொள்கிறீர்கள்.
          </p>
          <p>
            நீங்கள் இந்த விதிமுறைகளை ஏற்காவிட்டால், Nearzy வலைத்தளம் மற்றும் சேவைகளைப் பயன்படுத்துவதை தவிர்க்கவும்.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <p>
            By accessing, browsing, or utilizing the Nearzy hyper-local service platform ("Unga Ooru, Unga Service!"), you unequivocally agree to be bound by these Terms of Service and all incorporated platform policies.
          </p>
          <p>
            These terms govern your rights and responsibilities across all 38 revenue districts of Tamil Nadu, whether you participate as a Customer seeking services or as a verified Service Partner.
          </p>
        </div>
      )
    },
    {
      id: 'platform-role',
      title: isTa ? '2. Nearzy தளத்தின் பங்கு' : '2. Nearzy Platform Facilitator Role',
      icon: ShieldCheck,
      content: isTa ? (
        <div className="space-y-3">
          <p>
            Nearzy என்பது வாடிக்கையாளர்களையும், 30 கி.மீ சுற்றளவில் உள்ள சரிபார்க்கப்பட்ட உள்ளூர் சுதந்திர சேவை வழங்குநர்களையும் (Freelancers / Shop Owners) நேரடியாக இணைக்கும் ஒரு தொழில்நுட்ப தளமாகும்.
          </p>
          <div className="p-3.5 rounded-xl bg-neutral-100 border border-neutral-300 text-xs text-neutral-800">
            💡 Nearzy சேவை வழங்குநர்களை நேரடியாக வேலைக்கு அமர்த்துவதில்லை; மாறாக அவர்களின் திறன்கள், ஆவணங்கள் மற்றும் கட்டணங்களை சரிபார்த்து வாடிக்கையாளர்களுடன் இணைக்கும் பாலமாக செயல்படுகிறது.
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <p>
            Nearzy operates as a digital technology marketplace connecting residents directly with independently owned neighbourhood service businesses and certified freelance tradespeople located within a 30 km radius.
          </p>
          <div className="p-3.5 rounded-xl bg-neutral-100 border border-neutral-300 text-xs text-neutral-800">
            💡 Nearzy verifies credentials, trade experience, and shop storefronts. Providers operate as independent contractors responsible for the professional execution of requested tasks.
          </div>
        </div>
      )
    },
    {
      id: 'customer-rules',
      title: isTa ? '3. வாடிக்கையாளர் பொறுப்புகள்' : '3. Customer Obligations & Conduct',
      icon: CheckCircle2,
      content: isTa ? (
        <div className="space-y-3">
          <ul className="list-disc pl-5 space-y-2">
            <li>முன்பதிவின் போது சரியான பெயர், செல்லுபடியாகும் தொடர்பு எண் மற்றும் துல்லியமான சேவை முகவரியை வழங்குதல்.</li>
            <li>முன்பதிவு செய்யப்பட்ட நேரத்தில் சேவை வழங்குநர் பணியைத் தொடங்க தேவையான வசதிகளைச் செய்து தருதல்.</li>
            <li>பணி நிறைவடைந்ததும் ஒப்புக்கொண்ட கட்டணத்தை நேரடியாக சேவை வழங்குநரிடம் உரிய நேரத்தில் செலுத்துதல்.</li>
            <li>சேவை வழங்குநர்களிடம் கண்ணியமாகவும் மரியாதையுடனும் நடந்துகொள்ளுதல்.</li>
          </ul>
        </div>
      ) : (
        <div className="space-y-3">
          <ul className="list-disc pl-5 space-y-2">
            <li>Provide accurate contact credentials, verified phone numbers, and physical doorstep coordinates upon requesting an appointment.</li>
            <li>Ensure reasonable and safe access to your premises for the scheduled tradesperson at the designated time slot.</li>
            <li>Directly settle the agreed service fee with the service provider upon satisfactory completion of work.</li>
            <li>Maintain courteous, safe, and professional conduct during all service interactions.</li>
          </ul>
        </div>
      )
    },
    {
      id: 'provider-rules',
      title: isTa ? '4. சேவை வழங்குநர் கடமைகள்' : '4. Service Partner Standards',
      icon: FileText,
      content: isTa ? (
        <div className="space-y-3">
          <ul className="list-disc pl-5 space-y-2">
            <li>உண்மையான வணிக விவரங்கள், தகுதி சான்றிதழ்கள் மற்றும் ஆரம்ப கட்டணங்களை வெளிப்படையாகப் பதிவு செய்தல்.</li>
            <li>ஒப்புக்கொண்ட 30 கி.மீ சுற்றளவுக்குள் குறித்த நேரத்தில் வாடிக்கையாளரின் இருப்பிடத்திற்குச் சென்று சேவையை வழங்குதல்.</li>
            <li>வாடிக்கையாளரிடம் கூடுதல் மறைமுகக் கட்டணங்கள் வசூலிக்காமல் நியாயமான மதிப்பீடுகளை வழங்குதல்.</li>
            <li>பாதுகாப்பு விதிகள் மற்றும் தரமான பொருட்களைப் பயன்படுத்தி பணியை முடித்தல்.</li>
          </ul>
        </div>
      ) : (
        <div className="space-y-3">
          <ul className="list-disc pl-5 space-y-2">
            <li>Maintain accurate storefront details, authentic portfolio images, and transparent starting service tariffs.</li>
            <li>Honor accepted bookings and arrive punctually at customer doorsteps within the committed 30 km territory.</li>
            <li>Provide fair, itemized quotes prior to undertaking supplementary repairs with zero hidden surcharges.</li>
            <li>Adhere to industry safety protocols and maintain appropriate trade certifications.</li>
          </ul>
        </div>
      )
    },
    {
      id: 'pricing-payment',
      title: isTa ? '5. கட்டணம் & பணம் செலுத்தும் முறை' : '5. Transparent Pricing & Settlement',
      icon: DollarSign,
      content: isTa ? (
        <div className="space-y-3">
          <p>
            Nearzy தளத்தில் சேவைகளை தேடுவதும், நிபுணர்களை ஒப்பிடுவதும், முன்பதிவு செய்வதும் <strong>100% இலவசம்</strong>!
          </p>
          <p>
            ஒவ்வொரு வணிகரின் ஆரம்பக் கட்டணம் (குறைந்தபட்சம் ₹149 முதல்) தளத்தில் வெளிப்படையாகக் காட்டப்படுகிறது. இறுதி கட்டணம் பணியின் அளவைப் பொறுத்து வாடிக்கையாளர் மற்றும் சேவை வழங்குநரால் முடிவு செய்யப்பட்டு, பணி முடிந்ததும் நேரடியாக செலுத்தப்படுகிறது.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <p>
            Browsing, querying the AI Assistant, comparing verified providers, and submitting booking requests on Nearzy is <strong>100% free for all customers</strong>.
          </p>
          <p>
            Each partner listing displays upfront starting prices (from ₹149). Work is settled directly between customer and provider via Cash, UPI, or Card upon completion of the task.
          </p>
        </div>
      )
    },
    {
      id: 'cancellation',
      title: isTa ? '6. ரத்து செய்தல் & மறுதிட்டமிடல்' : '6. Cancellations & Rescheduling',
      icon: Clock,
      content: isTa ? (
        <div className="space-y-3">
          <p>
            சேவை வழங்குநர் உங்கள் இருப்பிடத்திற்கு புறப்படுவதற்கு முன் எந்தவித அபராதமும் இன்றி முன்பதிவை இலவசமாக ரத்து செய்யலாம் அல்லது நேரத்தை மாற்றிக்கொள்ளலாம்.
          </p>
          <p>
            ஏதேனும் அவசர சிக்கல் அல்லது உதவி தேவைப்பட்டால் எங்கள் உதவி மையத்தை உடனடியாகத் தொடர்பு கொள்ளவும்.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <p>
            Customers may cancel or reschedule any pending or confirmed booking free of charge prior to provider dispatch directly through the "My Bookings" portal.
          </p>
          <p>
            Repeated unexcused cancellations after a provider has arrived on-site may result in account review to protect provider transit costs.
          </p>
        </div>
      )
    },
    {
      id: 'disputes',
      title: isTa ? '7. பிணக்கு தீர்வு & உதவி மையம்' : '7. Dispute Resolution & Jurisdiction',
      icon: AlertTriangle,
      content: (
        <div className="space-y-3">
          <p className="text-xs sm:text-sm">
            {isTa
              ? 'சேவையில் ஏதேனும் குறைபாடுகள் அல்லது முரண்பாடுகள் ஏற்பட்டால், எங்கள் வாடிக்கையாளர் ஆதரவு மையம் உங்களுக்கு உதவ தயாராக உள்ளது. இந்த விதிமுறைகள் தமிழ்நாடு மற்றும் இந்திய சட்டங்களுக்கு உட்பட்டவை.'
              : 'In the rare event of a service dispute or tariff discrepancy, Nearzy Customer Support provides rapid mediation to resolve issues amicably. These terms are governed by the laws of Tamil Nadu, India.'}
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href="tel:+918838697749"
              className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-black transition shadow-sm flex items-center gap-2"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Helpline: +91 88386 97749</span>
            </a>
            <a
              href="mailto:jothikap56@gmail.com"
              className="px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs font-bold hover:bg-red-600 transition shadow-sm flex items-center gap-2"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email: jothikap56@gmail.com</span>
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
                  <Scale className="w-4 h-4" />
                  <span>{isTa ? 'அதிகாரப்பூர்வ பயனர் ஒப்பந்தம்' : 'Official User Agreement'}</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                  {isTa ? 'விதிமுறைகள் & நிபந்தனைகள்' : 'Terms of Service'}
                </h1>
                <p className="text-xs sm:text-sm text-neutral-400 max-w-xl leading-relaxed">
                  {isTa
                    ? 'Nearzy தளத்தில் வாடிக்கையாளர்கள் மற்றும் சேவை வழங்குநர்களுக்கான நியாயமான பயன்பாட்டு விதிமுறைகள்.'
                    : 'Transparent rules and standards governing bookings, provider verification, and payments across Tamil Nadu.'}
                </p>
                <div className="pt-2 text-[11px] text-neutral-500 font-medium">
                  {isTa ? 'அமலில் உள்ள பதிப்பு: அக்டோபர் 2026' : 'Effective Version: October 2026 • Nearzy Technologies'}
                </div>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-white p-2.5 flex items-center justify-center shrink-0 shadow-lg border border-neutral-800">
                <img src="/logo.png" alt="Nearzy Logo" className="w-full h-full object-contain" />
              </div>
            </div>
          </motion.div>

          {/* Quick Jump & Terms Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar TOC */}
            <div className="lg:col-span-1 space-y-2">
              <span className="block text-xs font-black uppercase tracking-wider text-neutral-500 mb-3 px-2">
                {isTa ? 'விதிமுறை பகுதிகள்' : 'Sections'}
              </span>
              <div className="space-y-1 sticky top-24">
                {terms.map(t => {
                  const Icon = t.icon
                  const isActive = activeSection === t.id
                  return (
                    <button
                      key={t.id}
                      onClick={() => {
                        setActiveSection(t.id)
                        const el = document.getElementById(t.id)
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
                        <span className="truncate">{t.title}</span>
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 opacity-60 shrink-0" />
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Terms Content List */}
            <div className="lg:col-span-3 space-y-6">
              {terms.map((t, idx) => {
                const Icon = t.icon
                return (
                  <motion.div
                    key={t.id}
                    id={t.id}
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
                        {t.title}
                      </h2>
                    </div>

                    <div className="text-xs sm:text-sm text-neutral-700 leading-relaxed font-medium">
                      {t.content}
                    </div>
                  </motion.div>
                )
              })}

              {/* Bottom Navigation */}
              <div className="p-6 rounded-2xl bg-neutral-100 border border-neutral-200 flex flex-wrap items-center justify-between gap-4">
                <span className="text-xs text-neutral-600 font-bold">
                  {isTa ? 'பிற உதவிகளைப் பெற:' : 'Need further assistance?'}
                </span>
                <div className="flex items-center gap-4 text-xs font-black">
                  <Link to="/privacy" className="text-red-600 hover:underline">
                    {isTa ? 'தனியுரிமைக் கொள்கை' : 'Privacy Policy'}
                  </Link>
                  <span className="text-neutral-400">•</span>
                  <Link to="/support" className="text-red-600 hover:underline">
                    {isTa ? 'உதவி மையம் & தொடர்பு' : 'Help & Support Desk'}
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
