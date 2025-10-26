'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { NEWS_CATEGORIES } from '@/lib/constants/categories'

function CategoryNavContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || '')

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

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
      <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">News Categories</h3>
      <div className="flex flex-wrap gap-1.5 sm:gap-2">
        <button
          onClick={() => handleCategoryChange('')}
          className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors ${
            activeCategory === ''
              ? 'bg-primary-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All News
        </button>
        {NEWS_CATEGORIES.map((category) => (
          <button
            key={category.value}
            onClick={() => handleCategoryChange(category.value)}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors ${
              activeCategory === category.value
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function CategoryNav() {
  return (
    <Suspense fallback={
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="h-6 bg-gray-200 rounded w-32 mb-4 animate-pulse"></div>
        <div className="flex flex-wrap gap-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-8 bg-gray-200 rounded-full w-20 animate-pulse"></div>
          ))}
        </div>
      </div>
    }>
      <CategoryNavContent />
    </Suspense>
  )
}
