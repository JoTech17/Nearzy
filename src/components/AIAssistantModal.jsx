import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, Search, ArrowRight, CheckCircle2, AlertCircle, Loader2, MapPin, Tag, HelpCircle, Phone, Mail, ExternalLink } from 'lucide-react'
import { Modal } from './common/Modal'
import { BusinessCard } from './common/BusinessCard'
import { useLanguage } from '@/context/LanguageContext'
import { queryAIAssistant } from '@/services/aiService'

export function AIAssistantModal({ isOpen, onClose }) {
  const { t, language } = useLanguage()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const examplePrompts = [
    'Show all services in kkdi',
    'Emergency plumber in Karaikudi under ₹500',
    'How to register my business on Nearzy?',
    'Electrician in Gandhipuram Coimbatore',
    'Best car and bike services in Madurai',
    'Nearzy support phone number & contact',
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

        {/* Search Results & Knowledge / Intent Analysis */}
        {result && !loading && (
          <div className="space-y-5 animate-in fade-in duration-200">
            {/* 1. Platform Knowledge Card (if general platform/guide question) */}
            {result.isKnowledge ? (
              <div className="p-5 rounded-2xl bg-neutral-900 text-white border border-neutral-800 space-y-4 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-red-500">
                    <HelpCircle className="w-4 h-4" />
                    <span>{result.title || 'Nearzy Assistant Answer'}</span>
                  </div>
                  <button
                    onClick={handleReset}
                    className="text-xs text-neutral-400 hover:text-white font-bold"
                  >
                    New Search
                  </button>
                </div>

                <div className="text-xs sm:text-sm text-neutral-200 whitespace-pre-line leading-relaxed font-medium">
                  {result.explanation}
                </div>

                {/* Quick Action Links */}
                {result.links && result.links.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-neutral-800">
                    {result.links.map((link, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          onClose()
                          navigate(link.path)
                        }}
                        className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-white hover:text-black text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                      >
                        <span>{link.label}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Support Contact Reminder */}
                <div className="pt-2 text-[11px] text-neutral-400 flex flex-wrap items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3 text-red-500" />
                    +91 88386 97749
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail className="w-3 h-3 text-red-500" />
                    jothikap56@gmail.com
                  </span>
                </div>
              </div>
            ) : result.needsLocation ? (
              /* Location Request Card with clickable chips */
              <div className="p-5 rounded-2xl bg-neutral-900 text-white border border-neutral-800 space-y-4 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-red-500">
                    <MapPin className="w-4 h-4" />
                    <span>{result.title || (language === 'ta' ? 'உங்கள் ஊரை தேர்ந்தெடுக்கவும்' : 'Select Location (30 km Radius)')}</span>
                  </div>
                  <button
                    onClick={handleReset}
                    className="text-xs text-neutral-400 hover:text-white font-bold"
                  >
                    Reset
                  </button>
                </div>

                <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed font-medium">
                  {result.explanation}
                </p>

                <div>
                  <span className="block text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-2.5">
                    {language === 'ta' ? 'பிரபலமான இடங்கள் (30 கி.மீ சுற்றளவு):' : 'Popular Towns across Tamil Nadu (30 km Radius):'}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {result.suggestedLocations?.map((loc, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          const targetText = query && !query.includes('services near') && !query.includes('services in')
                            ? `${query} in ${loc.name}`
                            : `services near ${loc.name}`
                          setQuery(targetText)
                          handleSearch(targetText)
                        }}
                        className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-red-600 text-white text-xs font-bold border border-neutral-700 hover:border-red-500 transition shadow-sm flex items-center gap-1.5"
                      >
                        <MapPin className="w-3.5 h-3.5 text-red-400" />
                        <span>{language === 'ta' && loc.nameTa ? loc.nameTa : loc.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* 2. Service Intent Criteria Badges */
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

                {/* Suggested location chips if location wasn't specified */}
                {result.suggestedLocations && result.suggestedLocations.length > 0 && (
                  <div className="pt-2 border-t border-neutral-200">
                    <span className="block text-[11px] font-bold text-neutral-500 uppercase tracking-wider mb-1.5">
                      {language === 'ta' ? '30 கி.மீ சுற்றளவில் வடிகட்ட ஊரை தேர்ந்தெடுக்கவும்:' : 'Filter within 30 km of your town:'}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {result.suggestedLocations.map((loc, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            const targetText = `${query} in ${loc.name}`
                            setQuery(targetText)
                            handleSearch(targetText)
                          }}
                          className="px-2.5 py-1 rounded-lg bg-white hover:bg-red-50 hover:text-red-600 hover:border-red-300 border border-neutral-300 text-xs font-bold text-neutral-800 transition"
                        >
                          {language === 'ta' && loc.nameTa ? loc.nameTa : loc.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Results Grid for Businesses */}
            {result.businesses && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Recommended Providers ({result.businesses?.length || 0})
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
                ) : !result.isKnowledge ? (
                  <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <p className="text-xs text-slate-500 mb-2">
                      No verified businesses found matching this specific criteria.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                      <button
                        onClick={() => handleSearch('Show all services in kkdi')}
                        className="text-xs font-bold text-red-600 hover:underline px-2.5 py-1 rounded-lg bg-red-50"
                      >
                        Try: "Show all services in kkdi"
                      </button>
                      <button
                        onClick={() => handleSearch('Emergency plumber in Karaikudi')}
                        className="text-xs font-bold text-black hover:underline px-2.5 py-1 rounded-lg bg-neutral-100"
                      >
                        Try: "Emergency plumber in Karaikudi"
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  )
}
