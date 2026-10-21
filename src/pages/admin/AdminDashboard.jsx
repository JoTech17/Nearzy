import React, { useState, useEffect } from 'react'
import { 
  Shield, CheckCircle, XCircle, AlertTriangle, Users, 
  Briefcase, FileText, Clock, Search, Layers, Activity, Mail, Phone, Calendar
} from 'lucide-react'
import { Badge } from '@/components/common/Badge'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient'
import { 
  searchBusinesses, 
  getBusinessClaims, 
  reviewBusinessClaim, 
  getCategories, 
  getReports, 
  resolveReport 
} from '@/services/businessService'

export function AdminDashboard() {
  const { user, isAdmin } = useAuth()
  const toast = useToast()

  const [activeTab, setActiveTab] = useState('profiles') // 'profiles' | 'claims' | 'businesses' | 'categories' | 'reports' | 'audit'
  const [businesses, setBusinesses] = useState([])
  const [claims, setClaims] = useState([])
  const [categories, setCategories] = useState([])
  const [reports, setReports] = useState([])
  const [profiles, setProfiles] = useState([])
  const [profileSearch, setProfileSearch] = useState('')
  const [loading, setLoading] = useState(true)

  // Audit log stream
  const [auditLogs, setAuditLogs] = useState([
    { id: '1', action: 'CLAIM_SUBMITTED', entity: 'Kaveri Carpentry & Modular Works', user: 'Verified Owner', time: '10 mins ago' },
    { id: '2', action: 'LISTING_VERIFIED', entity: 'Vetrivel Electricians & Services', user: 'Platform Administrator', time: '2 hours ago' },
    { id: '3', action: 'NEW_BOOKING_CREATED', entity: 'Sri Krishna Plumbing & Services', user: 'Customer Account', time: '4 hours ago' },
  ])

  useEffect(() => {
    async function loadAdminData() {
      setLoading(true)
      try {
        const [bizs, clms, cats, reps] = await Promise.all([
          searchBusinesses({ limit: 50 }),
          getBusinessClaims(),
          getCategories(),
          getReports()
        ])
        setBusinesses(bizs)
        setClaims(clms)
        setCategories(cats)
        setReports(reps)

        if (isSupabaseConfigured && supabase) {
          try {
            const { data: profData } = await supabase
              .from('profiles')
              .select('*, user_roles(role)')
              .order('created_at', { ascending: false })
            if (profData) {
              setProfiles(profData)
            }
          } catch (pErr) {
            console.warn('Error loading Supabase profiles:', pErr)
          }
        }
      } finally {
        setLoading(false)
      }
    }
    loadAdminData()
  }, [])

  const handleApproveClaim = async (claimId) => {
    await reviewBusinessClaim(claimId, 'approved', 'Documents verified by Admin')
    setClaims(prev => prev.map(c => c.id === claimId ? { ...c, status: 'approved' } : c))
    setBusinesses(prev => prev.map(b => b.id === claims.find(c => c.id === claimId)?.businessId ? { ...b, isVerified: true, isClaimed: true } : b))
    toast.success('Business claim approved and verified.')
  }

  const handleRejectClaim = async (claimId) => {
    await reviewBusinessClaim(claimId, 'rejected', 'Insufficient proof of ownership')
    setClaims(prev => prev.map(c => c.id === claimId ? { ...c, status: 'rejected' } : c))
    toast.info('Business claim rejected.')
  }

  const handleToggleVerification = (bizId) => {
    setBusinesses(prev => prev.map(b => {
      if (b.id === bizId) {
        const nextState = !b.isVerified
        toast.success(`${b.name} verification set to ${nextState ? 'VERIFIED' : 'UNVERIFIED'}`)
        return { ...b, isVerified: nextState }
      }
      return b
    }))
  }

  const handleToggleListingStatus = (bizId) => {
    setBusinesses(prev => prev.map(b => {
      if (b.id === bizId) {
        const nextStatus = b.listingStatus === 'active' ? 'suspended' : 'active'
        toast.info(`${b.name} listing is now ${nextStatus.toUpperCase()}`)
        return { ...b, listingStatus: nextStatus }
      }
      return b
    }))
  }

  const handleResolveReport = async (repId) => {
    await resolveReport(repId, 'Investigated and resolved by Admin')
    setReports(prev => prev.map(r => r.id === repId ? { ...r, status: 'resolved' } : r))
    toast.success('Report marked as resolved.')
  }

  // Filtered profiles for live search
  const filteredProfiles = profiles.filter(p => {
    if (!profileSearch.trim()) return true
    const q = profileSearch.toLowerCase()
    return (
      (p.display_name && p.display_name.toLowerCase().includes(q)) ||
      (p.email && p.email.toLowerCase().includes(q)) ||
      (p.id && p.id.toLowerCase().includes(q))
    )
  })

  // Admin KPIs
  const verifiedCount = businesses.filter(b => b.isVerified).length
  const pendingClaimsCount = claims.filter(c => c.status === 'pending').length
  const openReportsCount = reports.filter(r => r.status === 'pending').length

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Header Card */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-purple-600/30 text-purple-400 border border-purple-500/40 flex items-center justify-center font-bold text-xl">
              <Shield className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight">
                  Nearzy Administrator Console
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-purple-500/20 text-purple-300 border border-purple-400/30">
                  Root Admin
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Full platform oversight, business verification audits, complaints moderation, and categories.
              </p>
            </div>
          </div>
        </div>

        {/* 5 KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-purple-500/30">
            <span className="text-[11px] font-bold text-purple-300 uppercase">Registered Profiles</span>
            <span className="block text-2xl font-black text-white mt-1">{profiles.length}</span>
            <span className="text-[11px] text-purple-300">Live in Supabase</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Total Businesses</span>
            <span className="block text-2xl font-black text-white mt-1">{businesses.length}</span>
            <span className="text-[11px] text-emerald-400">{verifiedCount} verified</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Pending Claims</span>
            <span className="block text-2xl font-black text-amber-400 mt-1">{pendingClaimsCount}</span>
            <span className="text-[11px] text-slate-400">Needs audit</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Active Categories</span>
            <span className="block text-2xl font-black text-white mt-1">{categories.length}</span>
            <span className="text-[11px] text-brand-electric">Bilingual EN / தமிழ்</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 col-span-2 sm:col-span-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Open Complaints</span>
            <span className="block text-2xl font-black text-red-400 mt-1">{openReportsCount}</span>
            <span className="text-[11px] text-slate-400">User reports</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('profiles')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'profiles'
              ? 'bg-purple-700 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Registered Profiles ({profiles.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('claims')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'claims'
              ? 'bg-purple-700 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Business Claims ({claims.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('businesses')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'businesses'
              ? 'bg-purple-700 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Manage Listings ({businesses.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'categories'
              ? 'bg-purple-700 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Categories ({categories.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'reports'
              ? 'bg-purple-700 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Reports & Complaints ({reports.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'audit'
              ? 'bg-purple-700 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Audit Logs</span>
        </button>
      </div>

      {/* Tab: Registered User Profiles from Supabase */}
      {activeTab === 'profiles' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Registered User Accounts ({filteredProfiles.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Live user profiles registered on Nearzy and synchronized with Supabase Database.
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by name, email, or ID..."
                  value={profileSearch}
                  onChange={(e) => setProfileSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-purple-600"
                />
              </div>
            </div>

            {filteredProfiles.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <Users className="w-12 h-12 mx-auto mb-2 opacity-40 text-slate-300" />
                <p className="text-sm font-semibold">No registered user profiles found</p>
                <p className="text-xs text-slate-400 mt-1">Users will appear here as soon as they sign up via the registration page.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">User</th>
                      <th className="py-3 px-4">Contact</th>
                      <th className="py-3 px-4">Role</th>
                      <th className="py-3 px-4">Database UUID</th>
                      <th className="py-3 px-4">Language</th>
                      <th className="py-3 px-4">Registered On</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {filteredProfiles.map((p) => {
                      const userRole = p.user_roles?.[0]?.role || 'customer'
                      return (
                        <tr key={p.id} className="hover:bg-slate-50/70 transition">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-xs">
                                {(p.display_name || p.email || 'U')[0].toUpperCase()}
                              </div>
                              <div>
                                <span className="font-bold text-slate-900 block">{p.display_name || 'Anonymous User'}</span>
                                <span className="text-[11px] text-slate-400 font-mono">ID: {p.id.substring(0, 8)}...</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-1.5 text-slate-800">
                                <Mail className="w-3 h-3 text-slate-400" />
                                <span>{p.email || 'No email'}</span>
                              </div>
                              {p.phone && (
                                <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                                  <Phone className="w-3 h-3 text-slate-400" />
                                  <span>{p.phone}</span>
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant={userRole === 'admin' ? 'purple' : userRole === 'business_owner' ? 'warning' : 'info'}>
                              {userRole.toUpperCase()}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                            {p.id}
                          </td>
                          <td className="py-3 px-4">
                            <span className="uppercase font-bold text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                              {p.preferred_language || 'en'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-500">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-slate-400" />
                              <span>{new Date(p.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 1: Claims Review */}
      {activeTab === 'claims' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-soft overflow-hidden divide-y divide-slate-100">
            {claims.map((claim) => (
              <div key={claim.id} className="p-6 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="font-mono text-xs font-bold text-slate-400">Claim ID: {claim.id}</span>
                    <h3 className="font-bold text-base text-slate-900 mt-0.5">{claim.businessName}</h3>
                    <p className="text-xs text-slate-500">
                      Claimant: <strong>{claim.claimantName}</strong> ({claim.claimantPhone})
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant={claim.status === 'approved' ? 'success' : claim.status === 'rejected' ? 'danger' : 'warning'}>
                      {claim.status.toUpperCase()}
                    </Badge>

                    {claim.status === 'pending' && (
                      <div className="flex items-center gap-2 ml-2">
                        <button
                          onClick={() => handleApproveClaim(claim.id)}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition"
                        >
                          Approve Claim
                        </button>
                        <button
                          onClick={() => handleRejectClaim(claim.id)}
                          className="px-3.5 py-1.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 font-bold text-xs transition"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700">
                  <strong className="block text-slate-900 mb-1">Submitted Evidence:</strong>
                  <p>{claim.evidenceText}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Manage Businesses */}
      {activeTab === 'businesses' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-soft overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
                  <tr>
                    <th className="p-4">Business Name</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Locality</th>
                    <th className="p-4">Verified</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {businesses.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/50 transition">
                      <td className="p-4 font-bold text-slate-900">{b.name}</td>
                      <td className="p-4 text-slate-600">{b.categoryName}</td>
                      <td className="p-4 text-slate-600">{b.locality}, {b.city}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${b.isVerified ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                          {b.isVerified ? 'VERIFIED' : 'UNVERIFIED'}
                        </span>
                      </td>
                      <td className="p-4">
                        <Badge variant={b.listingStatus === 'active' ? 'success' : 'danger'}>
                          {b.listingStatus?.toUpperCase() || 'ACTIVE'}
                        </Badge>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => handleToggleVerification(b.id)}
                          className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-[11px] font-bold"
                        >
                          {b.isVerified ? 'Unverify' : 'Verify'}
                        </button>
                        <button
                          onClick={() => handleToggleListingStatus(b.id)}
                          className="px-2.5 py-1 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-[11px] font-bold"
                        >
                          {b.listingStatus === 'active' ? 'Suspend' : 'Restore'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Categories */}
      {activeTab === 'categories' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {categories.map((c) => (
              <div key={c.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/60 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">{c.name}</h4>
                  <p className="text-[11px] text-slate-500">{c.name_ta}</p>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  Active
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Complaints & Reports */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-6 divide-y divide-slate-100">
            {reports.map((rep) => (
              <div key={rep.id} className="py-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="font-mono text-xs text-slate-400">Report #{rep.id}</span>
                    <h4 className="font-bold text-sm text-slate-900">{rep.businessName}</h4>
                    <p className="text-xs text-red-600 font-semibold">{rep.reason}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={rep.status === 'resolved' ? 'success' : 'danger'}>
                      {rep.status.toUpperCase()}
                    </Badge>
                    {rep.status === 'pending' && (
                      <button
                        onClick={() => handleResolveReport(rep.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-brand-blue text-white font-bold text-xs"
                      >
                        Resolve
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-xs text-slate-600">{rep.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Audit Logs */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-6 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2">
            Security & Ownership Audit Trail
          </h3>
          <div className="divide-y divide-slate-100">
            {auditLogs.map((log) => (
              <div key={log.id} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                    {log.action}
                  </span>
                  <span className="text-slate-800 font-medium">{log.entity}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-400">
                  <span>By: {log.user}</span>
                  <span>{log.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
