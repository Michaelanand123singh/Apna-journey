'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Newspaper, Calendar, Eye, Tag, ArrowRight, Clock, TrendingUp } from 'lucide-react'
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
      
      const response = await fetch('/api/news?limit=6&status=published', {
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
    <section className="py-12 sm:py-16 bg-white relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <div className="flex-1">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Latest News & Updates</h2>
            <p className="text-sm sm:text-base text-gray-600">Stay informed with the latest developments across Bihar</p>
          </div>
          <Link
            href="/news"
            className="group bg-green-600 text-white px-4 py-2.5 sm:px-6 sm:py-3 rounded-lg font-medium hover:bg-green-700 transition-colors inline-flex items-center justify-center space-x-2 text-sm sm:text-base"
          >
            <span>View All News</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        
        {news.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-lg">
            <Newspaper className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">No News Available</h3>
            <p className="text-sm sm:text-base text-gray-600">Check back later for new articles.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {news.map((article) => (
              <div key={article._id} className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:-translate-y-1 overflow-hidden">
                {article.featuredImage && (
                  <div className="h-40 sm:h-48 overflow-hidden">
                    <img
                      src={article.featuredImage}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-4 sm:p-6">
                  {/* Article Meta */}
                  <div className="flex items-center flex-wrap gap-2 mb-3">
                    <span className="bg-green-100 text-green-800 text-[10px] sm:text-xs font-medium px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
                      {article.category}
                    </span>
                    {article.isFeatured && (
                      <span className="bg-yellow-100 text-yellow-800 text-[10px] sm:text-xs font-medium px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
                        Featured
                      </span>
                    )}
                  </div>
                  
                  {/* Article Title */}
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 line-clamp-2 group-hover:text-green-600 transition-colors">
                    {article.title}
                  </h3>
                  
                  {/* Article Excerpt */}
                  <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>
                  
                  {/* Article Stats */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
                    <div className="flex items-center flex-wrap gap-x-3 sm:gap-x-4">
                      <div className="flex items-center">
                        <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                        <span className="text-xs sm:text-sm">{formatDate(article.publishedAt || article.createdAt)}</span>
                      </div>
                      <div className="flex items-center">
                        <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                        <span className="text-xs sm:text-sm">{article.views} views</span>
                      </div>
                    </div>
                    <div className="flex items-center text-green-600">
                      <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" />
                      <span className="text-[10px] sm:text-xs">Trending</span>
                    </div>
                  </div>
                  
                  {/* Tags */}
                  {article.tags && article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                      {article.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-600 text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {article.tags.length > 3 && (
                        <span className="text-gray-500 text-[10px] sm:text-xs">
                          +{article.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                  
                  {/* Read More Link */}
                  <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-1.5 sm:space-x-2">
                      <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
                      <span className="text-[10px] sm:text-xs text-gray-500">2 min read</span>
                    </div>
                    <Link
                      href={`/news/${article.slug}`}
                      className="text-green-600 hover:text-green-700 text-xs sm:text-sm font-medium group-hover:underline"
                    >
                      Read More →
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
