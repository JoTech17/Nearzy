import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Clock, MapPin, Phone, FileText, CheckCircle2, AlertCircle, Loader2, Lock, User, ArrowRight } from 'lucide-react'
import { Modal } from './common/Modal'
import { useLanguage } from '@/context/LanguageContext'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { createBooking } from '@/services/businessService'

export function BookingModal({ isOpen, onClose, business, initialService = null }) {
  const { t, language } = useLanguage()
  const { user } = useAuth()
  const toast = useToast()

  const services = business?.services || []
  const [selectedServiceId, setSelectedServiceId] = useState(initialService?.id || services[0]?.id || '')
  const [requestedDate, setRequestedDate] = useState(() => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0]
  })
  const [requestedTime, setRequestedTime] = useState('10:00')
  const [serviceMode, setServiceMode] = useState('at_doorstep')
  const [phone, setPhone] = useState(user?.phone || '+91 ')
  const [address, setAddress] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [createdBooking, setCreatedBooking] = useState(null)
  const [error, setError] = useState('')

  const activeService = services.find(s => s.id === selectedServiceId) || services[0]

  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) {
      setError('Sign in is required to book a service.')
      return
    }
    if (!selectedServiceId) {
      setError('Please select a service.')
      return
    }
    if (!phone || phone.trim().length < 8) {
      setError('Please enter a valid contact phone number.')
      return
    }
    if (serviceMode === 'at_doorstep' && !address.trim()) {
      setError('Please enter your service address for doorstep visit.')
      return
    }

    setLoading(true)
    setError('')
    try {
      const newBooking = await createBooking({
        customerId: user.id,
        customerName: user.displayName || user.email?.split('@')[0] || 'Customer',
        customerPhone: phone,
        businessId: business.id,
        businessName: business.name,
        serviceId: selectedServiceId,
        serviceName: activeService?.name || 'Local Service',
        requestedDate,
        requestedTime,
        serviceMode,
        serviceAddress: address,
        notes,
        estimatedPrice: activeService?.price || business?.minPrice || 299,
      })

      setCreatedBooking(newBooking)
      toast.success(t('bookingSuccessTitle'))
    } catch (err) {
      setError(err.message || 'Failed to submit booking request.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setCreatedBooking(null)
    setError('')
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleReset} title={t('bookingModalTitle')} maxWidth="max-w-xl">
      {!user ? (
        <div className="py-8 px-4 text-center space-y-6 animate-in fade-in duration-200">
          <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto border border-red-200 shadow-sm">
            <Lock className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-red-600">
              Sign In Mandatory
            </span>
            <h3 className="text-2xl font-black text-black">
              Sign In Required to Book Services
            </h3>
            <p className="text-xs text-neutral-600 max-w-sm mx-auto font-medium">
              To book a verified doorstep service with <strong className="text-black">{business?.name}</strong>, please sign in to your Nearzy account.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to={`/login?role=customer&redirect=${encodeURIComponent(window.location.pathname)}`}
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-red-600 hover:bg-black text-white text-xs font-black transition flex items-center justify-center gap-1.5 shadow-md"
            >
              <User className="w-4 h-4" />
              <span>Customer Sign In</span>
            </Link>
            <Link
              to={`/register?role=customer&redirect=${encodeURIComponent(window.location.pathname)}`}
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-3 rounded-xl border-2 border-black hover:bg-black hover:text-white text-black text-xs font-black transition flex items-center justify-center gap-1.5"
            >
              <span>Create Account</span>
            </Link>
          </div>
        </div>
      ) : createdBooking ? (
        <div className="py-6 text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h4 className="text-xl font-bold text-slate-900">{t('bookingSuccessTitle')}</h4>
          <p className="text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
            {t('bookingSuccessDesc')}
          </p>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left text-xs space-y-2 max-w-sm mx-auto">
            <div className="flex justify-between">
              <span className="text-slate-500">Booking Ref:</span>
              <strong className="font-mono text-slate-800">{createdBooking.id}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Service:</span>
              <span className="font-semibold text-slate-800">{createdBooking.serviceName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Date & Time:</span>
              <span className="font-semibold text-slate-800">{createdBooking.requestedDate} at {createdBooking.requestedTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Estimated Total:</span>
              <span className="font-extrabold text-brand-dark">₹{createdBooking.estimatedPrice}</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-4">
            <Link
              to="/dashboard"
              onClick={handleReset}
              className="px-5 py-2.5 rounded-xl bg-brand-blue text-white text-xs font-bold shadow-sm hover:bg-brand-electric transition"
            >
              Go to My Bookings
            </Link>
            <button
              onClick={handleReset}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition"
            >
              Close
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Business Summary */}
          <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase text-brand-blue tracking-wider">
                Booking with
              </span>
              <h4 className="text-sm font-bold text-slate-900">{business?.name}</h4>
              <p className="text-xs text-slate-500">{business?.locality}, {business?.city}</p>
            </div>
          </div>

          {/* Service Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              {t('selectServiceLabel')}
            </label>
            <select
              value={selectedServiceId}
              onChange={(e) => setSelectedServiceId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:border-brand-blue focus:ring-2 focus:ring-blue-100 outline-none"
            >
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} — ₹{s.price} ({s.durationMinutes} mins)
                </option>
              ))}
            </select>
          </div>

          {/* Date & Time Slot */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                {t('selectDateLabel')}
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={requestedDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setRequestedDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:border-brand-blue focus:ring-2 focus:ring-blue-100 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                {t('selectTimeLabel')}
              </label>
              <select
                value={requestedTime}
                onChange={(e) => setRequestedTime(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:border-brand-blue focus:ring-2 focus:ring-blue-100 outline-none"
              >
                {timeSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot} {parseInt(slot) < 12 ? 'AM' : 'PM'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Service Mode */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              {t('selectModeLabel')}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setServiceMode('at_doorstep')}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold transition text-left flex items-center gap-2 ${
                  serviceMode === 'at_doorstep'
                    ? 'border-brand-blue bg-blue-50 text-brand-blue'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>{t('modeDoorstep')}</span>
              </button>
              <button
                type="button"
                onClick={() => setServiceMode('at_shop')}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold transition text-left flex items-center gap-2 ${
                  serviceMode === 'at_shop'
                    ? 'border-brand-blue bg-blue-50 text-brand-blue'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>{t('modeShop')}</span>
              </button>
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              {t('yourPhoneLabel')} *
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98400 12345"
                required
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:border-brand-blue focus:ring-2 focus:ring-blue-100 outline-none"
              />
            </div>
          </div>

          {/* Address if doorstep */}
          {serviceMode === 'at_doorstep' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                {t('doorstepAddressLabel')} *
              </label>
              <textarea
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Door/Flat No, Apartment name, Street, Locality landmark..."
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:border-brand-blue focus:ring-2 focus:ring-blue-100 outline-none resize-none"
              />
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              {t('specialNotesLabel')}
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Describe the issue in detail, preferred gate entry, etc."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:border-brand-blue focus:ring-2 focus:ring-blue-100 outline-none resize-none"
            />
          </div>

          {/* Total & Submit */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-400 block">{t('estimatedTotal')}</span>
              <span className="text-xl font-black text-slate-900">
                ₹{activeService?.price || business?.minPrice || 299}
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-brand-blue hover:bg-brand-electric disabled:opacity-60 text-white font-bold text-xs shadow-md transition flex items-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{t('confirmBookingBtn')}</span>
            </button>
          </div>
        </form>
      )}
    </Modal>
  )
}
