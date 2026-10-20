import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Briefcase, MapPin, Phone, CheckCircle2, ArrowRight, Loader2, Image, DollarSign, AlertCircle, Shield } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { getCategories, createBusiness, getOwnerBusiness } from '@/services/businessService'
import { LocationPickerMap } from '@/components/common/LocationPickerMap'
import { getServiceImage } from '@/data/serviceImages'

export function RegisterBusinessPage() {
  const { t, language } = useLanguage()
  const { user, updateProfile } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()

  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [existingBusiness, setExistingBusiness] = useState(null)
  const [checkingExisting, setCheckingExisting] = useState(true)

  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    description: '',
    locality: '',
    city: '',
    district: '',
    locationDisplay: '',
    latitude: null,
    longitude: null,
    address: '',
    doorNo: '',
    postalCode: '',
    phone: user?.phone || '+91 ',
    email: user?.email || '',
    website: '',
    coverImage: '',
    minPrice: 299,
    serviceName: 'Standard Consultation / Service Visit',
    servicePrice: 299,
    serviceDuration: 60,
    experienceYears: 5,
  })

  useEffect(() => {
    async function checkUserBusiness() {
      if (!user) {
        setCheckingExisting(false)
        navigate('/login?role=business_owner&redirect=/register-business')
        return
      }
      try {
        const myBiz = await getOwnerBusiness(user.id, user.businessId)
        if (myBiz) {
          setExistingBusiness(myBiz)
        }
      } catch (err) {
        console.warn('Error checking existing business:', err)
      } finally {
        setCheckingExisting(false)
      }
    }
    checkUserBusiness()
  }, [user, navigate])

  useEffect(() => {
    async function load() {
      const cats = await getCategories()
      setCategories(cats)
      if (cats.length > 0) {
        setFormData(prev => ({ ...prev, categoryId: cats[0].id }))
      }
    }
    load()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // 1. If not logged in, ask to sign in first (do not enter directly as service provider)
  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto border border-red-200 shadow-sm">
          <Briefcase className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-red-600">Partner Registration</span>
          <h2 className="text-2xl sm:text-3xl font-black text-black">Sign In to Register Your Business</h2>
          <p className="text-sm text-neutral-600 max-w-md mx-auto">
            Please sign in or create an account to register your shop or service listing on Nearzy.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to="/login?role=business_owner&redirect=/register-business"
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

  if (checkingExisting) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center text-sm font-semibold text-neutral-500">
        Checking account status...
      </div>
    )
  }

  // 2. Enforce One Business Per Account
  if (existingBusiness) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
          <AlertCircle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700">Account Limit • 1 Business</span>
          <h2 className="text-2xl font-black text-black">You Already Have an Active Business</h2>
          <p className="text-sm text-neutral-600 max-w-md mx-auto">
            Each Nearzy business partner account can manage exactly one business listing. Your account is already linked to:
          </p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-neutral-200 max-w-md mx-auto text-left shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-black">{existingBusiness.name}</h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-50 text-green-700 border border-green-200">
              Active Listing
            </span>
          </div>
          <p className="text-xs text-neutral-500">{existingBusiness.locality}, {existingBusiness.city}</p>
          <p className="text-xs text-neutral-600 pt-2 border-t border-neutral-100 mt-2">
            Phone: <strong>{existingBusiness.phone}</strong>
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
          <Link
            to="/owner-dashboard"
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-red-600 hover:bg-black text-white font-extrabold text-sm transition shadow-lg shadow-red-600/20"
          >
            Manage Your Business Dashboard
          </Link>
          <Link
            to="/"
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-neutral-100 hover:bg-neutral-200 text-black font-bold text-sm transition"
          >
            Return to Marketplace
          </Link>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.phone.trim()) {
      toast.error('Please enter your Business Name and Contact Phone.')
      return
    }

    setLoading(true)
    try {
      const selectedCat = categories.find(c => c.id === formData.categoryId) || categories[0]
      const finalAddress = formData.doorNo
        ? `${formData.doorNo}, ${formData.address || formData.locality}`
        : (formData.address || `${formData.locality}, ${formData.city}, Tamil Nadu`)

      const newBiz = await createBusiness({
        name: formData.name,
        categoryId: formData.categoryId,
        categorySlug: selectedCat.slug,
        categoryName: selectedCat.name,
        categoryNameTa: selectedCat.name_ta,
        categoryIcon: selectedCat.icon,
        description: formData.description || 'Professional local services across Tamil Nadu.',
        address: finalAddress,
        locality: formData.locality,
        city: formData.city,
        state: 'Tamil Nadu',
        postalCode: formData.postalCode,
        latitude: formData.latitude,
        longitude: formData.longitude,
        phone: formData.phone,
        email: formData.email,
        website: formData.website,
        coverImage: formData.coverImage || getServiceImage(selectedCat.slug),
        minPrice: Number(formData.minPrice) || 299,
        experienceYears: Number(formData.experienceYears) || 3,
        ownerId: user?.id,
        serviceMode: ['at_doorstep', 'at_shop'],
        services: [
          {
            id: 's_' + Date.now(),
            name: formData.serviceName,
            price: Number(formData.servicePrice),
            pricingType: 'fixed',
            durationMinutes: Number(formData.serviceDuration),
            bookingEnabled: true,
          }
        ],
        openingHours: [
          { day: 1, open: '09:00', close: '20:00', closed: false },
          { day: 2, open: '09:00', close: '20:00', closed: false },
          { day: 3, open: '09:00', close: '20:00', closed: false },
          { day: 4, open: '09:00', close: '20:00', closed: false },
          { day: 5, open: '09:00', close: '20:00', closed: false },
          { day: 6, open: '09:00', close: '20:00', closed: false },
          { day: 0, open: '10:00', close: '14:00', closed: false },
        ]
      })

      if (updateProfile) {
        await updateProfile({ businessId: newBiz.id, role: 'business_owner' })
      }

      toast.success('Business registered successfully and pinned on Tamil Nadu map!')
      navigate(`/owner-dashboard`)
    } catch (err) {
      toast.error(err.message || 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-6 sm:p-10 space-y-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-red-600">
            Partner with Nearzy
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Register Your Business Listing
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Publish your services to thousands of local customers in your neighbourhood.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Business Basic Details */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2">
              1. Basic Information
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Business / Provider Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Royal Electricals & Appliances"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-brand-blue outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Primary Category *
                </label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:border-brand-blue outline-none"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.name_ta})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Years of Experience
                </label>
                <input
                  type="number"
                  name="experienceYears"
                  value={formData.experienceYears}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-brand-blue outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Business Description
              </label>
              <textarea
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                placeholder="Highlight what makes your service reliable, brands supported, warranties, etc."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-brand-blue outline-none resize-none"
              />
            </div>
          </div>

          {/* Location & Map Selection */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="border-b border-slate-100 pb-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-red-600">
                Interactive Map Pinning
              </span>
              <h3 className="text-sm font-extrabold text-neutral-900 mt-0.5">
                2. Select Your Shop Location on the Map
              </h3>
              <p className="text-xs text-neutral-500">
                Instead of writing out addresses, tap anywhere on the map or drag the pin directly to your shop.
              </p>
            </div>

            <LocationPickerMap
              initialLat={formData.latitude}
              initialLng={formData.longitude}
              height="360px"
              onLocationChange={(locData) => {
                setFormData(prev => ({
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

            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                Shop / Building / Door No. or Landmark <span className="font-normal text-neutral-400 lowercase">(optional)</span>
              </label>
              <input
                type="text"
                name="doorNo"
                value={formData.doorNo || ''}
                onChange={handleChange}
                placeholder="e.g. Shop #12, 1st Floor, Near Bus Stand (Optional)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:ring-2 focus:ring-red-600 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Contact Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-brand-blue outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-brand-blue outline-none"
                />
              </div>
            </div>
          </div>

          {/* Primary Service */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2">
              3. Featured Service & Minimum Fee
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Primary Service Name *
                </label>
                <input
                  type="text"
                  name="serviceName"
                  value={formData.serviceName}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-brand-blue outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Fee (₹) *
                </label>
                <input
                  type="number"
                  name="servicePrice"
                  value={formData.servicePrice}
                  onChange={handleChange}
                  min="0"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-brand-blue outline-none"
                />
              </div>
            </div>
          </div>

          {/* Photo URL */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2">
              4. Business Cover Photo
            </h3>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Image URL (Unsplash or CDN link)
              </label>
              <input
                type="url"
                name="coverImage"
                value={formData.coverImage}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-brand-blue outline-none"
              />
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 rounded-xl bg-brand-blue hover:bg-brand-electric disabled:opacity-60 text-white font-bold text-xs shadow-md transition flex items-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>Create Business Listing</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
