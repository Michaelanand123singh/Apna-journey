'use client'

import Link from 'next/link'
import Image from 'next/image'
import { News } from '@/types'
import { Calendar, Eye, User } from 'lucide-react'

interface NewsCardProps {
  article: News
}

export default function NewsCard({ article }: NewsCardProps) {
  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric'
    })
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      'politics': 'bg-red-50 text-red-700 border-red-200',
      'education': 'bg-blue-50 text-blue-700 border-blue-200',
      'crime': 'bg-slate-50 text-slate-700 border-slate-200',
      'sports': 'bg-green-50 text-green-700 border-green-200',
      'business': 'bg-yellow-50 text-yellow-700 border-yellow-200',
      'local-events': 'bg-purple-50 text-purple-700 border-purple-200',
      'development': 'bg-indigo-50 text-indigo-700 border-indigo-200',
      'health': 'bg-pink-50 text-pink-700 border-pink-200',
      'entertainment': 'bg-orange-50 text-orange-700 border-orange-200',
      'technology': 'bg-cyan-50 text-cyan-700 border-cyan-200',
      'environment': 'bg-teal-50 text-teal-700 border-teal-200',
      'other': 'bg-slate-50 text-slate-700 border-slate-200'
    }
    return colors[category as keyof typeof colors] || 'bg-slate-50 text-slate-700 border-slate-200'
  }

  const getLanguageColor = (language: string) => {
    return language === 'hi' 
      ? 'bg-orange-50 text-orange-700 border-orange-200' 
      : 'bg-blue-50 text-blue-700 border-blue-200'
  }

  return (
    <article className="group bg-white rounded-xl sm:rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-xl transition-all duration-300 overflow-hidden">
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Featured Image */}
          <div className="w-full sm:w-48 h-48 sm:h-40 flex-shrink-0">
            <Link href={`/news/${article.slug}`}>
              <Image
                src={article.featuredImage}
                alt={article.title}
                width={192}
                height={160}
                className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
              />
            </Link>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="mb-3 sm:mb-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getCategoryColor(article.category)}`}>
                    {article.category.replace('-', ' ').toUpperCase()}
                  </span>
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getLanguageColor(article.language)}`}>
                    {article.language.toUpperCase()}
                  </span>
                  {article.isFeatured && (
                    <span className="px-2.5 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-semibold rounded-full">
                      ⭐ FEATURED
                    </span>
                  )}
                </div>
              </div>
              
              <Link 
                href={`/news/${article.slug}`}
                className="block mb-2"
              >
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 hover:text-indigo-600 transition-colors line-clamp-2 mb-2">
                  {article.title}
                </h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed line-clamp-2">
                  {article.excerpt}
                </p>
              </Link>
            </div>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-slate-600 mb-3 sm:mb-4">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 text-slate-500 mr-2" />
                <span>{formatDate(article.publishedAt || article.createdAt)}</span>
              </div>
              <div className="flex items-center">
                <Eye className="w-4 h-4 text-slate-500 mr-2" />
                <span>{article.views} views</span>
              </div>
              {article.author && (
                <div className="flex items-center">
                  <User className="w-4 h-4 text-slate-500 mr-2" />
                  <span className="truncate">
                    {typeof article.author === 'object' ? article.author.name : article.author}
                  </span>
                </div>
              )}
            </div>

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3 sm:mb-4">
                {article.tags.slice(0, 4).map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 bg-slate-50 text-slate-700 text-xs font-medium rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
                {article.tags.length > 4 && (
                  <span className="inline-flex items-center px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-lg border border-indigo-200">
                    +{article.tags.length - 4} more
                  </span>
                )}
              </div>
            )}

            {/* Read More Button */}
            <Link
              href={`/news/${article.slug}`}
              className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-semibold text-sm sm:text-base group"
            >
              Read Full Story
              <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}
