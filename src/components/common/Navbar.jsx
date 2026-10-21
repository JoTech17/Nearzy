import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { 
  Menu, X, Sparkles, User, Globe, ChevronDown, 
  LogOut, PlusCircle, Shield, Briefcase, Calendar
} from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { useAuth } from '@/context/AuthContext'

export function Navbar({ onOpenAiModal, onOpenAuthModal }) {
  const { t, language, toggleLanguage } = useLanguage()
  const { user, signOut, isAdmin, isBusinessOwner } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  const handleSignOut = async () => {
    await signOut()
    setUserDropdownOpen(false)
    navigate('/')
  }

  // Get user's primary dashboard path based on their role
  const getDashboardPath = () => {
    if (isAdmin) return '/admin'
    if (isBusinessOwner) return '/owner-dashboard'
    return '/dashboard'
  }

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Tagline (Red, White & Black) */}
          <Link to="/" className="flex items-center gap-3 group">
            <img 
              src="/logo.png" 
              alt="Nearzy Logo" 
              className="w-10 h-10 object-contain rounded-xl group-hover:scale-105 transition-transform duration-200" 
            />
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight text-black flex items-center gap-0.5">
                Near<span className="text-red-600">zy</span>
              </span>
              <span className="text-[11px] font-extrabold text-red-600 tracking-wide uppercase">
                {t('tagline')}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7">
            <Link
              to="/"
              className={`text-sm font-bold transition ${
                isActive('/') ? 'text-red-600 border-b-2 border-red-600 pb-1' : 'text-neutral-800 hover:text-red-600'
              }`}
            >
              {t('navHome')}
            </Link>
            <Link
              to="/search"
              className={`text-sm font-bold transition ${
                isActive('/search') ? 'text-red-600 border-b-2 border-red-600 pb-1' : 'text-neutral-800 hover:text-red-600'
              }`}
            >
              {t('navExplore')}
            </Link>
            <Link
              to="/categories"
              className={`text-sm font-bold transition ${
                isActive('/categories') ? 'text-red-600 border-b-2 border-red-600 pb-1' : 'text-neutral-800 hover:text-red-600'
              }`}
            >
              {t('navCategories')}
            </Link>

            {user && !isBusinessOwner && !isAdmin && (
              <Link
                to="/my-bookings"
                className={`text-sm font-bold transition flex items-center gap-1.5 ${
                  isActive('/my-bookings') || isActive('/bookings') ? 'text-red-600 border-b-2 border-red-600 pb-1' : 'text-neutral-800 hover:text-red-600'
                }`}
              >
                <Calendar className="w-4 h-4 text-red-600" />
                <span>My Bookings</span>
              </Link>
            )}

            {user && isBusinessOwner && (
              <Link
                to="/owner/bookings"
                className={`text-sm font-bold transition flex items-center gap-1.5 ${
                  isActive('/owner/bookings') || isActive('/owner-bookings') ? 'text-red-600 border-b-2 border-red-600 pb-1' : 'text-neutral-800 hover:text-red-600'
                }`}
              >
                <Briefcase className="w-4 h-4 text-red-600" />
                <span>Manage Bookings</span>
              </Link>
            )}
          </nav>

          {/* Right Action Controls */}
          <div className="hidden sm:flex items-center gap-3">
            {/* AI Assistant Quick Pill */}
            <button
              onClick={onOpenAiModal}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-red-600 hover:bg-black text-white font-bold text-xs shadow-sm hover:shadow-glow transition-all"
            >
              <Sparkles className="w-4 h-4 animate-pulse text-white" />
              <span>{t('askAiPrompt')}</span>
            </button>

            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-neutral-200 text-neutral-800 hover:bg-neutral-50 font-bold text-xs transition"
              title="Switch language between English and தமிழ்"
            >
              <Globe className="w-3.5 h-3.5 text-red-600" />
              <span>{language === 'en' ? 'தமிழ்' : 'English'}</span>
            </button>

            {/* List Your Business CTA */}
            <Link
              to={user ? "/register-business" : "/login?role=business_owner&redirect=/register-business"}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border-2 border-red-600 text-red-600 hover:bg-red-50 font-extrabold text-xs transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t('navListBusiness')}</span>
            </Link>

            {/* User Profile / Auth State */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-full border border-neutral-200 hover:border-red-600 transition"
                >
                  <img
                    src={user.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                    alt={user.displayName}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="text-xs font-bold text-neutral-900 max-w-[100px] truncate">
                    {user.displayName}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-neutral-500" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-neutral-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-2 border-b border-neutral-100">
                      <p className="text-xs font-bold text-neutral-900 truncate">{user.displayName}</p>
                      <p className="text-[11px] text-neutral-500 truncate">{user.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-red-50 text-red-700 border border-red-200">
                        {user.role?.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="py-1">
                      {/* Direct Link to their respective dashboard */}
                      <Link
                        to={getDashboardPath()}
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-neutral-800 hover:bg-neutral-50 transition"
                      >
                        {isAdmin ? (
                          <>
                            <Shield className="w-4 h-4 text-red-600" />
                            <span>{t('navAdminPortal')}</span>
                          </>
                        ) : isBusinessOwner ? (
                          <>
                            <Briefcase className="w-4 h-4 text-red-600" />
                            <span>{t('navOwnerPortal')}</span>
                          </>
                        ) : (
                          <>
                            <User className="w-4 h-4 text-red-600" />
                            <span>{t('navCustomerPortal')}</span>
                          </>
                        )}
                      </Link>

                      {/* Direct link to Bookings page */}
                      {isBusinessOwner ? (
                        <Link
                          to="/owner/bookings"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-neutral-800 hover:bg-neutral-50 transition"
                        >
                          <Calendar className="w-4 h-4 text-red-600" />
                          <span>Customer Bookings</span>
                        </Link>
                      ) : !isAdmin ? (
                        <Link
                          to="/my-bookings"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-neutral-800 hover:bg-neutral-50 transition"
                        >
                          <Calendar className="w-4 h-4 text-red-600" />
                          <span>My Bookings</span>
                        </Link>
                      ) : null}
                    </div>

                    <div className="border-t border-neutral-100 pt-1">
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 transition"
                      >
                        <LogOut className="w-4 h-4 text-red-600" />
                        <span>{t('navLogout')}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-neutral-800 hover:text-red-600 transition"
                >
                  {t('navLogin')}
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl bg-black hover:bg-neutral-800 text-white font-bold text-xs shadow-sm transition"
                >
                  {t('navSignUp')}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={onOpenAiModal}
              className="p-2 rounded-xl bg-red-50 text-red-600"
              aria-label="Open AI Assistant"
            >
              <Sparkles className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-neutral-800 hover:bg-neutral-100"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-neutral-100 bg-white px-4 pt-3 pb-6 space-y-3">
          <nav className="flex flex-col gap-2">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-bold text-neutral-800 hover:bg-neutral-50"
            >
              {t('navHome')}
            </Link>
            <Link
              to="/search"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-bold text-neutral-800 hover:bg-neutral-50"
            >
              {t('navExplore')}
            </Link>
            <Link
              to="/categories"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-bold text-neutral-800 hover:bg-neutral-50"
            >
              {t('navCategories')}
            </Link>
            <Link
              to="/register-business"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-bold text-red-600 hover:bg-red-50"
            >
              {t('navListBusiness')}
            </Link>
            <Link
              to="/claim-business"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-bold text-neutral-700 hover:bg-neutral-50"
            >
              {t('claimExistingBusiness')}
            </Link>
          </nav>

          <div className="border-t border-neutral-100 pt-3 flex flex-col gap-2">
            <button
              onClick={() => { toggleLanguage(); setMobileMenuOpen(false); }}
              className="flex items-center justify-between px-3 py-2 rounded-lg bg-neutral-50 text-xs font-bold text-neutral-800"
            >
              <span className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-red-600" />
                Language
              </span>
              <span className="text-red-600 font-extrabold">{language === 'en' ? 'தமிழ்' : 'English'}</span>
            </button>

            {user ? (
              <>
                <Link
                  to={getDashboardPath()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-xs font-bold text-neutral-900 bg-neutral-100 rounded-lg flex items-center gap-2"
                >
                  <User className="w-4 h-4 text-red-600" />
                  <span>My Portal</span>
                </Link>
                <Link
                  to={isBusinessOwner ? "/owner/bookings" : "/my-bookings"}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-xs font-bold text-neutral-900 bg-neutral-100 rounded-lg flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4 text-red-600" />
                  <span>{isBusinessOwner ? "Manage Bookings" : "My Bookings"}</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="px-3 py-2 text-xs font-bold text-red-600 bg-red-50 rounded-lg text-left flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{t('navLogout')}</span>
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 rounded-xl border border-neutral-300 text-xs font-bold text-neutral-900"
                >
                  {t('navLogin')}
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold"
                >
                  {t('navSignUp')}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
