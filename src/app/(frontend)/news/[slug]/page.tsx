import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import NewsArticle from '@/components/frontend/news/NewsArticle'
import { ArrowLeft, Share2 } from 'lucide-react'
import Link from 'next/link'

type NewsPageParams = { slug: string }

async function getNewsArticle(slug: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/news/${slug}`, {
      cache: 'no-store'
    })
    
    if (!response.ok) {
      return null
    }
    
    const data = await response.json()
    return data.success ? data.data : null
  } catch (error) {
    console.error('Error fetching news article:', error)
    return null
  }
}

export default async function NewsPage({ params }: { params: Promise<NewsPageParams> }) {
  const { slug } = await params
  const article = await getNewsArticle(slug)

  if (!article) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/news"
              className="flex items-center text-gray-600 hover:text-primary-500 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to News
            </Link>
            <button className="flex items-center text-gray-600 hover:text-primary-500 transition-colors">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </button>
          </div>
        </div>
      </div>

      {/* Article */}
      <div className="container mx-auto px-4 py-8">
        <Suspense fallback={
          <div className="bg-white rounded-lg shadow-sm p-8 animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
            <div className="h-64 bg-gray-200 rounded mb-6"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        }>
          <NewsArticle article={article} />
        </Suspense>
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: { params: Promise<NewsPageParams> }) {
  const { slug } = await params
  const article = await getNewsArticle(slug)

  if (!article) {
    return {
      title: 'Article Not Found',
      description: 'The requested news article could not be found.'
    }
  }

  return {
    title: `${article.title} - Apna Journey`,
    description: article.excerpt,
    keywords: `Gaya news, ${article.category}, ${article.tags?.join(', ')}, Bihar news`,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
      publishedTime: article.publishedAt || article.createdAt,
      images: [article.featuredImage],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
      images: [article.featuredImage],
    },
  }
}
