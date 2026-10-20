import React, { useState, useEffect, useRef } from 'react'
import { MapPin, X, Check, Search } from 'lucide-react'
import { searchLocations, resolveLocation, TAMIL_NADU_LOCATIONS } from '@/data/tamilNaduLocations'

/**
 * Interactive Typeahead Location Autocomplete for Tamil Nadu
 * Supports real-time search across all 38 districts, major towns, taluks and localities
 */
export function LocationAutocomplete({
  value = '',
  onChange,
  onSelect,
  placeholder = 'Type district or town (e.g. Karaikudi, Sivagangai, Madurai)...',
  className = '',
  inputClassName = '',
  showLabel = false,
  label = 'Service Location / District *',
  autoFocus = false,
}) {
  const [query, setQuery] = useState(value || '')
  const [isOpen, setIsOpen] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const wrapperRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    setQuery(value || '')
  }, [value])

  // Filter locations as the user types
  useEffect(() => {
    if (!isOpen) return
    const results = searchLocations(query, 8)
    setSuggestions(results)
    setSelectedIndex(-1)
  }, [query, isOpen])

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleInputChange = (e) => {
    const val = e.target.value
    setQuery(val)
    if (onChange) onChange(val)
    if (!isOpen) setIsOpen(true)
  }

  const handleSelectLocation = (loc) => {
    const displayName = `${loc.name}, ${loc.district}`
    setQuery(displayName)
    setIsOpen(false)
    if (onChange) onChange(displayName)
    if (onSelect) onSelect(loc)
  }

  const handleClear = () => {
    setQuery('')
    if (onChange) onChange('')
    if (onSelect) onSelect(null)
    setIsOpen(true)
    inputRef.current?.focus()
  }

  const handleKeyDown = (e) => {
    if (!isOpen || suggestions.length === 0) {
      if (e.key === 'ArrowDown') {
        setIsOpen(true)
      }
      return
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
        handleSelectLocation(suggestions[selectedIndex])
      } else if (suggestions.length > 0) {
        handleSelectLocation(suggestions[0])
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false)
    }
  }

  return (
    <div ref={wrapperRef} className={`relative w-full ${className}`}>
      {showLabel && (
        <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-1.5">
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-red-600 pointer-events-none z-10" />
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          autoFocus={autoFocus}
          placeholder={placeholder}
          autoComplete="off"
          className={`w-full pl-10 pr-10 py-2.5 text-sm font-medium text-neutral-900 bg-white border border-neutral-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition placeholder:text-neutral-400 ${inputClassName}`}
        />

        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-700 transition"
            title="Clear location"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Dropdown Suggestions */}
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-1.5 bg-white rounded-2xl border border-neutral-200 shadow-xl overflow-hidden max-h-64 overflow-y-auto animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="p-2 border-b border-neutral-100 flex items-center justify-between text-[11px] font-semibold text-neutral-500 uppercase tracking-wider bg-neutral-50">
            <span>Locations in Tamil Nadu ({suggestions.length})</span>
            <span className="text-[10px] text-neutral-400 font-normal">30 km radius enabled</span>
          </div>

          {suggestions.length === 0 ? (
            <div className="p-4 text-center text-xs text-neutral-500">
              No Tamil Nadu location found matching "<span className="font-semibold text-neutral-800">{query}</span>".
              <p className="mt-1 text-[11px] text-neutral-400">
                Try searching Karaikudi, Sivaganga, Madurai, Chennai, Coimbatore, or your district name.
              </p>
            </div>
          ) : (
            <ul className="py-1 divide-y divide-neutral-50">
              {suggestions.map((loc, idx) => {
                const isSelected = idx === selectedIndex
                return (
                  <li
                    key={loc.id}
                    onClick={() => handleSelectLocation(loc)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`px-3.5 py-2.5 flex items-center justify-between cursor-pointer transition ${
                      isSelected ? 'bg-red-50 text-red-900' : 'hover:bg-neutral-50 text-neutral-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-red-600 text-white' : 'bg-neutral-100 text-neutral-500'
                      }`}>
                        <MapPin className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="text-sm font-bold flex items-center gap-1.5">
                          <span>{loc.name}</span>
                          {loc.nameTa && (
                            <span className="text-xs font-normal text-neutral-400">
                              ({loc.nameTa})
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-neutral-500 font-medium">
                          District: <span className="font-semibold text-neutral-700">{loc.district}</span>
                          {loc.postal && ` • PIN: ${loc.postal}`}
                        </div>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 border border-neutral-200">
                      Select
                    </span>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
