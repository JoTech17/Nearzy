import React, { useState } from 'react'
import { Sparkles, Search, ArrowRight, CheckCircle2, AlertCircle, Loader2, MapPin, Tag } from 'lucide-react'
import { Modal } from './common/Modal'
import { BusinessCard } from './common/BusinessCard'
import { useLanguage } from '@/context/LanguageContext'
import { queryAIAssistant } from '@/services/aiService'

export function AIAssistantModal({ isOpen, onClose }) {
  const { t, language } = useLanguage()
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const examplePrompts = [
    'Find best service in sivagangai',
    'Emergency plumber in Karaikudi under ₹500',
    'Electrician in Gandhipuram Coimbatore',
    'AC repair & foam cleaning in Madurai within 30km',
    'Best laptop service center in Salem',
    'Full home deep cleaning in Tirunelveli',
  ]

  const handleSearch = async (textToSearch) => {
    const q = textToSearch || query
    if (!q.trim()) return

    setLoading(true)
    setError('')
    try {
      const data = await queryAIAssistant(q, language)
      setResult(data)
    } catch (err) {
      setError(err.message || 'Failed to interpret AI query')
    } finally {
      setLoading(false)
    }
  }

  const handleSelectExample = (prompt) => {
    setQuery(prompt)
    handleSearch(prompt)
  }

  const handleReset = () => {
    setQuery('')
    setResult(null)
    setError('')
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('aiAssistantTitle')} maxWidth="max-w-3xl">
      <div className="space-y-6">
        {/* Intro */}
        <div className="p-4 rounded-2xl bg-neutral-900 text-white border border-neutral-800 flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-sm">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h4 className="text-sm font-black text-white mb-1">
              "Unga Ooru, Unga Service!" — Powered by Gemini AI
            </h4>
            <p className="text-xs text-neutral-300 leading-relaxed font-medium">
              {t('aiAssistantSubtitle')}
            </p>
          </div>
        </div>

        {/* Input box */}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSearch()
          }}
          className="relative"
        >
          <div className="relative flex items-center">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('aiInputPlaceholder')}
              className="w-full pl-11 pr-28 py-3.5 rounded-2xl border border-neutral-300 focus:border-red-600 focus:ring-4 focus:ring-red-100 outline-none text-sm transition shadow-sm font-medium"
              disabled={loading}
              autoFocus
            />
            <Search className="w-5 h-5 text-neutral-400 absolute left-4 pointer-events-none" />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="absolute right-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-black disabled:opacity-50 text-white font-black text-xs transition flex items-center gap-1.5 shadow-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Thinking...</span>
                </>
              ) : (
                <>
                  <span>{t('aiSearchBtn')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Example prompts */}
        {!result && (
          <div>
            <span className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2.5">
              {t('aiTryPrompts')}
            </span>
            <div className="flex flex-wrap gap-2">
              {examplePrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectExample(prompt)}
                  className="px-3 py-1.5 rounded-xl bg-neutral-100 hover:bg-red-50 hover:text-red-700 hover:border-red-300 border border-neutral-200 text-xs font-semibold text-neutral-800 transition text-left"
                >
                  "{prompt}"
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading status */}
        {loading && (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <Loader2 className="w-8 h-8 text-red-600 animate-spin mb-3" />
            <p className="text-sm font-bold text-black">{t('aiThinking')}</p>
            <p className="text-xs text-neutral-400 mt-1">Extracting category, budget, and local coordinates...</p>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Search Results & Intent Analysis */}
        {result && !loading && (
          <div className="space-y-5 animate-in fade-in duration-200">
            {/* Extracted Intent Criteria Badges */}
            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-neutral-600">
                  {t('aiInterpretedIntent')}
                </span>
                <button
                  onClick={handleReset}
                  className="text-xs text-red-600 hover:underline font-bold"
                >
                  New AI Search
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                {result.criteria?.categoryName && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-red-50 text-red-700 border border-red-200">
                    <Tag className="w-3 h-3" />
                    {result.criteria.categoryName}
                  </span>
                )}
                {result.criteria?.locality && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-black text-white">
                    <MapPin className="w-3 h-3" />
                    {result.criteria.locality}
                  </span>
                )}
                {result.criteria?.maxBudget && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-neutral-100 text-neutral-900 border border-neutral-300">
                    ₹ Max: {result.criteria.maxBudget}
                  </span>
                )}
              </div>

              <p className="text-xs text-neutral-700 font-medium italic pt-1">
                "{result.explanation}"
              </p>
            </div>

            {/* Results Grid */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Recommended Businesses ({result.businesses?.length || 0})
                </h5>
                <span className="text-[11px] text-slate-400">
                  Ranked by proximity & match relevance
                </span>
              </div>

              {result.businesses?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[380px] overflow-y-auto pr-1">
                  {result.businesses.map((biz) => (
                    <div key={biz.id} onClick={onClose}>
                      <BusinessCard business={biz} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <p className="text-xs text-slate-500 mb-2">
                    No verified businesses found matching this specific criteria.
                  </p>
                  <button
                    onClick={() => handleSearch('Find best service in sivagangai')}
                    className="text-xs font-bold text-red-600 hover:underline"
                  >
                    Try searching for best service in sivagangai
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}
