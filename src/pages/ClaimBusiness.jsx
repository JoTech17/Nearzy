import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Briefcase, Search, ShieldCheck, CheckCircle2, AlertCircle, Loader2, FileText, Upload } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { searchBusinesses, submitBusinessClaim } from '@/services/businessService'

export function ClaimBusinessPage() {
  const { t } = useLanguage()
  const { user } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const preselectedId = searchParams.get('id')

  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [selectedBusiness, setSelectedBusiness] = useState(null)

  // Claim Form State
  const [claimantName, setClaimantName] = useState(user?.displayName || '')
  const [claimantPhone, setClaimantPhone] = useState(user?.phone || '+91 ')
  const [evidenceText, setEvidenceText] = useState('')
  const [docType, setDocType] = useState('GST Certificate')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  // If preselected ID passed in query
  useEffect(() => {
    if (preselectedId) {
      searchBusinesses({ limit: 50 }).then((bizs) => {
        const found = bizs.find(b => b.id === preselectedId)
        if (found) setSelectedBusiness(found)
      })
    }
  }, [preselectedId])

  const handleSearchListing = async (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    setSearching(true)
    try {
      const res = await searchBusinesses({ query: searchQuery.trim(), limit: 10 })
      setSearchResults(res)
    } finally {
      setSearching(false)
    }
  }

  const handleClaimSubmit = async (e) => {
    e.preventDefault()
    if (!selectedBusiness) {
      toast.error('Please select a business to claim.')
      return
    }
    if (!evidenceText.trim()) {
      toast.error('Please describe your evidence of ownership.')
      return
    }

    setLoading(true)
    try {
      await submitBusinessClaim({
        businessId: selectedBusiness.id,
        claimantUserId: user?.id || 'guest_' + Date.now(),
        claimantName,
        claimantPhone,
        evidenceText: `Document Type: ${docType} — ${evidenceText}`,
      })

      setSubmitted(true)
      toast.success('Your business claim has been submitted for administrative review.')
    } catch (err) {
      toast.error(err.message || 'Failed to submit claim.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-brand-orange">
          Ownership Verification
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
          Claim an Existing Business Listing
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          If your shop or service is already cataloged on Nearzy, claim it here to gain verified owner control and manage bookings.
        </p>
      </div>

      {submitted ? (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-8 text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Claim Submitted for Verification</h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
            Your ownership claim for <strong>{selectedBusiness?.name}</strong> has been logged. Our administrative team will verify your submitted documents and approve access within 24-48 business hours.
          </p>
          <div className="pt-4 flex justify-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="px-5 py-2.5 rounded-xl bg-brand-blue text-white text-xs font-bold shadow-sm"
            >
              Go to Dashboard
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700"
            >
              Back to Home
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-6 sm:p-10 space-y-8">
          {/* Step 1: Search Existing Listing */}
          {!selectedBusiness ? (
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2">
                1. Search for Your Listing
              </h3>

              <form onSubmit={handleSearchListing} className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter shop name, phone or locality (e.g. OMR iTech, Express Plumbing)..."
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:border-brand-blue outline-none"
                />
                <button
                  type="submit"
                  disabled={searching}
                  className="px-5 py-2.5 rounded-xl bg-brand-blue hover:bg-brand-electric text-white text-xs font-bold transition flex items-center gap-2"
                >
                  {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                  <span>Search</span>
                </button>
              </form>

              {/* Search Results */}
              <div className="space-y-2 pt-2">
                {searchResults.map((b) => (
                  <div
                    key={b.id}
                    onClick={() => setSelectedBusiness(b)}
                    className="p-3.5 rounded-2xl border border-slate-200 hover:border-brand-blue hover:bg-blue-50/50 cursor-pointer transition flex items-center justify-between"
                  >
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{b.name}</h4>
                      <p className="text-xs text-slate-500">{b.categoryName} • {b.locality}, {b.city}</p>
                    </div>
                    <span className="text-xs font-bold text-brand-blue">
                      Select Listing →
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Selected Business Banner */
            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-brand-blue uppercase">Selected Business</span>
                <h4 className="text-base font-bold text-slate-900">{selectedBusiness.name}</h4>
                <p className="text-xs text-slate-600">{selectedBusiness.categoryName} • {selectedBusiness.locality}, {selectedBusiness.city}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBusiness(null)}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 underline"
              >
                Change
              </button>
            </div>
          )}

          {/* Step 2: Verification Evidence Form */}
          {selectedBusiness && (
            <form onSubmit={handleClaimSubmit} className="space-y-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2">
                2. Ownership Verification Evidence
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Full Legal Name *
                  </label>
                  <input
                    type="text"
                    value={claimantName}
                    onChange={(e) => setClaimantName(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-brand-blue outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Contact Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={claimantPhone}
                    onChange={(e) => setClaimantPhone(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-brand-blue outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Type of Proof Document *
                </label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:border-brand-blue outline-none"
                >
                  <option value="GST Certificate">GSTIN Certificate</option>
                  <option value="Trade License / Shop Act">Tamil Nadu Shop & Establishment Act License</option>
                  <option value="Electricity Bill / Utility">Commercial Electricity (TNEB) / Utility Bill</option>
                  <option value="Aadhaar / Business Card">Government ID & Business Visiting Card</option>
                  <option value="Udyam Registration">MSME / Udyam Registration Certificate</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Document Details & Ownership Statement *
                </label>
                <textarea
                  rows={4}
                  value={evidenceText}
                  onChange={(e) => setEvidenceText(e.target.value)}
                  placeholder="Provide your registration number, certificate link or details explaining your role (e.g., Sole Proprietor, Managing Partner) for admin audit..."
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-brand-blue outline-none resize-none"
                />
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 leading-relaxed">
                <strong>Anti-Fraud Policy:</strong> Administrative authorization is required before ownership privileges are transferred. Claims submitted with false documents will be permanently suspended.
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-7 py-3 rounded-xl bg-brand-orange hover:bg-orange-600 disabled:opacity-50 text-white font-bold text-xs shadow-md transition flex items-center gap-2"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Submit Claim for Administrative Review</span>
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  )
}
