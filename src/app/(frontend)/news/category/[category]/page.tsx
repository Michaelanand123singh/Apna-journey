import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import NewsList from '@/components/frontend/news/NewsList'
import CategoryNav from '@/components/frontend/news/CategoryNav'
import { NEWS_CATEGORIES } from '@/lib/constants/categories'
import { Newspaper, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface CategoryPageProps {
  params: Promise<{ category: string }>
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params
  
  // Check if category is valid
  const validCategory = NEWS_CATEGORIES.find(cat => cat.value === category)
  if (!validCategory) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center space-x-3 mb-4">
            <Link
              href="/news"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </Link>
            <Newspaper className="w-8 h-8 text-primary-500" />
            <h1 className="text-3xl font-bold text-gray-800">
              {validCategory.label} News
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Stay updated with the latest {validCategory.label.toLowerCase()} news from Gaya and Bihar.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Category Navigation */}
            <div className="mb-8">
              <CategoryNav />
            </div>

            {/* News List */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                {validCategory.label} Articles
              </h2>
              <Suspense fallback={
                <div className="space-y-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                      <div className="flex gap-4">
                        <div className="w-32 h-24 bg-gray-200 rounded"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                          <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              }>
                <NewsList category={category} />
              </Suspense>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Links</h3>
              <div className="space-y-2">
                <Link href="/news" className="block text-primary-500 hover:text-primary-600 transition-colors">
                  All News
                </Link>
                <Link href="/news?featured=true" className="block text-primary-500 hover:text-primary-600 transition-colors">
                  Featured News
                </Link>
                <Link href="/news?language=hindi" className="block text-primary-500 hover:text-primary-600 transition-colors">
                  Hindi News
                </Link>
                <Link href="/news?language=english" className="block text-primary-500 hover:text-primary-600 transition-colors">
                  English News
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export async function generateStaticParams() {
  return NEWS_CATEGORIES.map((category) => ({
    category: category.value,
  }))
}
