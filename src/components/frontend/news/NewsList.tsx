'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import NewsCard from './NewsCard'
import { News } from '@/types'
import { ListLoader } from '@/components/shared/PageLoader'
import LoadingButton from '@/components/shared/LoadingButton'

interface NewsListContentProps {
  category?: string
}

function NewsListContent({ category }: NewsListContentProps) {
  const [news, setNews] = useState<News[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  })

  const searchParams = useSearchParams()

  useEffect(() => {
    fetchNews()
  }, [searchParams])

  const fetchNews = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      searchParams.forEach((value, key) => {
        params.append(key, value)
      })

      // Add category if provided as prop
      if (category) {
        params.set('category', category)
      }

      const response = await fetch(`/api/news?${params.toString()}`)
      const data = await response.json()

      if (data.success) {
        setNews(data.data)
        setPagination(data.pagination)
      } else {
        setError(data.message || 'Failed to fetch news')
      }
    } catch (err) {
      setError('Failed to fetch news')
      console.error('Error fetching news:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <ListLoader items={6} />
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <div className="text-red-500 mb-4">
          <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Error Loading News</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={fetchNews}
          className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (news.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <div className="text-gray-400 mb-4">
          <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">No News Found</h3>
        <p className="text-gray-600 mb-4">
          We couldn't find any news articles matching your criteria. Try adjusting your filters.
        </p>
        <button
          onClick={() => window.location.href = '/news'}
          className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
        >
          View All News
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <p className="text-gray-600">
          Showing {news.length} of {pagination.total} articles
        </p>
        <div className="text-sm text-gray-500">
          Page {pagination.page} of {pagination.pages}
        </div>
      </div>

      <div className="space-y-6">
        {news.map((article) => (
          <NewsCard key={article._id} article={article} />
        ))}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="mt-8 flex justify-center">
          <div className="flex space-x-2">
            {pagination.page > 1 && (
              <button
                onClick={() => {
                  const params = new URLSearchParams(searchParams)
                  params.set('page', (pagination.page - 1).toString())
                  window.location.href = `/news?${params.toString()}`
                }}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Previous
              </button>
            )}
            
            {[...Array(pagination.pages)].map((_, i) => {
              const page = i + 1
              const isCurrentPage = page === pagination.page
              
              return (
                <button
                  key={page}
                  onClick={() => {
                    const params = new URLSearchParams(searchParams)
                    params.set('page', page.toString())
                    window.location.href = `/news?${params.toString()}`
                  }}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    isCurrentPage
                      ? 'bg-primary-500 text-white'
                      : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              )
            })}
            
            {pagination.page < pagination.pages && (
              <button
                onClick={() => {
                  const params = new URLSearchParams(searchParams)
                  params.set('page', (pagination.page + 1).toString())
                  window.location.href = `/news?${params.toString()}`
                }}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Next
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

interface NewsListProps {
  category?: string
}

export default function NewsList({ category }: NewsListProps) {
  return (
    <Suspense fallback={
      <div className="space-y-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
            <div className="flex gap-4">
              <div className="w-32 h-24 bg-gray-200 rounded"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    }>
      <NewsListContent category={category} />
    </Suspense>
  )
}
