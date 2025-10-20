import { Suspense } from 'react'
import NewsList from '@/components/frontend/news/NewsList'
import CategoryNav from '@/components/frontend/news/CategoryNav'
import FeaturedNews from '@/components/frontend/news/FeaturedNews'
import NewsStats from '@/components/frontend/news/NewsStats'
import { Newspaper, TrendingUp, Globe, Clock, Users, Eye } from 'lucide-react'

export default function NewsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Modern Header Section */}
      <section className="relative bg-white border-b border-slate-200">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/50 to-purple-50/50"></div>
        <div className="relative container mx-auto px-6 py-12">
          <div className="max-w-4xl">
            <div className="flex items-center space-x-4 mb-6">
              <div className="p-3 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl shadow-lg">
                <Newspaper className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Gaya News</h1>
                <p className="text-slate-600 text-lg mt-2">Stay informed with the latest developments in Gaya and Bihar</p>
              </div>
            </div>
            
            {/* Live Stats Bar */}
            <NewsStats />
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col xl:flex-row gap-8">
          {/* Main Content */}
          <div className="xl:w-3/4">
            {/* Category Navigation */}
            <div className="mb-8">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 border-b border-slate-200">
                  <h2 className="text-lg font-semibold text-slate-900">Browse by Category</h2>
                </div>
                <div className="p-6">
              <CategoryNav />
                </div>
              </div>
            </div>

            {/* Featured News */}
            <div className="mb-8">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 border-b border-slate-200">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-indigo-600" />
                    <h2 className="text-lg font-semibold text-slate-900">Featured Stories</h2>
                  </div>
              </div>
                <div className="p-6">
              <Suspense fallback={
                <div className="grid md:grid-cols-2 gap-6">
                  {[...Array(2)].map((_, i) => (
                        <div key={i} className="bg-slate-50 rounded-xl p-6 animate-pulse border border-slate-200">
                          <div className="h-48 bg-slate-200 rounded-lg mb-4"></div>
                          <div className="h-5 bg-slate-200 rounded w-3/4 mb-2"></div>
                          <div className="h-4 bg-slate-200 rounded w-1/2 mb-4"></div>
                          <div className="h-3 bg-slate-200 rounded w-full mb-2"></div>
                          <div className="h-3 bg-slate-200 rounded w-2/3"></div>
                    </div>
                  ))}
                </div>
              }>
                <FeaturedNews />
              </Suspense>
                </div>
              </div>
            </div>

            {/* All News */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-900">Latest News</h2>
                  <div className="flex items-center space-x-2 text-sm text-slate-600">
                    <span className="px-3 py-1 bg-slate-100 rounded-full">Most Recent</span>
                  </div>
                </div>
              </div>
              <div className="p-6">
              <Suspense fallback={
                  <div className="space-y-4">
                  {[...Array(6)].map((_, i) => (
                      <div key={i} className="bg-slate-50 rounded-xl p-4 animate-pulse border border-slate-200">
                      <div className="flex gap-4">
                          <div className="w-20 h-16 bg-slate-200 rounded-lg"></div>
                          <div className="flex-1 space-y-3">
                            <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                            <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                            <div className="h-3 bg-slate-200 rounded w-full"></div>
                            <div className="h-3 bg-slate-200 rounded w-2/3"></div>
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
          </div>

          {/* Modern Sidebar */}
          <div className="xl:w-80 flex-shrink-0">
            <div className="sticky top-8 space-y-6">
              {/* Quick Links */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 border-b border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-900">Quick Access</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-3">
                    <a href="/news?featured=true" className="flex items-center p-3 rounded-lg hover:bg-slate-50 transition-colors group">
                      <div className="p-2 bg-yellow-100 rounded-lg mr-3 group-hover:bg-yellow-200 transition-colors">
                        <TrendingUp className="w-4 h-4 text-yellow-600" />
                      </div>
                      <span className="text-slate-700 font-medium">Featured News</span>
                    </a>
                    <a href="/news?language=hindi" className="flex items-center p-3 rounded-lg hover:bg-slate-50 transition-colors group">
                      <div className="p-2 bg-orange-100 rounded-lg mr-3 group-hover:bg-orange-200 transition-colors">
                        <Globe className="w-4 h-4 text-orange-600" />
                      </div>
                      <span className="text-slate-700 font-medium">Hindi News</span>
                    </a>
                    <a href="/news?language=english" className="flex items-center p-3 rounded-lg hover:bg-slate-50 transition-colors group">
                      <div className="p-2 bg-blue-100 rounded-lg mr-3 group-hover:bg-blue-200 transition-colors">
                        <Globe className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="text-slate-700 font-medium">English News</span>
                    </a>
                    <a href="/news?category=politics" className="flex items-center p-3 rounded-lg hover:bg-slate-50 transition-colors group">
                      <div className="p-2 bg-red-100 rounded-lg mr-3 group-hover:bg-red-200 transition-colors">
                        <Newspaper className="w-4 h-4 text-red-600" />
                      </div>
                      <span className="text-slate-700 font-medium">Politics</span>
                    </a>
                    <a href="/news?category=education" className="flex items-center p-3 rounded-lg hover:bg-slate-50 transition-colors group">
                      <div className="p-2 bg-green-100 rounded-lg mr-3 group-hover:bg-green-200 transition-colors">
                        <Newspaper className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-slate-700 font-medium">Education</span>
                    </a>
                    <a href="/news?category=business" className="flex items-center p-3 rounded-lg hover:bg-slate-50 transition-colors group">
                      <div className="p-2 bg-purple-100 rounded-lg mr-3 group-hover:bg-purple-200 transition-colors">
                        <Newspaper className="w-4 h-4 text-purple-600" />
                      </div>
                      <span className="text-slate-700 font-medium">Business</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Newsletter Signup */}
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-200">
                <div className="text-center">
                  <div className="p-3 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl w-fit mx-auto mb-4">
                    <Newspaper className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Stay Updated</h3>
                  <p className="text-sm text-slate-600 mb-4">Get the latest news delivered to your inbox</p>
                  <button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2.5 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-sm hover:shadow-md">
                    Subscribe Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
