'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { News } from '@/types'
import { Calendar, Eye, Star } from 'lucide-react'

export default function FeaturedNews() {
  const [featuredNews, setFeaturedNews] = useState<News[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeaturedNews()
  }, [])

  const fetchFeaturedNews = async () => {
    try {
      setLoading(true)
      console.log('FeaturedNews: Fetching featured news...')
      
      const response = await fetch('/api/news?featured=true&limit=2', {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
        cache: 'no-store'
      })
      
      console.log('FeaturedNews: Response status:', response.status)
      
      if (!response.ok) {
        console.error(`Failed to fetch featured news: ${response.status} ${response.statusText}`)
        return
      }

      const data = await response.json()
      console.log('FeaturedNews: Data received:', data)

      if (data.success) {
        console.log('FeaturedNews: Setting featured news data:', data.data)
        setFeaturedNews(data.data)
      } else {
        console.error('API returned error:', data.message)
      }
    } catch (error) {
      console.error('Error fetching featured news:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      'politics': 'bg-red-100 text-red-800',
      'education': 'bg-emerald-100 text-emerald-800',
      'crime': 'bg-gray-100 text-gray-800',
      'sports': 'bg-green-100 text-green-800',
      'business': 'bg-yellow-100 text-yellow-800',
      'local-events': 'bg-teal-100 text-teal-800',
      'development': 'bg-green-100 text-green-800',
      'health': 'bg-pink-100 text-pink-800',
      'entertainment': 'bg-orange-100 text-orange-800',
      'technology': 'bg-cyan-100 text-cyan-800',
      'environment': 'bg-teal-100 text-teal-800',
      'other': 'bg-gray-100 text-gray-800'
    }
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <div className="grid md:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
            <div className="h-48 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    )
  }

  if (featuredNews.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <div className="text-gray-400 mb-4">
          <Star className="w-12 h-12 mx-auto" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">No Featured News</h3>
        <p className="text-gray-600">Check back later for featured articles.</p>
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {featuredNews.map((article) => (
        <article key={article._id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <Link href={`/news/${article.slug}`}>
            <div className="relative">
              <Image
                src={article.featuredImage}
                alt={article.title}
                width={400}
                height={200}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="absolute top-4 left-4">
                <span className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                  <Star className="w-3 h-3 mr-1" />
                  Featured
                </span>
              </div>
              <div className="absolute top-4 right-4">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(article.category)}`}>
                  {article.category.replace('-', ' ').toUpperCase()}
                </span>
              </div>
            </div>
          </Link>
          
          <div className="p-6">
            <Link href={`/news/${article.slug}`}>
              <h3 className="text-xl font-semibold text-gray-800 hover:text-green-600 transition-colors mb-2 line-clamp-2">
                {article.title}
              </h3>
            </Link>
            
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
              {article.excerpt}
            </p>
            
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>{formatDate(article.publishedAt || article.createdAt)}</span>
                </div>
                <div className="flex items-center">
                  <Eye className="w-4 h-4 mr-1" />
                  <span>{article.views}</span>
                </div>
              </div>
              <Link
                href={`/news/${article.slug}`}
                className="text-green-600 hover:text-green-700 font-medium"
              >
                Read More →
              </Link>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}
