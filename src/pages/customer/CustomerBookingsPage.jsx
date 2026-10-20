import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  Calendar, Clock, MapPin, Phone, CheckCircle2, 
  XCircle, AlertCircle, ArrowRight, User, ShieldCheck, 
  Filter, Sparkles, RefreshCw, ChevronRight, Ban
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { getCustomerBookings, updateBookingStatus } from '@/services/businessService'

export function CustomerBookingsPage() {
  const { user } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()

  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all') // 'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'
  const [cancellingId, setCancellingId] = useState(null)
  const [cancelReason, setCancelReason] = useState('')
  const [showCancelModal, setShowCancelModal] = useState(false)

  const loadBookings = async () => {
    if (!user) {
      setLoading(false)
      navigate('/login?role=customer&redirect=/my-bookings')
      return
    }
    setLoading(true)
    try {
      const data = await getCustomerBookings(user.id)
      setBookings(data || [])
    } catch (err) {
      console.warn('Failed to load bookings:', err)
      toast.error('Could not load your bookings.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBookings()
  }, [user])

  const handleOpenCancelModal = (bookingId) => {
    setCancellingId(bookingId)
    setCancelReason('')
    setShowCancelModal(true)
  }

  const handleConfirmCancel = async () => {
    if (!cancellingId) return
    try {
      await updateBookingStatus(cancellingId, 'cancelled', cancelReason || 'Cancelled by customer')
      toast.success('Booking cancelled successfully.')
      setShowCancelModal(false)
      setCancellingId(null)
      loadBookings()
    } catch (err) {
      toast.error('Failed to cancel booking.')
    }
  }

  // Filter bookings
  const filteredBookings = bookings.filter(b => {
    if (statusFilter === 'all') return true
    if (statusFilter === 'confirmed') return b.status === 'confirmed' || b.status === 'accepted'
    return b.status === statusFilter
  })

  // If visitor is not logged in
  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto border border-red-200 shadow-sm">
          <Calendar className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-red-600">Customer Appointments</span>
          <h2 className="text-2xl sm:text-3xl font-black text-black">Sign In to View Your Bookings</h2>
          <p className="text-sm text-neutral-600 max-w-md mx-auto">
            Please sign in to track your service bookings, appointment dates, service provider contacts, and live progress across Tamil Nadu.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to="/login?role=customer&redirect=/my-bookings"
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-red-600 hover:bg-black text-white font-extrabold text-sm transition shadow-lg shadow-red-600/20"
          >
            Sign In as Customer
          </Link>
          <Link
            to="/search"
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-neutral-100 hover:bg-neutral-200 text-black font-bold text-sm transition"
          >
            Find Nearby Services
          </Link>
        </div>
      </div>
    )
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
      case 'accepted':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Confirmed & Scheduled
          </span>
        )
      case 'completed':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-green-50 text-green-700 border border-green-200 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Service Completed
          </span>
        )
      case 'cancelled':
      case 'rejected':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-red-50 text-red-700 border border-red-200 flex items-center gap-1.5">
            <XCircle className="w-3.5 h-3.5" />
            Cancelled
          </span>
        )
      case 'pending':
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            Pending Provider Confirmation
          </span>
        )
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-extrabold uppercase tracking-wider mb-2">
            <Calendar className="w-3.5 h-3.5" />
            <span>Customer Service Bookings</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-black">
            My Service Appointments
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Track and manage your doorstep visits and in-shop appointments across Tamil Nadu.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadBookings}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-xs font-bold text-neutral-700 flex items-center gap-2 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <Link
            to="/search"
            className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-black text-white text-xs font-extrabold flex items-center gap-2 transition shadow-sm"
          >
            <span>Book New Service</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {[
          { key: 'all', label: 'All Bookings', count: bookings.length },
          { key: 'pending', label: 'Pending', count: bookings.filter(b => b.status === 'pending').length },
          { key: 'confirmed', label: 'Confirmed', count: bookings.filter(b => b.status === 'confirmed' || b.status === 'accepted').length },
          { key: 'completed', label: 'Completed', count: bookings.filter(b => b.status === 'completed').length },
          { key: 'cancelled', label: 'Cancelled', count: bookings.filter(b => b.status === 'cancelled' || b.status === 'rejected').length },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setStatusFilter(tab.key)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 ${
              statusFilter === tab.key
                ? 'bg-black text-white shadow-sm'
                : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
              statusFilter === tab.key ? 'bg-red-600 text-white' : 'bg-neutral-100 text-neutral-600'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="bg-white rounded-3xl border border-neutral-200 p-12 text-center text-sm font-semibold text-neutral-500">
          Loading your service bookings...
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="bg-white rounded-3xl border border-neutral-200 p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto">
            <Calendar className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-black">No Bookings Found</h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              {statusFilter === 'all'
                ? "You haven't requested any service bookings yet. Discover top-rated verified professionals in your locality."
                : `You have no bookings matching the "${statusFilter}" status filter.`}
            </p>
          </div>
          <Link
            to="/search"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-red-600 hover:bg-black text-white font-bold text-xs transition shadow-sm"
          >
            <span>Browse Services in Tamil Nadu</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-5">
          {filteredBookings.map(bk => (
            <div
              key={bk.id}
              className="bg-white rounded-3xl border border-neutral-200 shadow-sm hover:shadow-md transition p-6 sm:p-7 space-y-5"
            >
              {/* Header: ID, Date & Status */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black uppercase text-neutral-400">
                    Ref #{bk.id}
                  </span>
                  <span className="text-xs text-neutral-300">•</span>
                  <span className="text-xs font-bold text-neutral-600 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-red-600" />
                    {bk.bookingDate} at {bk.bookingTime}
                  </span>
                </div>
                <div>{getStatusBadge(bk.status)}</div>
              </div>

              {/* Service & Provider Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Column 1: Business & Service */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                    Service & Provider
                  </span>
                  <h3 className="text-base font-extrabold text-black">
                    {bk.serviceName}
                  </h3>
                  <p className="text-xs font-bold text-red-600">
                    {bk.businessName}
                  </p>
                  <p className="text-xs font-black text-black">
                    Estimated Cost: ₹{bk.estimatedPrice}
                  </p>
                </div>

                {/* Column 2: Location & Mode */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                    Service Location & Mode
                  </span>
                  <p className="text-xs font-bold text-neutral-800">
                    {bk.serviceMode === 'at_doorstep' ? '🏡 Doorstep Home Visit' : '🏪 At Service Center'}
                  </p>
                  <p className="text-xs text-neutral-600 flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                    <span>{bk.address || 'Address provided at booking'}</span>
                  </p>
                  {bk.notes && (
                    <p className="text-[11px] text-neutral-500 italic bg-neutral-50 p-2 rounded-xl border border-neutral-100">
                      "{bk.notes}"
                    </p>
                  )}
                </div>

                {/* Column 3: Contact & Actions */}
                <div className="space-y-3 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                      Provider Contact
                    </span>
                    <a
                      href={`tel:${bk.businessPhone || '+918838697749'}`}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-100 hover:bg-red-50 hover:text-red-600 text-xs font-bold text-neutral-800 transition"
                    >
                      <Phone className="w-3.5 h-3.5 text-red-600" />
                      <span>{bk.businessPhone || '+91 88386 97749'}</span>
                    </a>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    {bk.status === 'pending' || bk.status === 'confirmed' || bk.status === 'accepted' ? (
                      <button
                        onClick={() => handleOpenCancelModal(bk.id)}
                        className="px-3.5 py-1.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition flex items-center gap-1.5"
                      >
                        <Ban className="w-3.5 h-3.5" />
                        <span>Cancel</span>
                      </button>
                    ) : null}

                    {bk.status === 'completed' && (
                      <Link
                        to={`/business/${bk.businessSlug || 'service'}`}
                        className="px-3.5 py-1.5 rounded-xl bg-black text-white hover:bg-neutral-800 text-xs font-bold transition flex items-center gap-1.5"
                      >
                        <span>Write Review</span>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl border border-neutral-200 max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-black text-black">Cancel Service Booking?</h3>
              <p className="text-xs text-neutral-500">
                Are you sure you want to cancel this appointment? The service provider will be notified immediately.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                Reason for cancellation (Optional)
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="e.g. Schedule changed, found alternative, issue resolved..."
                rows={3}
                className="w-full p-3 rounded-xl border border-neutral-300 text-xs outline-none focus:border-red-600"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2.5 rounded-xl border border-neutral-200 text-neutral-700 font-bold text-xs hover:bg-neutral-50 transition"
              >
                Keep Booking
              </button>
              <button
                onClick={handleConfirmCancel}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs transition shadow-sm"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
