'use client'

import Image from 'next/image'
import { News } from '@/types'
import { 
  Calendar, 
  Eye, 
  Tag, 
  Globe, 
  User, 
  Star,
  Share2,
  Facebook,
  Twitter,
  MessageCircle
} from 'lucide-react'

interface NewsArticleProps {
  article: News
}

export default function NewsArticle({ article }: NewsArticleProps) {
  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
    return language === 'hi' 
      ? 'bg-orange-100 text-orange-800' 
      : 'bg-blue-100 text-blue-800'
  }

  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
  const shareText = `${article.title} - Apna Journey`

  return (
    <div className="max-w-4xl mx-auto">
      <article className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Featured Image */}
        <div className="relative">
          <Image
            src={article.featuredImage}
            alt={article.title}
            width={800}
            height={400}
            className="w-full h-64 md:h-96 object-cover"
          />
          {article.isFeatured && (
            <div className="absolute top-4 left-4">
              <span className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
                <Star className="w-4 h-4 mr-1" />
                Featured Article
              </span>
            </div>
          )}
        </div>

        <div className="p-8">
          {/* Header */}
          <div className="mb-6">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${getCategoryColor(article.category)}`}>
                {article.category.replace('-', ' ').toUpperCase()}
              </span>
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${getLanguageColor(article.language)}`}>
                {article.language.toUpperCase()}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 leading-tight">
              {article.title}
            </h1>

            <p className="text-xl text-gray-600 mb-6 leading-relaxed">
              {article.excerpt}
            </p>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-6">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                <span>{formatDate(article.publishedAt || article.createdAt)}</span>
              </div>
              <div className="flex items-center">
                <Eye className="w-4 h-4 mr-2" />
                <span>{article.views} views</span>
              </div>
              {article.author && (
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  <span>
                    By {typeof article.author === 'object' ? article.author.name : article.author}
                  </span>
                </div>
              )}
              <div className="flex items-center">
                <Globe className="w-4 h-4 mr-2" />
                <span>
                  {article.language === 'hi' ? 'हिंदी में पढ़ें' : 'Read in English'}
                </span>
              </div>
            </div>
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="mb-8">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Tags:</h3>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Article Content */}
          <div className="prose max-w-none text-gray-700 leading-relaxed">
            <div 
              dangerouslySetInnerHTML={{ __html: article.content }}
              className="text-lg"
            />
          </div>

          {/* Social Sharing */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Share this article</h3>
            <div className="flex items-center space-x-4">
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Facebook className="w-4 h-4 mr-2" />
                Facebook
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-4 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-colors"
              >
                <Twitter className="w-4 h-4 mr-2" />
                Twitter
              </a>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                WhatsApp
              </a>
              <button
                onClick={() => navigator.clipboard.writeText(shareUrl)}
                className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Copy Link
              </button>
            </div>
          </div>

          {/* Author Info */}
          {article.author && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                  <User className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">
                    {typeof article.author === 'object' ? article.author.name : article.author}
                  </h4>
                  <p className="text-sm text-gray-600">News Writer</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </article>
    </div>
  )
}
