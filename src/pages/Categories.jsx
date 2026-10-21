import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { CategoryCard } from '@/components/common/CategoryCard'
import { getCategories } from '@/services/businessService'
import { useLanguage } from '@/context/LanguageContext'
import { PageTransition } from '@/components/common/PageTransition'

export function Categories() {
  const { t, language } = useLanguage()
  const [categories, setCategories] = useState([])
  const [filterQuery, setFilterQuery] = useState('')

  useEffect(() => {
    async function load() {
      const data = await getCategories()
      setCategories(data)
    }
    load()
  }, [])

  const filtered = categories.filter(c => {
    const q = filterQuery.toLowerCase()
    return (
      c.name.toLowerCase().includes(q) ||
      (c.name_ta && c.name_ta.toLowerCase().includes(q)) ||
      (c.description && c.description.toLowerCase().includes(q))
    )
  })

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Header & Filter */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-200 pb-8">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-red-600">
              Directory Catalog
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-black tracking-tight mt-1">
              All 20 Service Categories
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1 max-w-xl font-medium">
              Browse our full taxonomy of local services across Tamil Nadu. Every category features verified local professionals in all 38 districts.
            </p>
          </div>

          {/* Category search filter */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Filter categories..."
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs font-semibold focus:border-red-600 outline-none"
            />
          </div>
        </div>

        {/* Grid of all 20 categories with staggered hover motion */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.map((cat, idx) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: idx * 0.025 }}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <CategoryCard category={cat} />
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-neutral-500 text-xs">
            No categories match "{filterQuery}". Try a broader term.
          </div>
        )}
      </div>
    </PageTransition>
  )
}
