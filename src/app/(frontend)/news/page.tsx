import { Metadata } from 'next'
import { Suspense } from 'react'
import Link from 'next/link'
import NewsList from '@/components/frontend/news/NewsList'
import CategoryNav from '@/components/frontend/news/CategoryNav'
import FeaturedNews from '@/components/frontend/news/FeaturedNews'
import NewsStats from '@/components/frontend/news/NewsStats'
import { Newspaper, TrendingUp, Globe, FolderOpen } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Latest Bihar News | Apna Journey',
  description: 'Stay updated with the latest news from Bihar. Get news on politics, business, education, sports, and more from across Bihar. Read news in English and Hindi.',
  keywords: 'Bihar news, latest news Bihar, Bihar politics, Bihar business news, Bihar education news, Patna news, Bihar hindi news, Bihar english news, Bihar current affairs, Bihar local news',
  openGraph: {
    title: 'Latest Bihar News | Apna Journey',
    description: 'Stay updated with the latest news from Bihar. Read news in English and Hindi.',
    url: 'https://apnajourney.com/news',
    siteName: 'Apna Journey - Bihar Ki Awaaz',
    type: 'website',
    locale: 'en_IN',
  },
  alternates: {
    canonical: 'https://apnajourney.com/news',
  },
}

export default function NewsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Modern Header Section */}
      <section className="relative bg-white border-b border-slate-200">
        <div className="absolute inset-0 bg-gradient-to-r from-green-50/50 to-emerald-50/50"></div>
        <div className="relative container mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8 lg:py-12">
          <div className="max-w-4xl">
            <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4 mb-4 sm:mb-6">
              <div className="p-2 sm:p-2.5 lg:p-3 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg sm:rounded-xl shadow-lg">
                <Newspaper className="w-5 h-5 sm:w-6 sm:h-7 lg:w-8 lg:h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight">Bihar News</h1>
                <p className="text-slate-600 text-sm sm:text-base lg:text-lg mt-1 sm:mt-2">Stay informed with the latest developments across Bihar</p>
              </div>
            </div>
            
            {/* Live Stats Bar */}
            <NewsStats />
          </div>
        </div>
      </section>

      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Category Navigation */}
            <div className="mb-6 sm:mb-8">
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6">
                <div className="flex items-center space-x-2 mb-4 sm:mb-5">
                  <div className="p-2 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg">
                    <FolderOpen className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-semibold text-slate-900">Browse by Category</h2>
                    <p className="text-xs sm:text-sm text-slate-600">Explore news from different topics</p>
                  </div>
                </div>
                <CategoryNav />
              </div>
            </div>

            {/* Featured News */}
            <div className="mb-6 sm:mb-8">
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-200">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                    <h2 className="text-base sm:text-lg font-semibold text-slate-900">Featured Stories</h2>
                  </div>
              </div>
                <div className="p-4 sm:p-6">
              <Suspense fallback={
                <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                  {[...Array(2)].map((_, i) => (
                        <div key={i} className="bg-slate-50 rounded-xl p-4 sm:p-6 animate-pulse border border-slate-200">
                          <div className="h-40 sm:h-48 bg-slate-200 rounded-lg mb-3 sm:mb-4"></div>
                          <div className="h-4 sm:h-5 bg-slate-200 rounded w-3/4 mb-2"></div>
                          <div className="h-3 sm:h-4 bg-slate-200 rounded w-1/2 mb-3 sm:mb-4"></div>
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
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-200">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <h2 className="text-base sm:text-lg font-semibold text-slate-900">Latest News</h2>
                  <div className="flex items-center space-x-2 text-xs sm:text-sm text-slate-600">
                    <span className="px-2 sm:px-3 py-1 bg-slate-100 rounded-full">Most Recent</span>
                  </div>
                </div>
              </div>
              <div className="p-4 sm:p-6">
              <Suspense fallback={
                  <div className="space-y-3 sm:space-y-4">
                  {[...Array(6)].map((_, i) => (
                      <div key={i} className="bg-slate-50 rounded-xl p-3 sm:p-4 animate-pulse border border-slate-200">
                      <div className="flex gap-3 sm:gap-4">
                          <div className="w-16 sm:w-20 h-12 sm:h-16 bg-slate-200 rounded-lg flex-shrink-0"></div>
                          <div className="flex-1 space-y-2 sm:space-y-3">
                            <div className="h-3 sm:h-4 bg-slate-200 rounded w-3/4"></div>
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
          <div className="lg:w-80 flex-shrink-0">
            <div className="lg:sticky lg:top-8 space-y-4 sm:space-y-6">
              {/* Quick Links */}
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-200">
                  <h3 className="text-base sm:text-lg font-semibold text-slate-900">Quick Access</h3>
                </div>
                <div className="p-4 sm:p-6">
                  <div className="space-y-2 sm:space-y-3">
                    <Link href="/news?featured=true" className="flex items-center p-2 sm:p-3 rounded-lg hover:bg-slate-50 transition-colors group">
                      <div className="p-1.5 sm:p-2 bg-yellow-100 rounded-lg mr-2 sm:mr-3 group-hover:bg-yellow-200 transition-colors flex-shrink-0">
                        <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-600" />
                      </div>
                      <span className="text-slate-700 font-medium text-sm sm:text-base">Featured News</span>
                    </Link>
                    <Link href="/news?language=hi" className="flex items-center p-2 sm:p-3 rounded-lg hover:bg-slate-50 transition-colors group">
                      <div className="p-1.5 sm:p-2 bg-orange-100 rounded-lg mr-2 sm:mr-3 group-hover:bg-orange-200 transition-colors flex-shrink-0">
                        <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-600" />
                      </div>

                      <span className="text-slate-700 font-medium text-sm sm:text-base">Hindi News</span>
                    </Link>
                    <Link href="/news?language=en" className="flex items-center p-2 sm:p-3 rounded-lg hover:bg-slate-50 transition-colors group">
                      <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg mr-2 sm:mr-3 group-hover:bg-blue-200 transition-colors flex-shrink-0">
                        <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
                      </div>
                      <span className="text-slate-700 font-medium text-sm sm:text-base">English News</span>
                    </Link>
                    <Link href="/news?category=politics" className="flex items-center p-2 sm:p-3 rounded-lg hover:bg-slate-50 transition-colors group">
                      <div className="p-1.5 sm:p-2 bg-red-100 rounded-lg mr-2 sm:mr-3 group-hover:bg-red-200 transition-colors flex-shrink-0">
                        <Newspaper className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-600" />
                      </div>
                      <span className="text-slate-700 font-medium text-sm sm:text-base">Politics</span>
                    </Link>
                    <Link href="/news?category=education" className="flex items-center p-2 sm:p-3 rounded-lg hover:bg-slate-50 transition-colors group">
                      <div className="p-1.5 sm:p-2 bg-green-100 rounded-lg mr-2 sm:mr-3 group-hover:bg-green-200 transition-colors flex-shrink-0">
                        <Newspaper className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600" />
                      </div>
                      <span className="text-slate-700 font-medium text-sm sm:text-base">Education</span>
                    </Link>
                    <Link href="/news?category=business" className="flex items-center p-2 sm:p-3 rounded-lg hover:bg-slate-50 transition-colors group">
                      <div className="p-1.5 sm:p-2 bg-purple-100 rounded-lg mr-2 sm:mr-3 group-hover:bg-purple-200 transition-colors flex-shrink-0">
                        <Newspaper className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600" />
                      </div>
                      <span className="text-slate-700 font-medium text-sm sm:text-base">Business</span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Newsletter Signup */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-green-200">
                <div className="text-center">
                  <div className="p-2 sm:p-3 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl w-fit mx-auto mb-3 sm:mb-4">
                    <Newspaper className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-1 sm:mb-2">Stay Updated</h3>
                  <p className="text-xs sm:text-sm text-slate-600 mb-3 sm:mb-4">Get the latest news delivered to your inbox</p>
                  <button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-sm sm:text-base font-medium hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-sm hover:shadow-md">
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
