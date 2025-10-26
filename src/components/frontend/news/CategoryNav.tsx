'use client'

import React, { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { NEWS_CATEGORIES } from '@/lib/constants/categories'
import { 
  FolderOpen, 
  Landmark, 
  School, 
  Shield, 
  Trophy, 
  TrendingUp, 
  MapPin, 
  TrendingDown, 
  Heart, 
  Film, 
  Laptop, 
  Leaf, 
  Grid3x3
} from 'lucide-react'

// Category icons mapping
const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'politics': Landmark,
  'education': School,
  'crime': Shield,
  'sports': Trophy,
  'business': TrendingUp,
  'local-events': MapPin,
  'development': TrendingDown,
  'health': Heart,
  'entertainment': Film,
  'technology': Laptop,
  'environment': Leaf,
  'other': Grid3x3,
  '': FolderOpen
}

function CategoryNavContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || '')
  const [showAll, setShowAll] = useState(false)

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category)
    
    const params = new URLSearchParams(searchParams)
    if (category) {
      params.set('category', category)
    } else {
      params.delete('category')
    }
    params.delete('page') // Reset to first page when changing category
    
    router.push(`/news?${params.toString()}`)
  }

  // Popular categories to show initially
  const popularCategories = [
    { value: '', label: 'All News' },
    { value: 'politics', label: 'Politics' },
    { value: 'business', label: 'Business' },
    { value: 'education', label: 'Education' },
    { value: 'technology', label: 'Technology' },
    { value: 'health', label: 'Health' },
  ]

  const allCategories = [
    { value: '', label: 'All News' },
    ...NEWS_CATEGORIES
  ]

  const categoriesToShow = showAll ? allCategories : popularCategories
  const hasMore = !showAll

  return (
    <div className="space-y-3">
      <div className="text-xs sm:text-sm text-gray-500">Select a category to explore</div>
      <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
        {categoriesToShow.map((category) => {
          const IconComponent = categoryIcons[category.value] || FolderOpen
          const isActive = activeCategory === category.value
          
          return (
            <button
              key={category.value}
              onClick={() => handleCategoryChange(category.value)}
              className={`group relative p-3 sm:p-4 rounded-xl transition-all duration-200 hover:scale-105 ${
                isActive
                  ? 'bg-gradient-to-br from-green-600 to-emerald-600 text-white shadow-lg shadow-green-500/30'
                  : 'bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 text-slate-700 hover:border-green-300 hover:shadow-md'
              }`}
            >
              <div className="flex flex-col items-center space-y-2">
                <IconComponent className={`w-5 h-5 sm:w-6 sm:h-6 ${
                  isActive ? 'text-white' : 'text-slate-600 group-hover:text-green-600'
                }`} />
                <span className={`text-[10px] sm:text-xs font-medium text-center leading-tight ${
                  isActive ? 'text-white' : 'text-slate-700 group-hover:text-green-600'
                }`}>
                  {category.label}
                </span>
              </div>
              {isActive && (
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent pointer-events-none"></div>
              )}
            </button>
          )
        })}
      </div>
      
      {hasMore && (
        <button
          onClick={() => setShowAll(true)}
          className="w-full mt-2 py-2.5 px-4 bg-gradient-to-r from-slate-100 to-slate-50 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:from-slate-200 hover:to-slate-100 hover:border-slate-400 transition-all duration-200"
        >
          Show All Categories (+{allCategories.length - popularCategories.length})
        </button>
      )}
      
      {showAll && (
        <button
          onClick={() => setShowAll(false)}
          className="w-full mt-2 py-2.5 px-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-300 rounded-lg text-sm font-medium text-green-700 hover:from-green-100 hover:to-emerald-100 transition-all duration-200"
        >
          Show Less
        </button>
      )}
    </div>
  )
}

export default function CategoryNav() {
  return (
    <Suspense fallback={
      <div className="space-y-1">
        <div className="h-4 bg-gray-200 rounded w-40 mb-3 animate-pulse"></div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3">
          {[...Array(13)].map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-xl p-4 space-y-2 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-6 mx-auto"></div>
              <div className="h-3 bg-gray-200 rounded w-12 mx-auto"></div>
            </div>
          ))}
        </div>
      </div>
    }>
      <CategoryNavContent />
    </Suspense>
  )
}
