import React, { useState } from 'react'
import { AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react'
import { Modal } from './common/Modal'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { submitReport } from '@/services/businessService'

export function ReportModal({ isOpen, onClose, businessId = null, businessName = '' }) {
  const { user } = useAuth()
  const toast = useToast()
  const [reason, setReason] = useState('Incorrect business information')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const reasons = [
    'Incorrect business information',
    'Fake or misleading pricing',
    'Phone number not reachable / incorrect owner',
    'Inappropriate photos or content',
    'Poor service / consumer dispute',
    'Other issue',
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!description.trim()) return

    setLoading(true)
    try {
      await submitReport({
        reporterId: user?.id || 'guest_' + Date.now(),
        businessId,
        reason,
        description,
      })
      setSubmitted(true)
      toast.success('Report submitted to Nearzy Moderation team')
    } catch (err) {
      toast.error('Failed to submit report. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setSubmitted(false)
    setDescription('')
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleReset} title="Report Listing or Issue" maxWidth="max-w-md">
      {submitted ? (
        <div className="py-6 text-center space-y-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
          <h4 className="text-base font-bold text-slate-900">Report Received</h4>
          <p className="text-xs text-slate-600">
            Our admin moderation team will investigate your report regarding <strong>{businessName}</strong> and take appropriate action.
          </p>
          <button
            onClick={handleReset}
            className="px-5 py-2 mt-2 rounded-xl bg-slate-900 text-white text-xs font-bold"
          >
            Close
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Reporting <strong>{businessName}</strong></span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Reason for Report
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:border-brand-blue outline-none"
            >
              {reasons.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Details & Evidence
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what is wrong or misleading..."
              required
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-brand-blue outline-none resize-none"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !description.trim()}
              className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs font-bold transition flex items-center gap-1.5"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              Submit Report
            </button>
          </div>
        </form>
      )}
    </Modal>
  )
}
