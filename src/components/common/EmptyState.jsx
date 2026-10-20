import React from 'react'
import { AlertCircle } from 'lucide-react'

export function EmptyState({
  icon: Icon = AlertCircle,
  title,
  description,
  actionLabel,
  onAction,
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-white rounded-2xl border border-dashed border-slate-200">
      <div className="w-16 h-16 mb-4 rounded-2xl bg-blue-50 text-brand-blue flex items-center justify-center">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-slate-800 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 max-w-md mb-6 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-brand-blue hover:bg-brand-electric text-white font-medium text-sm transition shadow-sm"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}
