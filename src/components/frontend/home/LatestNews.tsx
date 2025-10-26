'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Newspaper, Calendar, Eye, Tag, ArrowRight, Clock, TrendingUp } from 'lucide-react'
import { News } from '@/types'
import AdSenseRectangle from '../ads/AdSenseRectangle'

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
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Main Content - 8 columns */}
          <div className="lg:col-span-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Latest News & Updates</h2>
                <p className="text-gray-600">Stay informed with the latest developments across Bihar</p>
              </div>
              <Link
                href="/news"
                className="group bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors inline-flex items-center space-x-2"
              >
                <span>View All News</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            {news.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-lg">
                <Newspaper className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No News Available</h3>
                <p className="text-gray-600">Check back later for new articles.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {news.map((article) => (
                  <div key={article._id} className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:-translate-y-1 overflow-hidden">
                    {article.featuredImage && (
                      <div className="h-48 overflow-hidden">
                        <img
                          src={article.featuredImage}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      {/* Article Meta */}
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full">
                          {article.category}
                        </span>
                        {article.isFeatured && (
                          <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-3 py-1 rounded-full">
                            Featured
                          </span>
                        )}
                      </div>
                      
                      {/* Article Title */}
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-green-600 transition-colors">
                        {article.title}
                      </h3>
                      
                      {/* Article Excerpt */}
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {article.excerpt}
                      </p>
                      
                      {/* Article Stats */}
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            <span>{formatDate(article.publishedAt || article.createdAt)}</span>
                          </div>
                          <div className="flex items-center">
                            <Eye className="w-4 h-4 mr-1" />
                            <span>{article.views} views</span>
                          </div>
                        </div>
                        <div className="flex items-center text-green-600">
                          <TrendingUp className="w-4 h-4 mr-1" />
                          <span className="text-xs">Trending</span>
                        </div>
                      </div>
                      
                      {/* Tags */}
                      {article.tags && article.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {article.tags.slice(0, 3).map((tag, index) => (
                            <span
                              key={index}
                              className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full"
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
                      
                      {/* Read More Link */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-xs text-gray-500">2 min read</span>
                        </div>
                        <Link
                          href={`/news/${article.slug}`}
                          className="text-green-600 hover:text-green-700 text-sm font-medium group-hover:underline"
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

          {/* Sidebar - 4 columns */}
          <div className="lg:col-span-4 space-y-6">
            {/* AdSense Rectangle */}
            <AdSenseRectangle 
              slot="1234567894" 
              className="w-full h-64"
              placeholder="News Sidebar Ad"
            />

            {/* News Categories */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">News Categories</h3>
              <div className="space-y-3">
                {[
                  { name: 'Government Updates', count: '45', color: 'bg-blue-100 text-blue-600' },
                  { name: 'Job Results', count: '32', color: 'bg-green-100 text-green-600' },
                  { name: 'Education News', count: '28', color: 'bg-purple-100 text-purple-600' },
                  { name: 'Health Updates', count: '15', color: 'bg-red-100 text-red-600' },
                  { name: 'Sports News', count: '12', color: 'bg-orange-100 text-orange-600' },
                  { name: 'Technology', count: '8', color: 'bg-indigo-100 text-indigo-600' }
                ].map((category, index) => (
                  <Link
                    key={index}
                    href={`/news?category=${category.name.toLowerCase().replace(' ', '-')}`}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-sm text-gray-700">{category.name}</span>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${category.color}`}>
                      {category.count}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Trending Topics */}
            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-orange-600" />
                Trending Topics
              </h3>
              <div className="space-y-3">
                {[
                  'Bihar Police Recruitment 2024',
                  'BPSC Exam Results',
                  'Bihar Education Policy',
                  'Patna Metro Updates',
                  'Bihar Budget 2024'
                ].map((topic, index) => (
                  <div key={index} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/50 transition-colors cursor-pointer">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-sm text-gray-700 line-clamp-1">{topic}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Stay Updated</h3>
              <p className="text-sm text-gray-600 mb-4">
                Get the latest news and job updates delivered to your inbox.
              </p>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm">
                  Subscribe Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
