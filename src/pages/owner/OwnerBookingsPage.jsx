import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Briefcase, Calendar, Clock, MapPin, Phone, Mail, 
  CheckCircle2, XCircle, AlertCircle, RefreshCw, Filter, 
  ArrowRight, Users, DollarSign, ShieldCheck
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { getOwnerBusiness, getOwnerBookings, updateBookingStatus } from '@/services/businessService'

export function OwnerBookingsPage() {
  const { user } = useAuth()
  const toast = useToast()

  const [business, setBusiness] = useState(null)
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all') // 'all' | 'pending' | 'accepted' | 'completed' | 'cancelled'
  const [updatingId, setUpdatingId] = useState(null)

  const loadData = async () => {
    if (!user) {
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const myBiz = await getOwnerBusiness(user.id, user.businessId)
      setBusiness(myBiz)
      if (myBiz) {
        const bks = await getOwnerBookings(myBiz.id)
        setBookings(bks || [])
      }
    } catch (err) {
      console.warn('Failed to load owner bookings:', err)
      toast.error('Could not load bookings.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [user])

  const handleUpdateStatus = async (bookingId, newStatus) => {
    setUpdatingId(bookingId)
    try {
      await updateBookingStatus(bookingId, newStatus)
      toast.success(`Booking status updated to ${newStatus}!`)
      loadData()
    } catch (err) {
      toast.error('Failed to update booking status.')
    } finally {
      setUpdatingId(null)
    }
  }

  // Filter bookings
  const filteredBookings = bookings.filter(b => {
    if (statusFilter === 'all') return true
    if (statusFilter === 'accepted') return b.status === 'accepted' || b.status === 'confirmed'
    return b.status === statusFilter
  })

  // KPI Calculations
  const pendingCount = bookings.filter(b => b.status === 'pending').length
  const acceptedCount = bookings.filter(b => b.status === 'accepted' || b.status === 'confirmed').length
  const completedCount = bookings.filter(b => b.status === 'completed').length
  const totalRevenue = bookings
    .filter(b => b.status === 'completed' || b.status === 'accepted' || b.status === 'confirmed')
    .reduce((sum, b) => sum + (b.estimatedPrice || 0), 0)

  // If visitor is not logged in
  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto border border-red-200 shadow-sm">
          <Briefcase className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-red-600">Partner Portal</span>
          <h2 className="text-2xl sm:text-3xl font-black text-black">Sign In to Manage Bookings</h2>
          <p className="text-sm text-neutral-600 max-w-md mx-auto">
            Please sign in to your Nearzy Service Partner account to accept or reject customer bookings, view doorstep addresses, and track revenue.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to="/login?role=business_owner&redirect=/owner/bookings"
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-red-600 hover:bg-black text-white font-extrabold text-sm transition shadow-lg shadow-red-600/20"
          >
            Sign In as Service Partner
          </Link>
          <Link
            to="/login?role=customer"
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-neutral-100 hover:bg-neutral-200 text-black font-bold text-sm transition"
          >
            Customer Login
          </Link>
        </div>
      </div>
    )
  }

  // If partner does not have a registered business
  if (!business && !loading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200 shadow-sm">
          <AlertCircle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700">No Business Registered</span>
          <h2 className="text-2xl sm:text-3xl font-black text-black">Register Your Business First</h2>
          <p className="text-sm text-neutral-600 max-w-md mx-auto">
            You are logged in as a partner, but your account is not yet linked to an active business listing.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to="/register-business"
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-red-600 hover:bg-black text-white font-extrabold text-sm transition shadow-lg shadow-red-600/20"
          >
            Register Your Business Listing
          </Link>
          <Link
            to="/"
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-neutral-100 hover:bg-neutral-200 text-black font-bold text-sm transition"
          >
            Back to Marketplace
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-extrabold uppercase tracking-wider mb-2">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Service Provider Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-black">
            Customer Booking Requests
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Manage incoming appointment requests for <strong>{business?.name}</strong> ({business?.locality}, {business?.city}).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-xs font-bold text-neutral-700 flex items-center gap-2 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <Link
            to="/owner-dashboard"
            className="px-5 py-2.5 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-extrabold flex items-center gap-2 transition shadow-sm"
          >
            <span>Full Owner Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">New Requests</span>
          <div className="text-2xl font-black text-amber-600">{pendingCount}</div>
          <p className="text-[11px] text-neutral-500">Awaiting your approval</p>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Accepted / Active</span>
          <div className="text-2xl font-black text-blue-600">{acceptedCount}</div>
          <p className="text-[11px] text-neutral-500">Upcoming appointments</p>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Completed Jobs</span>
          <div className="text-2xl font-black text-green-600">{completedCount}</div>
          <p className="text-[11px] text-neutral-500">Fulfilled orders</p>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Total Value</span>
          <div className="text-2xl font-black text-black">₹{totalRevenue}</div>
          <p className="text-[11px] text-neutral-500">Calculated service fees</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {[
          { key: 'all', label: 'All Requests', count: bookings.length },
          { key: 'pending', label: 'Pending Approval', count: pendingCount },
          { key: 'accepted', label: 'Accepted / Upcoming', count: acceptedCount },
          { key: 'completed', label: 'Completed', count: completedCount },
          { key: 'cancelled', label: 'Declined / Cancelled', count: bookings.filter(b => b.status === 'cancelled' || b.status === 'rejected').length },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setStatusFilter(tab.key)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 ${
              statusFilter === tab.key
                ? 'bg-red-600 text-white shadow-sm'
                : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
              statusFilter === tab.key ? 'bg-black text-white' : 'bg-neutral-100 text-neutral-600'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="bg-white rounded-3xl border border-neutral-200 p-12 text-center text-sm font-semibold text-neutral-500">
          Loading customer booking requests...
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="bg-white rounded-3xl border border-neutral-200 p-12 text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto">
            <Calendar className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-black">No Booking Requests</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            {statusFilter === 'all'
              ? 'No customers have submitted bookings for your services yet. Ensure your business details and pricing are complete.'
              : `No bookings found under "${statusFilter}".`}
          </p>
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
                  <span className="text-xs font-bold text-neutral-700 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-red-600" />
                    Requested for: <strong>{bk.bookingDate} at {bk.bookingTime}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {bk.status === 'pending' && (
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      Requires Confirmation
                    </span>
                  )}
                  {(bk.status === 'accepted' || bk.status === 'confirmed') && (
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Accepted & Scheduled
                    </span>
                  )}
                  {bk.status === 'completed' && (
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-green-50 text-green-700 border border-green-200 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Job Completed
                    </span>
                  )}
                  {(bk.status === 'cancelled' || bk.status === 'rejected') && (
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-red-50 text-red-700 border border-red-200 flex items-center gap-1.5">
                      <XCircle className="w-3.5 h-3.5" />
                      Cancelled / Declined
                    </span>
                  )}
                </div>
              </div>

              {/* Booking Body */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Column 1: Customer Contact */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                    Customer Information
                  </span>
                  <p className="text-base font-extrabold text-black">
                    {bk.customerName || 'Customer'}
                  </p>
                  <a
                    href={`tel:${bk.customerPhone}`}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-100 hover:bg-green-50 hover:text-green-700 text-xs font-bold text-neutral-800 transition"
                  >
                    <Phone className="w-3.5 h-3.5 text-green-600" />
                    <span>{bk.customerPhone || 'Phone unavailable'}</span>
                  </a>
                  {bk.customerEmail && (
                    <p className="text-xs text-neutral-500 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-neutral-400" />
                      <span>{bk.customerEmail}</span>
                    </p>
                  )}
                </div>

                {/* Column 2: Service & Address */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                    Requested Service & Location
                  </span>
                  <p className="text-xs font-extrabold text-black">
                    {bk.serviceName}
                  </p>
                  <p className="text-xs font-black text-red-600">
                    Agreed Fee: ₹{bk.estimatedPrice}
                  </p>
                  <p className="text-xs text-neutral-600 flex items-start gap-1.5 pt-1">
                    <MapPin className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                    <span>{bk.address || 'Address provided by customer'}</span>
                  </p>
                  {bk.notes && (
                    <p className="text-[11px] text-neutral-500 italic bg-neutral-50 p-2 rounded-xl border border-neutral-100">
                      Problem notes: "{bk.notes}"
                    </p>
                  )}
                </div>

                {/* Column 3: Partner Action Controls */}
                <div className="space-y-2.5 flex flex-col justify-end">
                  {bk.status === 'pending' && (
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleUpdateStatus(bk.id, 'accepted')}
                        disabled={updatingId === bk.id}
                        className="w-full py-2.5 px-4 rounded-xl bg-red-600 hover:bg-black text-white text-xs font-extrabold transition shadow-sm flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Accept Request</span>
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(bk.id, 'rejected')}
                        disabled={updatingId === bk.id}
                        className="w-full py-2 px-4 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition flex items-center justify-center gap-2"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Decline Request</span>
                      </button>
                    </div>
                  )}

                  {(bk.status === 'accepted' || bk.status === 'confirmed') && (
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleUpdateStatus(bk.id, 'completed')}
                        disabled={updatingId === bk.id}
                        className="w-full py-2.5 px-4 rounded-xl bg-green-600 hover:bg-green-700 text-white text-xs font-extrabold transition shadow-sm flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Mark Service as Completed</span>
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(bk.id, 'cancelled')}
                        disabled={updatingId === bk.id}
                        className="w-full py-2 px-4 rounded-xl border border-neutral-200 text-neutral-600 hover:bg-neutral-50 text-xs font-bold transition flex items-center justify-center gap-2"
                      >
                        <span>Cancel Appointment</span>
                      </button>
                    </div>
                  )}

                  {bk.status === 'completed' && (
                    <div className="p-3 bg-green-50 rounded-xl border border-green-200 text-green-800 text-xs font-bold text-center">
                      Job Completed & Settled
                    </div>
                  )}

                  {(bk.status === 'cancelled' || bk.status === 'rejected') && (
                    <div className="p-3 bg-red-50 rounded-xl border border-red-200 text-red-700 text-xs font-bold text-center">
                      Booking Cancelled
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
