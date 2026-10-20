import React from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  User, Briefcase, ArrowRight, ShieldCheck, 
  MapPin, X, Sparkles, CheckCircle2 
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

export function AuthPromptModal({ isOpen, onClose }) {
  const navigate = useNavigate()
  const { switchDemoRole } = useAuth()

  if (!isOpen) return null

  const handleGoToLogin = (role = 'customer') => {
    onClose()
    navigate(`/login?role=${role}`)
  }

  const handleGoToRegister = (role = 'customer') => {
    onClose()
    navigate(`/register?role=${role}`)
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden transform transition-all p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle Background Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/5 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center transition"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-xs font-black text-red-600 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Welcome to Nearzy</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
            Please Sign In or Register
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 max-w-md mx-auto font-medium">
            Unga Ooru, Unga Service! Join thousands of verified users and local service providers across Tamil Nadu.
          </p>
        </div>

        {/* Choice Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* Option 1: Customer */}
          <div className="p-5 rounded-2xl border-2 border-neutral-200 hover:border-red-600 bg-neutral-50/50 hover:bg-red-50/20 transition group flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-md">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-black group-hover:text-red-600 transition">
                  Customer
                </h3>
                <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                  Book verified doorstep services, track bookings & write genuine reviews.
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-2">
              <button
                onClick={() => handleGoToLogin('customer')}
                className="w-full py-2.5 px-3 rounded-xl bg-red-600 hover:bg-black text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>Customer Sign In</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleGoToRegister('customer')}
                className="w-full py-2 px-3 rounded-xl border border-neutral-300 hover:border-black text-neutral-800 text-xs font-semibold hover:bg-white transition"
              >
                Create Customer Account
              </button>
            </div>
          </div>

          {/* Option 2: Service Provider / Business Owner */}
          <div className="p-5 rounded-2xl border-2 border-neutral-200 hover:border-black bg-neutral-50/50 hover:bg-neutral-100 transition group flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center shadow-md">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-black group-hover:text-red-600 transition">
                  Service Provider
                </h3>
                <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                  List your shop or freelance services, receive bookings & grow your business.
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-2">
              <button
                onClick={() => handleGoToLogin('business_owner')}
                className="w-full py-2.5 px-3 rounded-xl bg-black hover:bg-red-600 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>Provider Sign In</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleGoToRegister('business_owner')}
                className="w-full py-2 px-3 rounded-xl border border-neutral-300 hover:border-black text-neutral-800 text-xs font-semibold hover:bg-white transition"
              >
                Register Your Business
              </button>
            </div>
          </div>
        </div>

        {/* Guest Continue Footer */}
        <div className="pt-4 border-t border-neutral-200 flex items-center justify-end text-xs">
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-black font-semibold text-xs transition"
          >
            Continue as Guest →
          </button>
        </div>
      </div>
    </div>
  )
}
