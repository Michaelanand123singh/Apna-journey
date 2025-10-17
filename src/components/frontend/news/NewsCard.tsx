'use client'

import Link from 'next/link'
import Image from 'next/image'
import { News } from '@/types'
import { Calendar, Eye, Tag, Globe } from 'lucide-react'

interface NewsCardProps {
  article: News
}

export default function NewsCard({ article }: NewsCardProps) {
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
      'education': 'bg-blue-100 text-blue-800',
      'crime': 'bg-gray-100 text-gray-800',
      'sports': 'bg-green-100 text-green-800',
      'business': 'bg-yellow-100 text-yellow-800',
      'local-events': 'bg-purple-100 text-purple-800',
      'development': 'bg-indigo-100 text-indigo-800',
      'health': 'bg-pink-100 text-pink-800',
      'entertainment': 'bg-orange-100 text-orange-800',
      'technology': 'bg-cyan-100 text-cyan-800',
      'environment': 'bg-teal-100 text-teal-800',
      'other': 'bg-gray-100 text-gray-800'
    }
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getLanguageColor = (language: string) => {
    return language === 'hindi' 
      ? 'bg-orange-100 text-orange-800' 
      : 'bg-blue-100 text-blue-800'
  }

  return (
    <article className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex gap-4">
          {/* Featured Image */}
          <div className="w-32 h-24 flex-shrink-0">
            <Image
              src={article.featuredImage}
              alt={article.title}
              width={128}
              height={96}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <Link 
                  href={`/news/${article.slug}`}
                  className="text-lg font-semibold text-gray-800 hover:text-primary-500 transition-colors line-clamp-2"
                >
                  {article.title}
                </Link>
                <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                  {article.excerpt}
                </p>
              </div>
              <div className="flex flex-col items-end space-y-1 ml-4">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(article.category)}`}>
                  {article.category.replace('-', ' ').toUpperCase()}
                </span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getLanguageColor(article.language)}`}>
                  {article.language.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-3">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                <span>{formatDate(article.publishedAt || article.createdAt)}</span>
              </div>
              <div className="flex items-center">
                <Eye className="w-4 h-4 mr-1" />
                <span>{article.views} views</span>
              </div>
              {article.author && (
                <div className="flex items-center">
                  <span>
                    By {((article as any)?.author?.name as string) ?? (article.author as string)}
                  </span>
                </div>
              )}
            </div>

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {article.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </span>
                ))}
                {article.tags.length > 3 && (
                  <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                    +{article.tags.length - 3} more
                  </span>
                )}
              </div>
            )}

            {/* Language Indicator */}
            <div className="flex items-center text-sm text-gray-500">
              <Globe className="w-4 h-4 mr-1" />
              <span>
                {article.language === 'hindi' ? 'हिंदी में पढ़ें' : 'Read in English'}
              </span>
            </div>
          </div>
        </div>

        {/* Featured Badge */}
        {article.isFeatured && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <span className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
              ⭐ Featured Article
            </span>
          </div>
        )}
      </div>
    </article>
  )
}
