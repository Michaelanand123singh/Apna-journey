'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Search, Briefcase, Newspaper, X } from 'lucide-react'

interface SearchResult {
  jobs: Array<{
    _id: string
    title: string
    company: string
    slug: string
  }>
  news: Array<{
    _id: string
    title: string
    slug: string
  }>
}

interface SearchSuggestionsProps {
  query: string
  isVisible: boolean
  onClose: () => void
}

export default function SearchSuggestions({ query, isVisible, onClose }: SearchSuggestionsProps) {
  const [results, setResults] = useState<SearchResult>({ jobs: [], news: [] })
  const [loading, setLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (query.length >= 2) {
      setLoading(true)
      setShowSuggestions(true)
      
      const timeoutId = setTimeout(async () => {
        try {
          const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&type=all&limit=5`, {
            headers: {
              'Content-Type': 'application/json',
            },
            cache: 'no-store'
          })
          
          if (!response.ok) {
            console.error(`Search failed: ${response.status} ${response.statusText}`)
            return
          }
          
          const data = await response.json()
          
          if (data.success) {
            setResults(data.data)
          } else {
            console.error('Search API returned error:', data.message)
          }
        } catch (error) {
          console.error('Search suggestions error:', error)
        } finally {
          setLoading(false)
        }
      }, 300) // Debounce search

      return () => clearTimeout(timeoutId)
    } else {
      setShowSuggestions(false)
      setResults({ jobs: [], news: [] })
    }
  }, [query])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isVisible, onClose])

  if (!isVisible || !showSuggestions) {
    return null
  }

  const totalResults = results.jobs.length + results.news.length

  return (
    <div 
      ref={suggestionsRef}
      className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 max-h-96 overflow-y-auto"
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
            Search Results
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-1"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : totalResults === 0 ? (
          <div className="text-center py-4">
            <Search className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No results found for "{query}"
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Jobs */}
            {results.jobs.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 flex items-center">
                  <Briefcase className="w-3 h-3 mr-1" />
                  Jobs
                </h4>
                <div className="space-y-2">
                  {results.jobs.map((job) => (
                    <Link
                      key={job._id}
                      href={`/jobs/${job.slug}`}
                      className="block p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      onClick={onClose}
                    >
                      <div className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">
                        {job.title}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {job.company}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* News */}
            {results.news.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 flex items-center">
                  <Newspaper className="w-3 h-3 mr-1" />
                  News
                </h4>
                <div className="space-y-2">
                  {results.news.map((news) => (
                    <Link
                      key={news._id}
                      href={`/news/${news.slug}`}
                      className="block p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      onClick={onClose}
                    >
                      <div className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">
                        {news.title}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* View All Results */}
            <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
              <Link
                href={`/search?q=${encodeURIComponent(query)}`}
                className="block w-full text-center py-2 text-sm text-primary-600 dark:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                onClick={onClose}
              >
                View all results ({totalResults})
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
