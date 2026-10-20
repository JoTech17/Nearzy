import React, { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Lock, Mail, ArrowRight, Loader2, Sparkles, User, Briefcase, Shield, CheckCircle2 } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'

export function LoginPage() {
  const { signIn, switchDemoRole } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  // Default role from query param or customer
  const initialRole = searchParams.get('role') || 'customer'
  const [activeRole, setActiveRole] = useState(initialRole) // 'customer' | 'business_owner' | 'admin'

  const roleConfigs = {
    customer: {
      key: 'customer',
      title: 'Customer Portal',
      titleTa: 'வாடிக்கையாளர் உள்நுழைவு',
      subtitle: 'Book local doorstep services, track appointments & write reviews across Tamil Nadu',
      icon: User,
      defaultEmail: 'customer@nearzy.in',
      targetPath: '/dashboard',
      badge: 'Resident / Customer',
      accentColor: 'text-red-600',
      activeBorder: 'border-red-600 bg-red-50/50',
    },
    business_owner: {
      key: 'business_owner',
      title: 'Service Partner Portal',
      titleTa: 'வணிக உரிமையாளர் உள்நுழைவு',
      subtitle: 'Manage bookings, list services, respond to customers & monitor growth',
      icon: Briefcase,
      defaultEmail: 'partner@nearzy.in',
      targetPath: '/owner-dashboard',
      badge: 'Service Provider / Shop Owner',
      accentColor: 'text-neutral-900',
      activeBorder: 'border-black bg-neutral-100',
    },
    admin: {
      key: 'admin',
      title: 'Admin Console',
      titleTa: 'நிர்வாக கன்சோல்',
      subtitle: 'Platform verification, category management, security & complaints review',
      icon: Shield,
      defaultEmail: 'admin@nearzy.in',
      targetPath: '/admin',
      badge: 'Platform Administrator',
      accentColor: 'text-red-700',
      activeBorder: 'border-red-700 bg-red-50',
    }
  }

  const currentConfig = roleConfigs[activeRole] || roleConfigs.customer
  const redirectUrl = searchParams.get('redirect')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Handle switching role tabs
  const handleRoleTabChange = (roleKey) => {
    setActiveRole(roleKey)
    setError('')
  }

  const handleFillDemoCreds = () => {
    setEmail(currentConfig.defaultEmail)
    setPassword('password123')
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Please enter your email and password.')
      return
    }

    setLoading(true)
    setError('')
    try {
      // Sign in user with selected role
      await signIn(email, password, activeRole)
      toast.success(`Welcome to Nearzy ${currentConfig.title}!`)
      navigate(redirectUrl || currentConfig.targetPath)
    } catch (err) {
      setError(err.message || 'Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  const handleInstantDemoLogin = () => {
    switchDemoRole(activeRole)
    toast.success(`Logged in to ${currentConfig.title}!`)
    navigate(redirectUrl || currentConfig.targetPath)
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-12 space-y-8">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <Link to="/" className="inline-flex items-center gap-2 mb-2 group">
          <img src="/logo.svg" alt="Nearzy Logo" className="w-12 h-12 rounded-xl group-hover:scale-105 transition" />
          <span className="text-3xl font-black text-black">
            Near<span className="text-red-600">zy</span>
          </span>
        </Link>
        <h1 className="text-3xl font-black text-black tracking-tight">
          Select Your Portal to Sign In
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 max-w-md mx-auto">
          "Unga Ooru, Unga Service!" — Split access for Customers, Service Providers, and Administrators.
        </p>
      </div>

      {/* Role Split Selector Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {Object.values(roleConfigs).map((cfg) => {
          const Icon = cfg.icon
          const isSelected = activeRole === cfg.key
          return (
            <button
              key={cfg.key}
              type="button"
              onClick={() => handleRoleTabChange(cfg.key)}
              className={`p-4 rounded-2xl border-2 text-left transition-all relative flex flex-col justify-between ${
                isSelected 
                  ? 'border-red-600 bg-white shadow-md ring-2 ring-red-100' 
                  : 'border-neutral-200 bg-white hover:border-neutral-400 opacity-80 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                  isSelected ? 'bg-red-600 text-white' : 'bg-neutral-100 text-neutral-700'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                {isSelected && (
                  <CheckCircle2 className="w-5 h-5 text-red-600" />
                )}
              </div>
              <div>
                <h3 className="text-xs font-black text-black uppercase tracking-wider">
                  {cfg.title}
                </h3>
                <p className="text-[11px] text-neutral-500 mt-1 line-clamp-2">
                  {cfg.badge}
                </p>
              </div>
            </button>
          )
        })}
      </div>

      {/* Main Login Form Card */}
      <div className="bg-white rounded-3xl border border-neutral-200 shadow-soft p-6 sm:p-8 space-y-6">
        <div className="border-b border-neutral-100 pb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold uppercase mb-2 border border-red-200">
            {currentConfig.badge}
          </div>
          <h2 className="text-xl font-black text-black">
            Sign In to {currentConfig.title}
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            {currentConfig.subtitle}
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-neutral-800 uppercase mb-1">
              {activeRole === 'customer' ? 'Customer Email' : activeRole === 'business_owner' ? 'Business Partner Email' : 'Administrator Email'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs font-medium focus:border-red-600 focus:ring-2 focus:ring-red-100 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-800 uppercase mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs font-medium focus:border-red-600 focus:ring-2 focus:ring-red-100 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-black disabled:opacity-60 text-white font-extrabold text-xs shadow-md transition flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>Sign In to {currentConfig.title}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* 1-Click Instant Role Login */}
        <div className="pt-4 border-t border-neutral-100 space-y-3">
          <div className="text-center">
            <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block mb-2">
              Instant One-Click Login
            </span>
            <button
              type="button"
              onClick={handleInstantDemoLogin}
              className="w-full py-2.5 px-4 rounded-xl border-2 border-black bg-black hover:bg-neutral-800 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Instant 1-Click Access as {currentConfig.title}</span>
            </button>
          </div>
        </div>

        {/* Footer links */}
        <div className="text-center pt-2 text-xs text-neutral-600 flex items-center justify-center gap-2">
          <span>Need a new account?</span>
          {activeRole === 'business_owner' ? (
            <Link to="/register-business" className="font-bold text-red-600 hover:underline">
              Register Your Business
            </Link>
          ) : (
            <Link to="/register" className="font-bold text-red-600 hover:underline">
              Sign Up as Customer
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
