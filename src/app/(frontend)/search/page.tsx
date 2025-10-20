'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { 
  Search, 
  Briefcase, 
  Newspaper, 
  MapPin, 
  Calendar,
  Building,
  Clock,
  Tag
} from 'lucide-react'

interface Job {
  _id: string
  title: string
  company: string
  salary?: string
  jobType: string
  location: string
  createdAt: string
  slug: string
}

interface News {
  _id: string
  title: string
  excerpt: string
  slug: string
  publishedAt: string
  category: string
}

interface SearchResults {
  jobs: Job[]
  news: News[]
  total: number
}

function SearchPageContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const [results, setResults] = useState<SearchResults>({ jobs: [], news: [], total: 0 })
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState(query)

  useEffect(() => {
    if (query) {
      performSearch(query)
    } else {
      setLoading(false)
    }
  }, [query])

  const performSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setResults({ jobs: [], news: [], total: 0 })
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchTerm)}&type=all&limit=20`)
      const data = await response.json()
      
      if (data.success) {
        setResults(data.data)
      }
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getJobTypeColor = (jobType: string) => {
    const colors: { [key: string]: string } = {
      'full-time': 'bg-green-100 text-green-800',
      'part-time': 'bg-blue-100 text-blue-800',
      'contract': 'bg-purple-100 text-purple-800',
      'internship': 'bg-orange-100 text-orange-800'
    }
    return colors[jobType] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Search Results
          </h1>
          
          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-2xl">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search jobs, news, companies..."
                className="w-full pl-10 pr-4 py-3 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </form>
        </div>

        {loading ? (
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6 animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : results.total === 0 ? (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No results found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try searching with different keywords or check your spelling.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Jobs Results */}
            {results.jobs.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Briefcase className="w-6 h-6 mr-2 text-primary-600" />
                  Jobs ({results.jobs.length})
                </h2>
                <div className="space-y-4">
                  {results.jobs.map((job) => (
                    <Link
                      key={job._id}
                      href={`/jobs/${job.slug}`}
                      className="block bg-white dark:bg-gray-800 rounded-lg p-6 hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            {job.title}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                            <div className="flex items-center">
                              <Building className="w-4 h-4 mr-1" />
                              {job.company}
                            </div>
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {job.location}
                            </div>
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {formatDate(job.createdAt)}
                            </div>
                          </div>
                          {job.salary && (
                            <p className="text-primary-600 dark:text-primary-400 font-medium">
                              {job.salary}
                            </p>
                          )}
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getJobTypeColor(job.jobType)}`}>
                          {job.jobType.replace('-', ' ')}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* News Results */}
            {results.news.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Newspaper className="w-6 h-6 mr-2 text-primary-600" />
                  News ({results.news.length})
                </h2>
                <div className="space-y-4">
                  {results.news.map((news) => (
                    <Link
                      key={news._id}
                      href={`/news/${news.slug}`}
                      className="block bg-white dark:bg-gray-800 rounded-lg p-6 hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            {news.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                            {news.excerpt}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {formatDate(news.publishedAt)}
                            </div>
                            <div className="flex items-center">
                              <Tag className="w-4 h-4 mr-1" />
                              {news.category}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  )
}
