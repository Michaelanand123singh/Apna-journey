import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import Script from 'next/script'
import NewsArticle from '@/components/frontend/news/NewsArticle'
import ShareButton from '@/components/shared/ShareButton'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { getApiUrl } from '@/lib/utils/api'

type NewsPageParams = { slug: string }

async function getNewsArticle(slug: string) {
  try {
    const apiUrl = getApiUrl(`/news/${slug}`)
    
    const response = await fetch(apiUrl, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    
    if (!response.ok) {
      console.error(`Failed to fetch news article: ${response.status} ${response.statusText}`)
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

  // NewsArticle Schema
  const newsSchema = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.excerpt,
    image: article.featuredImage ? [article.featuredImage] : [],
    datePublished: article.publishedAt || article.createdAt,
    dateModified: article.updatedAt || article.createdAt,
    author: {
      '@type': 'Person',
      name: article.author?.name || 'Apna Journey Team',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Apna Journey',
      logo: {
        '@type': 'ImageObject',
        url: 'https://apnajourney.com/images/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://apnajourney.com/news/${article.slug}`,
    },
    articleSection: article.category,
    keywords: article.tags?.join(', ') || article.category,
  }

  return (
    <>
      <Script
        id="news-article-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(newsSchema) }}
      />
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-3 sm:py-4">
            <div className="flex items-center justify-between">
              <Link
                href="/news"
                className="flex items-center text-gray-600 hover:text-primary-500 transition-colors text-sm sm:text-base"
              >
                <ArrowLeft className="w-4 h-4 mr-1.5 sm:mr-2" />
                <span className="hidden sm:inline">Back to News</span>
                <span className="sm:hidden">Back</span>
              </Link>
              <ShareButton
                url={`https://apnajourney.com/news/${article.slug}`}
                title={article.title}
                description={article.excerpt || article.content?.substring(0, 160).replace(/<[^>]*>/g, '') || 'Latest news from Bihar'}
                image={article.featuredImage}
                type="news"
                className="text-sm sm:text-base"
              />
            </div>
          </div>
        </div>

        {/* Article */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <Suspense fallback={
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 md:p-8 animate-pulse">
              <div className="h-6 sm:h-8 bg-gray-200 rounded w-3/4 mb-3 sm:mb-4"></div>
              <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/2 mb-4 sm:mb-6"></div>
              <div className="h-48 sm:h-64 bg-gray-200 rounded mb-4 sm:mb-6"></div>
              <div className="h-3 sm:h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-3 sm:h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          }>
            <NewsArticle article={article} />
          </Suspense>
        </div>
      </div>
    </>
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

  const cleanExcerpt = article.excerpt || article.content?.substring(0, 160).replace(/<[^>]*>/g, '') || 'Latest news from Bihar'

  return {
    title: `${article.title} - Apna Journey`,
    description: cleanExcerpt,
    keywords: `Bihar news, ${article.category}, ${article.tags?.join(', ') || ''}, local news Bihar, Bihar latest news`,
    openGraph: {
      title: article.title,
      description: cleanExcerpt,
      type: 'article',
      publishedTime: article.publishedAt || article.createdAt,
      modifiedTime: article.updatedAt,
      authors: [article.author?.name || 'Apna Journey Team'],
      section: article.category,
      tags: article.tags || [article.category],
      images: article.featuredImage ? [
        {
          url: article.featuredImage,
          width: 1200,
          height: 630,
          alt: article.title,
        }
      ] : [
        {
          url: 'https://apnajourney.com/images/news-og-default.jpg',
          width: 1200,
          height: 630,
          alt: 'Latest News from Bihar - Apna Journey',
        }
      ],
      url: `https://apnajourney.com/news/${article.slug}`,
      siteName: 'Apna Journey - Bihar Ki Awaaz',
      locale: 'en_IN',
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: cleanExcerpt,
      images: article.featuredImage ? [article.featuredImage] : ['https://apnajourney.com/images/news-twitter-default.jpg'],
      creator: '@apnajourney',
      site: '@apnajourney',
    },
    alternates: {
      canonical: `https://apnajourney.com/news/${article.slug}`,
    },
    other: {
      'article:author': article.author?.name || 'Apna Journey Team',
      'article:section': article.category,
      'article:tag': article.tags?.join(', ') || article.category,
    },
  }
}
