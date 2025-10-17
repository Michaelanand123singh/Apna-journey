'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { JOB_CATEGORIES, JOB_TYPES } from '@/lib/constants/categories'
import { GAYA_LOCATIONS } from '@/lib/constants/locations'

function JobFiltersContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    jobType: searchParams.get('jobType') || '',
    location: searchParams.get('location') || ''
  })

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    
    // Update URL with new filters
    const params = new URLSearchParams()
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) params.set(k, v)
    })
    
    router.push(`/jobs?${params.toString()}`)
  }

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      jobType: '',
      location: ''
    })
    router.push('/jobs')
  }

  const hasActiveFilters = Object.values(filters).some(value => value !== '')

  return (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Search Jobs
        </label>
        <input
          type="text"
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          placeholder="Job title, company, skills..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category
        </label>
        <select
          value={filters.category}
          onChange={(e) => handleFilterChange('category', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="">All Categories</option>
          {JOB_CATEGORIES.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
      </div>

      {/* Job Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Job Type
        </label>
        <select
          value={filters.jobType}
          onChange={(e) => handleFilterChange('jobType', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="">All Types</option>
          {JOB_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Location
        </label>
        <select
          value={filters.location}
          onChange={(e) => handleFilterChange('location', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="">All Locations</option>
          {GAYA_LOCATIONS.map((location) => (
            <option key={location.value} value={location.value}>
              {location.label}
            </option>
          ))}
        </select>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors"
        >
          Clear All Filters
        </button>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Active Filters:</h4>
          <div className="flex flex-wrap gap-2">
            {filters.search && (
              <span className="inline-flex items-center px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full">
                Search: {filters.search}
                <button
                  onClick={() => handleFilterChange('search', '')}
                  className="ml-1 text-primary-600 hover:text-primary-800"
                >
                  ×
                </button>
              </span>
            )}
            {filters.category && (
              <span className="inline-flex items-center px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full">
                {JOB_CATEGORIES.find(c => c.value === filters.category)?.label}
                <button
                  onClick={() => handleFilterChange('category', '')}
                  className="ml-1 text-primary-600 hover:text-primary-800"
                >
                  ×
                </button>
              </span>
            )}
            {filters.jobType && (
              <span className="inline-flex items-center px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full">
                {JOB_TYPES.find(t => t.value === filters.jobType)?.label}
                <button
                  onClick={() => handleFilterChange('jobType', '')}
                  className="ml-1 text-primary-600 hover:text-primary-800"
                >
                  ×
                </button>
              </span>
            )}
            {filters.location && (
              <span className="inline-flex items-center px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full">
                {GAYA_LOCATIONS.find(l => l.value === filters.location)?.label}
                <button
                  onClick={() => handleFilterChange('location', '')}
                  className="ml-1 text-primary-600 hover:text-primary-800"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default function JobFilters() {
  return (
    <Suspense fallback={
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-16 mb-2"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    }>
      <JobFiltersContent />
    </Suspense>
  )
}
