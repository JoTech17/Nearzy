import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Lock, Mail, User, Phone, ArrowRight, Loader2, Briefcase, ShieldCheck } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'

export function RegisterPage() {
  const { signUp } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()

  const [role, setRole] = useState('customer') // 'customer' | 'business_owner'
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('+91 ')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleRegister = async (e) => {
    e.preventDefault()
    if (!email || !password || !displayName) return

    setLoading(true)
    setError('')
    try {
      await signUp(email, password, displayName, role, phone)
      toast.success('Registration successful! Welcome to Nearzy.')
      if (role === 'business_owner') {
        navigate('/register-business')
      } else {
        navigate('/dashboard')
      }
    } catch (err) {
      setError(err.message || 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6">
      <div className="text-center space-y-2">
        <Link to="/" className="inline-flex items-center gap-2 mb-2">
          <img src="/logo.png" alt="Nearzy Logo" className="w-10 h-10 object-contain rounded-xl" />
          <span className="text-2xl font-black text-slate-900">
            Near<span className="text-red-600">zy</span>
          </span>
        </Link>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Create Your Nearzy Account
        </h1>
        <p className="text-xs text-slate-500">
          Unga Ooru, Unga Service! Join thousands of verified users in Tamil Nadu.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-6 sm:p-8 space-y-6">
        {/* Role Select Tabs */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
            I am joining as:
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setRole('customer')}
              className={`p-3 rounded-2xl border text-xs font-bold transition flex items-center justify-center gap-2 ${
                role === 'customer'
                  ? 'border-brand-blue bg-blue-50 text-brand-blue'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Customer</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('business_owner')}
              className={`p-3 rounded-2xl border text-xs font-bold transition flex items-center justify-center gap-2 ${
                role === 'business_owner'
                  ? 'border-brand-orange bg-orange-50 text-brand-orange'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Business Owner</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Full Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. Ramesh Kumar"
                required
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-brand-blue outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-brand-blue outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-brand-blue outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-brand-blue outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-brand-blue hover:bg-brand-electric disabled:opacity-60 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>Create {role === 'business_owner' ? 'Provider' : 'Customer'} Account</span>
          </button>
        </form>

        <div className="text-center pt-2 text-xs text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-brand-blue hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}
