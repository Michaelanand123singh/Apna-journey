import { Suspense } from 'react'
import NewsList from '@/components/frontend/news/NewsList'
import CategoryNav from '@/components/frontend/news/CategoryNav'
import FeaturedNews from '@/components/frontend/news/FeaturedNews'
import { Newspaper, TrendingUp } from 'lucide-react'

export default function NewsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center space-x-3 mb-4">
            <Newspaper className="w-8 h-8 text-primary-500" />
            <h1 className="text-3xl font-bold text-gray-800">Gaya News</h1>
          </div>
          <p className="text-gray-600 text-lg">
            Stay updated with the latest news and happenings in Gaya and Bihar.
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

            {/* Featured News */}
            <div className="mb-8">
              <div className="flex items-center space-x-2 mb-4">
                <TrendingUp className="w-5 h-5 text-primary-500" />
                <h2 className="text-xl font-semibold text-gray-800">Featured News</h2>
              </div>
              <Suspense fallback={
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
              }>
                <FeaturedNews />
              </Suspense>
            </div>

            {/* All News */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Latest News</h2>
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
                <NewsList />
              </Suspense>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Links</h3>
              <div className="space-y-2">
                <a href="/news?featured=true" className="block text-primary-500 hover:text-primary-600 transition-colors">
                  Featured News
                </a>
                <a href="/news?language=hindi" className="block text-primary-500 hover:text-primary-600 transition-colors">
                  Hindi News
                </a>
                <a href="/news?language=english" className="block text-primary-500 hover:text-primary-600 transition-colors">
                  English News
                </a>
                <a href="/news?category=politics" className="block text-primary-500 hover:text-primary-600 transition-colors">
                  Politics
                </a>
                <a href="/news?category=education" className="block text-primary-500 hover:text-primary-600 transition-colors">
                  Education
                </a>
                <a href="/news?category=business" className="block text-primary-500 hover:text-primary-600 transition-colors">
                  Business
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
