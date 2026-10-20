import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  Calendar, Heart, Clock, Star, Bell, User, 
  MapPin, Phone, CheckCircle, XCircle, AlertCircle, 
  ChevronRight, ArrowRight 
} from 'lucide-react'
import { BusinessCard } from '@/components/common/BusinessCard'
import { Badge } from '@/components/common/Badge'
import { useLanguage } from '@/context/LanguageContext'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { 
  getCustomerBookings, 
  updateBookingStatus, 
  getFavoriteBusinessIds,
  searchBusinesses 
} from '@/services/businessService'

export function CustomerDashboard() {
  const { t } = useLanguage()
  const { user, updateProfile } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState('bookings') // 'bookings' | 'favorites' | 'profile'
  const [bookings, setBookings] = useState([])
  const [favoriteBusinesses, setFavoriteBusinesses] = useState([])
  const [loading, setLoading] = useState(true)

  // Profile edit state
  const [displayName, setDisplayName] = useState(user?.displayName || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [savingProfile, setSavingProfile] = useState(false)

  useEffect(() => {
    async function loadData() {
      if (!user) {
        setLoading(false)
        navigate('/login?role=customer&redirect=/dashboard')
        return
      }
      setLoading(true)
      try {
        const [bks, favIds, allBizs] = await Promise.all([
          getCustomerBookings(user.id),
          getFavoriteBusinessIds(user.id),
          searchBusinesses({ limit: 50 })
        ])
        setBookings(bks)
        const favs = allBizs.filter(b => favIds.includes(b.id))
        setFavoriteBusinesses(favs)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [user])

  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto border border-red-200 shadow-sm">
          <User className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-red-600">Customer Account</span>
          <h2 className="text-2xl sm:text-3xl font-black text-black">Sign In to View Your Dashboard</h2>
          <p className="text-sm text-neutral-600 max-w-md mx-auto">
            Please sign in to view your bookings, manage saved favorite businesses, and update your profile.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to="/login?role=customer&redirect=/dashboard"
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-red-600 hover:bg-black text-white font-extrabold text-sm transition shadow-lg shadow-red-600/20"
          >
            Sign In as Customer
          </Link>
          <Link
            to="/"
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-neutral-100 hover:bg-neutral-200 text-black font-bold text-sm transition"
          >
            Explore Services
          </Link>
        </div>
      </div>
    )
  }

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return
    await updateBookingStatus(bookingId, 'cancelled', 'Cancelled by customer')
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'cancelled' } : b))
    toast.info('Booking has been cancelled.')
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setSavingProfile(true)
    try {
      await updateProfile({ displayName, phone })
      toast.success('Profile updated successfully!')
    } catch (err) {
      toast.error('Failed to update profile.')
    } finally {
      setSavingProfile(false)
    }
  }

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'accepted':
      case 'confirmed':
        return 'success'
      case 'in_progress':
        return 'primary'
      case 'completed':
        return 'purple'
      case 'rejected':
      case 'cancelled':
        return 'danger'
      default:
        return 'warning'
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* User Header Profile Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <img
            src={user?.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
            alt={user?.displayName}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-100 shadow-sm"
          />
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              Welcome back, {user?.displayName}!
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">{user?.email}</p>
            <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase bg-blue-50 text-brand-blue border border-blue-100">
              Customer Account
            </span>
          </div>
        </div>

        {/* Quick stats */}
        <div className="flex items-center gap-4 text-center">
          <div className="px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="block text-lg font-black text-slate-800">{bookings.length}</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Bookings</span>
          </div>
          <div className="px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="block text-lg font-black text-slate-800">{favoriteBusinesses.length}</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Favorites</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('bookings')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'bookings'
              ? 'bg-brand-blue text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>My Bookings ({bookings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('favorites')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'favorites'
              ? 'bg-brand-blue text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Saved Businesses ({favoriteBusinesses.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'profile'
              ? 'bg-brand-blue text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Profile Settings</span>
        </button>
      </div>

      {/* Tab 1: Bookings Content */}
      {activeTab === 'bookings' && (
        <div className="space-y-4">
          {bookings.map((bk) => (
            <div
              key={bk.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-soft p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-400">#{bk.id}</span>
                  <Badge variant={getStatusBadgeVariant(bk.status)}>
                    {bk.status.toUpperCase()}
                  </Badge>
                </div>
                <h3 className="font-bold text-base text-slate-900">{bk.serviceName}</h3>
                <p className="text-xs text-brand-blue font-semibold">{bk.businessName}</p>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                  <span>📅 {bk.requestedDate} at {bk.requestedTime}</span>
                  <span>📍 {bk.serviceAddress || 'At shop'}</span>
                  <span className="font-bold text-slate-800">Total: ₹{bk.estimatedPrice}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {bk.status === 'pending' && (
                  <button
                    onClick={() => handleCancelBooking(bk.id)}
                    className="px-4 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition"
                  >
                    Cancel Request
                  </button>
                )}
                {bk.status === 'completed' && (
                  <Link
                    to={`/business/anna-nagar-express-plumbing`}
                    className="px-4 py-2 rounded-xl bg-blue-50 text-brand-blue hover:bg-blue-100 text-xs font-bold transition"
                  >
                    Write Review
                  </Link>
                )}
              </div>
            </div>
          ))}

          {bookings.length === 0 && (
            <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-200 p-8">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h4 className="text-sm font-bold text-slate-800">No Service Bookings Yet</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                Explore nearby verified professionals in plumbing, electrical, carpentry, salon, and AC repair.
              </p>
              <Link
                to="/search"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-blue text-white text-xs font-bold shadow-sm"
              >
                Find Local Services
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Favorites Content */}
      {activeTab === 'favorites' && (
        <div>
          {favoriteBusinesses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteBusinesses.map((b) => (
                <BusinessCard key={b.id} business={b} isFav={true} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-200 p-8">
              <Heart className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h4 className="text-sm font-bold text-slate-800">No Saved Businesses</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                Click the heart icon on any business card to quickly save your preferred local shops.
              </p>
              <Link
                to="/search"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-blue text-white text-xs font-bold"
              >
                Explore Services
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Profile Settings */}
      {activeTab === 'profile' && (
        <div className="max-w-xl bg-white rounded-3xl border border-slate-200 shadow-soft p-6 sm:p-8 space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-3">
            Customer Profile Details
          </h3>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-brand-blue outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Contact Phone
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-brand-blue outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Email (Read-only)
              </label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 text-xs outline-none"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={savingProfile}
                className="px-6 py-2.5 rounded-xl bg-brand-blue hover:bg-brand-electric text-white text-xs font-bold shadow-sm transition"
              >
                {savingProfile ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
