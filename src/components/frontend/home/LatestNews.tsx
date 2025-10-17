'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Newspaper, Calendar, Eye, Tag } from 'lucide-react'
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
      const response = await fetch('/api/news?limit=6&status=published')
      const data = await response.json()
      
      if (data.success) {
        setNews(data.data)
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
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow">
                  <div className="h-48 bg-gray-200 rounded mb-4"></div>
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
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Latest News</h2>
          <Link
            href="/news"
            className="text-primary-500 hover:text-primary-600 font-medium flex items-center"
          >
            View All News
            <Newspaper className="ml-2 w-4 h-4" />
          </Link>
        </div>
        
        {news.length === 0 ? (
          <div className="text-center py-12">
            <Newspaper className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No News Available</h3>
            <p className="text-gray-600">Check back later for new articles.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((article) => (
              <div key={article._id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden">
                {article.featuredImage && (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={article.featuredImage}
                      alt={article.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2 py-1 rounded-full">
                      {article.category}
                    </span>
                    <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded-full">
                      {article.language}
                    </span>
                    {article.isFeatured && (
                      <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full">
                        Featured
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {article.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{formatDate(article.publishedAt || article.createdAt)}</span>
                    </div>
                    <div className="flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      <span>{article.views} views</span>
                    </div>
                  </div>
                  
                  {article.tags && article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {article.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                      {article.tags.length > 3 && (
                        <span className="text-gray-500 text-xs">
                          +{article.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                  
                  <Link
                    href={`/news/${article.slug}`}
                    className="text-primary-500 hover:text-primary-600 text-sm font-medium"
                  >
                    Read More →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
