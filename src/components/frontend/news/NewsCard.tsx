'use client'

import Link from 'next/link'
import Image from 'next/image'
import { News } from '@/types'
import { Calendar, Eye, Tag, Globe, Clock, User } from 'lucide-react'

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
    <article className="group bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="p-6">
        <div className="flex gap-4">
          {/* Featured Image */}
          <div className="w-24 h-20 flex-shrink-0">
            <Image
              src={article.featuredImage}
              alt={article.title}
              width={96}
              height={80}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <Link 
                  href={`/news/${article.slug}`}
                  className="text-base font-semibold text-slate-900 hover:text-indigo-600 transition-colors line-clamp-2"
                >
                  {article.title}
                </Link>
                <p className="text-slate-600 text-sm mt-1 line-clamp-2">
                  {article.excerpt}
                </p>
              </div>
              <div className="flex flex-col items-end space-y-2 ml-3">
                <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${getCategoryColor(article.category)}`}>
                  {article.category.replace('-', ' ')}
                </span>
                <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${getLanguageColor(article.language)}`}>
                  {article.language}
                </span>
              </div>
            </div>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mb-3">
              <div className="flex items-center">
                <div className="p-1 bg-slate-100 rounded-lg mr-2">
                  <Calendar className="w-3 h-3 text-slate-600" />
                </div>
                <span>{formatDate(article.publishedAt || article.createdAt)}</span>
              </div>
              <div className="flex items-center">
                <div className="p-1 bg-blue-100 rounded-lg mr-2">
                  <Eye className="w-3 h-3 text-blue-600" />
                </div>
                <span>{article.views}</span>
              </div>
              {article.author && (
                <div className="flex items-center">
                  <div className="p-1 bg-purple-100 rounded-lg mr-2">
                    <User className="w-3 h-3 text-purple-600" />
                  </div>
                  <span className="truncate">
                    {typeof article.author === 'object' ? article.author.name : article.author}
                  </span>
                </div>
              )}
            </div>

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {article.tags.slice(0, 2).map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-1 bg-slate-50 text-slate-700 text-xs rounded-lg font-medium border border-slate-200"
                  >
                    <Tag className="w-3 h-3 mr-1.5 text-slate-500" />
                    {tag}
                  </span>
                ))}
                {article.tags.length > 2 && (
                  <span className="inline-flex items-center px-2.5 py-1 bg-slate-50 text-slate-700 text-xs rounded-lg font-medium border border-slate-200">
                    +{article.tags.length - 2}
                  </span>
                )}
              </div>
            )}

            {/* Featured Badge */}
            {article.isFeatured && (
              <div className="flex items-center">
                <span className="inline-flex items-center px-2.5 py-1 bg-gradient-to-r from-yellow-50 to-orange-50 text-yellow-700 text-xs font-medium rounded-lg border border-yellow-200">
                  ⭐ Featured Story
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}
