import React from 'react'
import { Link } from 'react-router-dom'
import { Phone, Mail, Shield, Sparkles } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

export function Footer() {
  const { t } = useLanguage()

  const localities = [
    'Chennai', 'Coimbatore', 'Madurai', 'Trichy', 
    'Salem', 'Tirunelveli', 'Erode', 'Vellore', 
    'Thanjavur', 'Hosur', 'Tiruppur', 'Nagercoil', 'Kanchipuram'
  ]

  const topCats = [
    { name: 'Plumbing', slug: 'plumbing' },
    { name: 'Electricians', slug: 'electricians' },
    { name: 'Appliance Repair', slug: 'appliance-repair' },
    { name: 'Beauty and Salons', slug: 'beauty-and-salons' },
    { name: 'Education & Tutors', slug: 'education-and-tutors' },
    { name: 'Cleaning Services', slug: 'cleaning-services' },
  ]

  return (
    <footer className="bg-black text-neutral-300 pt-16 pb-12 border-t border-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <img src="/logo.png" alt="Nearzy Logo" className="w-10 h-10 object-contain rounded-xl" />
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tight text-white flex items-center gap-0.5">
                  Near<span className="text-red-600">zy</span>
                </span>
                <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
                  {t('tagline')}
                </span>
              </div>
            </Link>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
              {t('footerDesc')}
            </p>
            <div className="pt-2 flex items-center gap-4 text-xs text-neutral-400">
              <div className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-red-600" />
                <span>38 Districts Coverage</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-red-600" />
                <span>Gemini AI Discovery</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-xs font-black uppercase tracking-wider mb-4 text-red-600">
              {t('quickLinks')}
            </h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <Link to="/" className="hover:text-red-500 transition">
                  {t('navHome')}
                </Link>
              </li>
              <li>
                <Link to="/search" className="hover:text-red-500 transition">
                  {t('navExplore')}
                </Link>
              </li>
              <li>
                <Link to="/categories" className="hover:text-red-500 transition">
                  {t('navCategories')}
                </Link>
              </li>
              <li>
                <Link to="/register-business" className="text-red-600 hover:underline font-bold">
                  {t('navListBusiness')}
                </Link>
              </li>
              <li>
                <Link to="/claim-business" className="hover:text-red-500 transition">
                  {t('claimExistingBusiness')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Top Categories */}
          <div>
            <h4 className="text-white text-xs font-black uppercase tracking-wider mb-4 text-red-600">
              {t('topCategories')}
            </h4>
            <ul className="space-y-2.5 text-xs font-medium">
              {topCats.map(cat => (
                <li key={cat.slug}>
                  <Link to={`/search?category=${cat.slug}`} className="hover:text-red-500 transition">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Localities & Contact */}
          <div>
            <h4 className="text-white text-xs font-black uppercase tracking-wider mb-4 text-red-600">
              {t('popularLocalities')}
            </h4>
            <div className="flex flex-wrap gap-1.5 mb-5">
              {localities.map(loc => (
                <Link
                  key={loc}
                  to={`/search?locality=${encodeURIComponent(loc)}`}
                  className="px-2 py-0.5 rounded-md bg-neutral-900 hover:bg-red-950 hover:text-red-400 text-[11px] text-neutral-300 transition border border-neutral-800"
                >
                  {loc}
                </Link>
              ))}
            </div>
            <div className="space-y-1.5 text-xs text-neutral-400 font-medium">
              <a href="mailto:jothikap56@gmail.com" className="flex items-center gap-2 hover:text-white transition">
                <Mail className="w-3.5 h-3.5 text-red-600" />
                jothikap56@gmail.com
              </a>
              <a href="tel:+918838697749" className="flex items-center gap-2 hover:text-white transition">
                <Phone className="w-3.5 h-3.5 text-red-600" />
                +91 88386 97749
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>{t('copyright')}</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-white cursor-pointer transition">{t('privacyPolicy')}</span>
            <span className="hover:text-white cursor-pointer transition">{t('termsOfService')}</span>
            <span className="hover:text-white cursor-pointer transition">{t('contactSupport')}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
