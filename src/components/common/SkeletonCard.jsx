import React from 'react'

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-soft animate-pulse flex flex-col gap-4">
      <div className="w-full h-44 bg-slate-200 rounded-xl" />
      <div className="flex justify-between items-center">
        <div className="h-4 w-24 bg-slate-200 rounded-full" />
        <div className="h-4 w-12 bg-slate-200 rounded-full" />
      </div>
      <div className="h-6 w-3/4 bg-slate-200 rounded-md" />
      <div className="h-4 w-full bg-slate-100 rounded-md" />
      <div className="h-4 w-2/3 bg-slate-100 rounded-md" />
      <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between">
        <div className="h-5 w-20 bg-slate-200 rounded-md" />
        <div className="h-8 w-24 bg-slate-200 rounded-lg" />
      </div>
    </div>
  )
}
