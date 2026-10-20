import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Briefcase, Calendar, Star, DollarSign, Clock, 
  CheckCircle2, XCircle, Plus, Edit2, Trash2, MessageSquare, 
  TrendingUp, Users, ShieldCheck, AlertCircle, MapPin, X, Save
} from 'lucide-react'
import { Badge } from '@/components/common/Badge'
import { RatingStars } from '@/components/common/RatingStars'
import { LocationAutocomplete } from '@/components/common/LocationAutocomplete'
import { LocationPickerMap } from '@/components/common/LocationPickerMap'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { 
  getOwnerBusiness, 
  updateBusiness,
  getOwnerBookings, 
  updateBookingStatus, 
  getBusinessReviews, 
  respondToReview 
} from '@/services/businessService'

export function OwnerDashboard() {
  const { user } = useAuth()
  const toast = useToast()

  const [activeTab, setActiveTab] = useState('bookings') // 'bookings' | 'services' | 'reviews'
  const [business, setBusiness] = useState(null)
  const [bookings, setBookings] = useState([])
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  // Reply to review state
  const [replyingReviewId, setReplyingReviewId] = useState(null)
  const [replyText, setReplyText] = useState('')

  // New service modal state
  const [showAddService, setShowAddService] = useState(false)
  const [newServiceName, setNewServiceName] = useState('')
  const [newServicePrice, setNewServicePrice] = useState('')
  const [newServiceDuration, setNewServiceDuration] = useState('60')

  // Edit Business Details Modal State
  const [showEditModal, setShowEditModal] = useState(false)
  const [editForm, setEditForm] = useState({
    name: '',
    phone: '',
    email: '',
    website: '',
    address: '',
    locality: '',
    city: '',
    district: '',
    postalCode: '',
    latitude: '',
    longitude: '',
    locationDisplay: '',
    minPrice: '',
    description: '',
  })
  const [savingEdit, setSavingEdit] = useState(false)

  useEffect(() => {
    async function loadOwnerData() {
      setLoading(true)
      try {
        // Query business strictly belonging to this logged in partner
        const myBiz = await getOwnerBusiness(user?.id, user?.businessId)
        setBusiness(myBiz)

        if (myBiz) {
          const [bks, revs] = await Promise.all([
            getOwnerBookings(myBiz.id),
            getBusinessReviews(myBiz.id)
          ])
          setBookings(bks)
          setReviews(revs)
        } else {
          setBookings([])
          setReviews([])
        }
      } finally {
        setLoading(false)
      }
    }
    loadOwnerData()
  }, [user])

  const handleOpenEditModal = () => {
    if (!business) return
    setEditForm({
      name: business.name || '',
      phone: business.phone || '',
      email: business.email || '',
      website: business.website || '',
      address: business.address || '',
      locality: business.locality || '',
      city: business.city || '',
      district: business.district || business.city || '',
      postalCode: business.postalCode || '',
      latitude: business.latitude || '',
      longitude: business.longitude || '',
      locationDisplay: `${business.locality || ''}, ${business.city || ''}`.replace(/^,\s*|,\s*$/g, ''),
      minPrice: business.minPrice || '',
      description: business.description || '',
    })
    setShowEditModal(true)
  }

  const handleSaveBusinessDetails = async (e) => {
    e.preventDefault()
    if (!business) return
    setSavingEdit(true)
    try {
      const updated = await updateBusiness(business.id, {
        name: editForm.name,
        phone: editForm.phone,
        email: editForm.email,
        website: editForm.website,
        address: editForm.address,
        locality: editForm.locality,
        city: editForm.city,
        district: editForm.district,
        postalCode: editForm.postalCode,
        latitude: editForm.latitude ? Number(editForm.latitude) : business.latitude,
        longitude: editForm.longitude ? Number(editForm.longitude) : business.longitude,
        minPrice: Number(editForm.minPrice) || business.minPrice,
        description: editForm.description,
      })

      if (updated) {
        setBusiness(updated)
        toast.success('Business details updated successfully!')
        setShowEditModal(false)
      }
    } catch (err) {
      toast.error('Failed to update business details.')
    } finally {
      setSavingEdit(false)
    }
  }

  const handleUpdateStatus = async (bookingId, newStatus) => {
    await updateBookingStatus(bookingId, newStatus)
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b))
    toast.success(`Booking status changed to ${newStatus}`)
  }

  const handleSendReply = async (reviewId) => {
    if (!replyText.trim()) return
    await respondToReview(reviewId, replyText.trim())
    setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, ownerResponse: replyText.trim() } : r))
    setReplyingReviewId(null)
    setReplyText('')
    toast.success('Your response has been published to customers.')
  }

  const handleAddService = async (e) => {
    e.preventDefault()
    if (!newServiceName.trim() || !newServicePrice) return

    const newSvc = {
      id: 's_' + Date.now(),
      name: newServiceName.trim(),
      price: Number(newServicePrice),
      pricingType: 'fixed',
      durationMinutes: Number(newServiceDuration),
      bookingEnabled: true,
    }

    const updatedServices = [...(business?.services || []), newSvc]
    const updated = await updateBusiness(business.id, { services: updatedServices })
    setBusiness(prev => ({
      ...prev,
      services: updatedServices
    }))

    setShowAddService(false)
    setNewServiceName('')
    setNewServicePrice('')
    toast.success('Service added successfully!')
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-sm font-semibold text-neutral-500">
        Loading partner dashboard...
      </div>
    )
  }

  // If visitor is not signed in, prompt to sign in (do not enter directly as service provider)
  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto border border-red-200 shadow-sm">
          <Briefcase className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-red-600">Partner Authentication</span>
          <h2 className="text-2xl sm:text-3xl font-black text-black">Sign In to Partner Portal</h2>
          <p className="text-sm text-neutral-600 max-w-md mx-auto">
            Please sign in to your Nearzy Service Partner account to manage your business, view incoming customer bookings, and edit service details.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to="/login?role=business_owner&redirect=/owner-dashboard"
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

  // If user has not registered or linked a business yet
  if (!business) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
        <div className="bg-white rounded-3xl border border-neutral-200 shadow-xl p-8 sm:p-12 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto shadow-sm">
            <Briefcase className="w-8 h-8" />
          </div>
          <div className="max-w-lg mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-red-600">
              Partner Portal • New Service Account
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-black">
              Welcome, {user?.displayName || 'Partner'}!
            </h1>
            <p className="text-sm text-neutral-600">
              You are currently logged in as a Service Partner, but do not have an active business listing linked to your account yet.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/register-business"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-red-600 hover:bg-black text-white font-extrabold text-sm transition shadow-lg shadow-red-600/25 flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Register Your Shop / Service</span>
            </Link>
            <Link
              to="/explore"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-neutral-100 hover:bg-neutral-200 text-black font-bold text-sm transition flex items-center justify-center gap-2"
            >
              <span>Claim an Existing Business</span>
            </Link>
          </div>

          <div className="pt-6 border-t border-neutral-100 text-xs text-neutral-400">
            Registered businesses appear on the live interactive Tamil Nadu map with 30 km radius search.
          </div>
        </div>
      </div>
    )
  }

  // Calculate metrics
  const pendingCount = bookings.filter(b => b.status === 'pending').length
  const completedCount = bookings.filter(b => b.status === 'completed').length
  const estimatedRevenue = bookings
    .filter(b => b.status === 'completed' || b.status === 'accepted')
    .reduce((acc, curr) => acc + (curr.estimatedPrice || 0), 0)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner & KPI Cards */}
      <div className="bg-white rounded-3xl border border-neutral-200 shadow-card p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-bold text-xl shrink-0">
              <Briefcase className="w-7 h-7" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-black">
                  {business.name}
                </h1>
                {business.isVerified ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-neutral-100 text-black border border-neutral-300 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-red-600" />
                    Verified Provider
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-neutral-100 text-neutral-600 border border-neutral-200">
                    Active Listing
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-500 mt-0.5 flex items-center gap-1.5 flex-wrap">
                <span>{business.categoryName}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-red-600" />
                  {business.locality}, {business.city}
                </span>
                {business.latitude && business.longitude && (
                  <span className="text-[10px] text-neutral-400">
                    (Pinned at {business.latitude}, {business.longitude})
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={handleOpenEditModal}
              className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-black text-white font-bold text-xs transition flex items-center gap-1.5 shadow-sm"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit Business Details</span>
            </button>

            <Link
              to={`/business/${business.slug}`}
              className="px-4 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold text-xs transition flex items-center gap-1"
            >
              <span>View Public Page</span>
              <span>↗</span>
            </Link>
          </div>
        </div>

        {/* 4 KPI Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
            <span className="text-xs font-bold text-neutral-600 uppercase">Total Bookings</span>
            <span className="block text-2xl font-black text-black mt-1">{bookings.length}</span>
            <span className="text-[11px] text-neutral-500">{completedCount} completed</span>
          </div>

          <div className="p-4 rounded-2xl bg-red-50/50 border border-red-200">
            <span className="text-xs font-bold text-red-600 uppercase">Pending Requests</span>
            <span className="block text-2xl font-black text-red-600 mt-1">{pendingCount}</span>
            <span className="text-[11px] text-neutral-500">Requires confirmation</span>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
            <span className="text-xs font-bold text-neutral-600 uppercase">Average Rating</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-2xl font-black text-black">
                {business.rating !== null && business.rating !== undefined ? business.rating : 'New'}
              </span>
              {business.rating ? (
                <RatingStars rating={business.rating} size="sm" />
              ) : (
                <span className="text-[11px] text-neutral-400">No ratings yet</span>
              )}
            </div>
            <span className="text-[11px] text-neutral-500">{reviews.length} authentic reviews</span>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
            <span className="text-xs font-bold text-neutral-600 uppercase">Est. Revenue</span>
            <span className="block text-2xl font-black text-black mt-1">₹{estimatedRevenue}</span>
            <span className="text-[11px] text-neutral-500">Accepted & fulfilled</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-200 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('bookings')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'bookings'
              ? 'bg-red-600 text-white shadow-sm'
              : 'text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Booking Requests ({bookings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('services')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'services'
              ? 'bg-red-600 text-white shadow-sm'
              : 'text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Manage Services ({business?.services?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('reviews')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'reviews'
              ? 'bg-red-600 text-white shadow-sm'
              : 'text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Customer Reviews ({reviews.length})</span>
        </button>
      </div>

      {/* Tab 1: Bookings Management */}
      {activeTab === 'bookings' && (
        <div className="space-y-4">
          <div className="divide-y divide-neutral-100 bg-white rounded-3xl border border-neutral-200 shadow-card overflow-hidden">
            {bookings.map((bk) => (
              <div key={bk.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-neutral-50/50 transition">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-neutral-400">#{bk.id}</span>
                    <Badge variant={bk.status === 'accepted' ? 'success' : bk.status === 'pending' ? 'warning' : 'default'}>
                      {bk.status.toUpperCase()}
                    </Badge>
                  </div>
                  <h3 className="font-bold text-sm text-black">{bk.serviceName}</h3>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-600">
                    <span>Customer: <strong>{bk.customerName}</strong> ({bk.customerPhone})</span>
                    <span>Date: <strong>{bk.requestedDate}</strong> at {bk.requestedTime}</span>
                    <span>Fee: <strong className="text-black">₹{bk.estimatedPrice}</strong></span>
                  </div>
                  {bk.serviceAddress && (
                    <p className="text-xs text-neutral-500">📍 {bk.serviceAddress}</p>
                  )}
                  {bk.notes && (
                    <p className="text-xs text-neutral-500 italic">"{bk.notes}"</p>
                  )}
                </div>

                {/* Status action buttons */}
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  {bk.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleUpdateStatus(bk.id, 'accepted')}
                        className="px-3.5 py-1.5 rounded-xl bg-black text-white hover:bg-neutral-800 text-xs font-bold transition"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(bk.id, 'rejected')}
                        className="px-3.5 py-1.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition"
                      >
                        Decline
                      </button>
                    </>
                  )}

                  {bk.status === 'accepted' && (
                    <button
                      onClick={() => handleUpdateStatus(bk.id, 'completed')}
                      className="px-4 py-1.5 rounded-xl bg-red-600 text-white hover:bg-black text-xs font-bold transition"
                    >
                      Mark Completed
                    </button>
                  )}

                  {bk.status === 'completed' && (
                    <span className="text-xs font-bold text-neutral-700 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-red-600" /> Fulfilled
                    </span>
                  )}
                </div>
              </div>
            ))}

            {bookings.length === 0 && (
              <div className="p-12 text-center text-xs text-neutral-500 space-y-2">
                <Calendar className="w-8 h-8 text-neutral-300 mx-auto" />
                <p className="font-semibold text-neutral-700">No booking requests received yet.</p>
                <p>New service requests from customers in your area will appear here in real time.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Manage Services */}
      {activeTab === 'services' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-black">Offered Services & Pricing</h3>
            <button
              onClick={() => setShowAddService(true)}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-black text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
            >
              <Plus className="w-4 h-4" />
              Add Service
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {business?.services?.map((svc) => (
              <div key={svc.id} className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-card flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-sm text-black">{svc.name}</h4>
                  <p className="text-xs text-neutral-500 mt-1">{svc.description || 'Standard service offering.'}</p>
                  <span className="inline-block mt-3 font-extrabold text-base text-black">
                    ₹{svc.price} <span className="text-xs font-normal text-neutral-400">/ {svc.durationMinutes} mins</span>
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Add Service Modal */}
          {showAddService && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <form onSubmit={handleAddService} className="w-full max-w-md bg-white rounded-3xl p-6 space-y-4 shadow-2xl border border-neutral-100">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-extrabold text-black">Add New Service</h4>
                  <button type="button" onClick={() => setShowAddService(false)} className="p-1 text-neutral-400 hover:text-black">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Service Name *</label>
                  <input
                    type="text"
                    value={newServiceName}
                    onChange={(e) => setNewServiceName(e.target.value)}
                    required
                    placeholder="e.g. Inverter Wiring, Tap Replacement"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:ring-2 focus:ring-red-600 outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">Price (₹) *</label>
                    <input
                      type="number"
                      value={newServicePrice}
                      onChange={(e) => setNewServicePrice(e.target.value)}
                      required
                      min="0"
                      placeholder="299"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:ring-2 focus:ring-red-600 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">Est. Duration (Mins)</label>
                    <select
                      value={newServiceDuration}
                      onChange={(e) => setNewServiceDuration(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:ring-2 focus:ring-red-600 outline-none"
                    >
                      <option value="30">30 mins</option>
                      <option value="45">45 mins</option>
                      <option value="60">1 hour</option>
                      <option value="90">1.5 hours</option>
                      <option value="120">2 hours</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddService(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-neutral-600 hover:bg-neutral-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-red-600 hover:bg-black text-white text-xs font-bold transition shadow-sm"
                  >
                    Save Service
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Reviews */}
      {activeTab === 'reviews' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-black">Customer Feedback & Reviews</h3>
          </div>

          <div className="divide-y divide-neutral-100 bg-white rounded-3xl border border-neutral-200 shadow-card overflow-hidden">
            {reviews.map((rev) => (
              <div key={rev.id} className="p-5 space-y-2 hover:bg-neutral-50/50 transition">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-black">{rev.customerName}</span>
                    <RatingStars rating={rev.rating} size="xs" />
                  </div>
                  <span className="text-[11px] text-neutral-400">
                    {new Date(rev.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-neutral-600">{rev.comment}</p>

                {rev.ownerResponse ? (
                  <div className="mt-2 pl-3 border-l-2 border-red-600 bg-red-50/50 p-2.5 rounded-r-xl">
                    <span className="text-[10px] font-bold text-red-600 uppercase block">
                      Your Response
                    </span>
                    <p className="text-xs text-neutral-700 italic">"{rev.ownerResponse}"</p>
                  </div>
                ) : (
                  <div>
                    {replyingReviewId === rev.id ? (
                      <div className="mt-2 space-y-2">
                        <textarea
                          rows={2}
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Write a courteous public reply..."
                          className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs focus:ring-2 focus:ring-red-600 outline-none resize-none"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setReplyingReviewId(null)}
                            className="px-3 py-1 text-xs text-neutral-500 font-bold"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSendReply(rev.id)}
                            className="px-4 py-1.5 rounded-xl bg-red-600 text-white text-xs font-bold"
                          >
                            Post Reply
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => { setReplyingReviewId(rev.id); setReplyText(''); }}
                        className="text-xs font-bold text-red-600 hover:underline mt-1"
                      >
                        Reply to Review
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}

            {reviews.length === 0 && (
              <div className="p-12 text-center text-xs text-neutral-500 space-y-2">
                <Star className="w-8 h-8 text-neutral-300 mx-auto" />
                <p className="font-semibold text-neutral-700">No customer reviews yet.</p>
                <p>Authentic reviews from fulfilled customer bookings will appear here.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Edit Business Details Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <form 
            onSubmit={handleSaveBusinessDetails} 
            className="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl border border-neutral-200 my-8 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-red-600">
                  Business Configuration
                </span>
                <h3 className="text-lg font-black text-black">
                  Edit Business Details
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="p-1.5 rounded-xl text-neutral-400 hover:text-black hover:bg-neutral-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Business Name */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                  Business Name *
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:ring-2 focus:ring-red-600 outline-none"
                />
              </div>

              {/* Interactive Map Location Picker */}
              <div className="space-y-2">
                <LocationPickerMap
                  initialLat={Number(editForm.latitude) || 10.0718}
                  initialLng={Number(editForm.longitude) || 78.7844}
                  height="300px"
                  label="Shop Location & Pin on Tamil Nadu Map *"
                  onLocationChange={(locData) => {
                    setEditForm(prev => ({
                      ...prev,
                      latitude: locData.latitude,
                      longitude: locData.longitude,
                      locality: locData.locality,
                      city: locData.city,
                      district: locData.district,
                      postalCode: locData.postalCode,
                      address: locData.address,
                      locationDisplay: locData.displayLocation,
                    }))
                  }}
                />
              </div>

              {/* Shop Address / Landmark */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                  Shop Address / Landmark
                </label>
                <input
                  type="text"
                  value={editForm.address}
                  onChange={(e) => setEditForm(prev => ({ ...prev, address: e.target.value }))}
                  required
                  placeholder="e.g. Shop #12, Main Road, Near Bus Stand"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:ring-2 focus:ring-red-600 outline-none"
                />
              </div>

              {/* Phone, Email, Starting Price */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:ring-2 focus:ring-red-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:ring-2 focus:ring-red-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                    Starts At (₹)
                  </label>
                  <input
                    type="number"
                    value={editForm.minPrice}
                    onChange={(e) => setEditForm(prev => ({ ...prev, minPrice: e.target.value }))}
                    min="0"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:ring-2 focus:ring-red-600 outline-none"
                  />
                </div>
              </div>

              {/* Website */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                  Website / Social Link
                </label>
                <input
                  type="url"
                  value={editForm.website}
                  onChange={(e) => setEditForm(prev => ({ ...prev, website: e.target.value }))}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:ring-2 focus:ring-red-600 outline-none"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                  Business Description
                </label>
                <textarea
                  rows={3}
                  value={editForm.description}
                  onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:ring-2 focus:ring-red-600 outline-none resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100">
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="px-5 py-2.5 rounded-xl text-sm font-bold text-neutral-600 hover:bg-neutral-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={savingEdit}
                className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-black text-white font-extrabold text-sm transition shadow-md shadow-red-600/20 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>{savingEdit ? 'Saving...' : 'Save Business Changes'}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
