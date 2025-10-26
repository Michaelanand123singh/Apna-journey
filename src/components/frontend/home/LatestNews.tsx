'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Newspaper, Calendar, Eye, ArrowRight } from 'lucide-react'
import { News } from '@/types'

export default function LatestNews() {
  const [news, setNews] = useState<News[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLatestNews()
  }, [])

  const fetchLatestNews = async () => {
    try {
      setLoading(true)
      console.log('Fetching latest news...')
      
      const response = await fetch('/api/news?limit=9&status=published', {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
        cache: 'no-store'
      })
      
      console.log('Response status:', response.status)
      
      if (!response.ok) {
        console.error(`Failed to fetch news: ${response.status} ${response.statusText}`)
        return
      }
      
      const data = await response.json()
      console.log('News data received:', data)
      
      if (data.success) {
        console.log('Setting news data:', data.data)
        setNews(data.data)
      } else {
        console.error('API returned error:', data.message)
      }
    } catch (error) {
      console.error('Error fetching latest news:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <section className="py-12 sm:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-6 sm:h-8 bg-gray-200 rounded w-1/3 sm:w-1/4 mb-8"></div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white p-4 sm:p-6 rounded-lg shadow">
                  <div className="h-40 sm:h-48 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-8 sm:py-12 bg-white relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
          <div className="flex-1">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Latest News & Updates</h2>
            <p className="text-xs sm:text-sm text-gray-600">Stay informed across Bihar</p>
          </div>
          <Link
            href="/news"
            className="group bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors inline-flex items-center justify-center space-x-1.5 text-sm"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
        
        {news.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-lg">
            <Newspaper className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">No News Available</h3>
            <p className="text-sm sm:text-base text-gray-600">Check back later for new articles.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {news.map((article) => (
              <div key={article._id} className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 overflow-hidden">
                {article.featuredImage && (
                  <div className="h-32 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={article.featuredImage}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-3">
                  {/* Article Meta */}
                  <div className="flex items-center flex-wrap gap-1.5 mb-2">
                    <span className="bg-green-100 text-green-800 text-[9px] font-medium px-2 py-0.5 rounded-full">
                      {article.category}
                    </span>
                    {article.isFeatured && (
                      <span className="bg-yellow-100 text-yellow-800 text-[9px] font-medium px-2 py-0.5 rounded-full">
                        Featured
                      </span>
                    )}
                  </div>
                  
                  {/* Article Title */}
                  <h3 className="text-sm font-semibold text-gray-900 mb-1.5 line-clamp-2 group-hover:text-green-600 transition-colors">
                    {article.title}
                  </h3>
                  
                  {/* Article Excerpt */}
                  <p className="text-gray-600 text-xs mb-2.5 line-clamp-2">
                    {article.excerpt}
                  </p>
                  
                  {/* Article Stats */}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-2.5">
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-0.5 flex-shrink-0" />
                        <span className="text-[10px]">{formatDate(article.publishedAt || article.createdAt)}</span>
                      </div>
                      <div className="flex items-center">
                        <Eye className="w-3 h-3 mr-0.5 flex-shrink-0" />
                        <span className="text-[10px]">{article.views}</span>
                      </div>
                    </div>
                  
                    <Link
                      href={`/news/${article.slug}`}
                      className="text-green-600 hover:text-green-700 text-[10px] font-medium"
                    >
                      Read →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
