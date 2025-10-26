'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { 
  Newspaper, 
  Briefcase, 
  ArrowRight,
  CheckCircle
} from 'lucide-react'

interface Job {
  _id: string
  title: string
  company: string
  salary?: string
  jobType: string
  location: string
  createdAt: string
}

interface News {
  _id: string
  title: string
  excerpt: string
  publishedAt: string
}

interface Stats {
  activeJobs: number
  publishedNews: number
  totalUsers: number
  recentJobs: Job[]
  latestNews: News | null
}

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  // Fetch real data
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats')
        const data = await response.json()
        if (data.success) {
          setStats(data.data)
        }
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <section className="relative min-h-[50vh] md:min-h-[60vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 w-full pt-16 md:pt-20 pb-36 mb-2" style={{ marginLeft: 'calc(-50vw + 50%)', marginRight: 'calc(-50vw + 50%)', width: '100vw' }}>
      {/* Animated Background Images */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <div className="absolute inset-0 opacity-30">
          <div className="w-full h-full bg-cover bg-center bg-no-repeat animate-scroll" style={{
            backgroundImage: `url("https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")`,
            animation: 'scroll 20s linear infinite'
          }}></div>
        </div>
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full bg-cover bg-center bg-no-repeat animate-scroll-reverse" style={{
            backgroundImage: `url("https://images.unsplash.com/photo-1587474260584-136574528ed5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")`,
            animation: 'scroll-reverse 25s linear infinite'
          }}></div>
        </div>
        <div className="absolute inset-0 opacity-15">
          <div className="w-full h-full bg-cover bg-center bg-no-repeat animate-scroll-slow" style={{
            backgroundImage: `url("https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")`,
            animation: 'scroll-slow 30s linear infinite'
          }}></div>
        </div>
      </div>
      
      {/* Floating Elements */}
      <div className="absolute top-32 left-10 w-20 h-20 bg-white/10 rounded-full animate-float"></div>
      <div className="absolute top-48 right-20 w-16 h-16 bg-secondary-500/20 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
      <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white/10 rounded-full animate-float" style={{animationDelay: '2s'}}></div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="grid lg:grid-cols-2 gap-6 items-center">
          {/* Left Content */}
          <div className={`text-white space-y-3 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Main Heading */}
            <div className="space-y-1">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-white">
                Your Gateway to Success in Bihar
              </h1>
              <p className="text-sm md:text-base text-white/90">
                बिहार की आवाज़
              </p>
            </div>

            {/* Description */}
            <p className="text-sm text-white/85 max-w-xl">
              Find verified jobs, stay updated with latest news, and connect with opportunities across Bihar.
            </p>

            {/* Features List */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-1">
              {[
                "Verified Jobs",
                "Latest News",
                "Free Platform",
                "Hindi & English"
              ].map((feature, index) => (
                <div key={index} className="flex items-center space-x-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
                  <span className="text-xs text-white/85">{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-2">
            <Link 
              href="/jobs" 
                className="group bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 inline-flex items-center justify-center space-x-2 text-sm"
            >
                <Briefcase className="w-4 h-4" />
                <span>Explore Jobs</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
              
            <Link 
              href="/news" 
                className="group bg-transparent border-2 border-white/40 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-white/15 hover:border-white/60 transition-all duration-300 inline-flex items-center justify-center space-x-2 backdrop-blur-sm"
            >
                <Newspaper className="w-4 h-4" />
                <span>Latest News</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-white/20">
              <div className="text-center">
                <div className="text-base md:text-lg font-bold text-white">
                  {loading ? '...' : `${stats?.activeJobs || 0}+`}
                </div>
                <div className="text-[10px] md:text-xs text-white/70">Jobs</div>
              </div>
              <div className="text-center">
                <div className="text-base md:text-lg font-bold text-white">
                  {loading ? '...' : `${Math.floor((stats?.totalUsers || 0) / 1000)}K+`}
                </div>
                <div className="text-[10px] md:text-xs text-white/70">Users</div>
              </div>
              <div className="text-center">
                <div className="text-base md:text-lg font-bold text-white">
                  {loading ? '...' : `${stats?.publishedNews || 0}+`}
                </div>
                <div className="text-[10px] md:text-xs text-white/70">Stories</div>
              </div>
            </div>
          </div>

          {/* Right Content - Premium Notifications */}
          <div className={`relative transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <div className="space-y-4">
              {/* Latest Jobs Notification */}
              <div className="relative bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-white/30 overflow-hidden">
                {/* Premium Header */}
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Briefcase className="w-5 h-5 text-white" />
                      <h3 className="font-bold text-white text-sm">Latest Job Opportunities</h3>
                    </div>
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  </div>
                </div>

                {/* Notifications List */}
                <div className="p-4 space-y-2 max-h-48 overflow-y-auto">
                  {loading ? (
                    Array.from({ length: 3 }).map((_, index) => (
                      <div key={index} className="animate-pulse">
                        <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <div className="h-3 bg-gray-200 rounded w-3/4 mb-1"></div>
                            <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                          </div>
                          <div className="w-12 h-6 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                    ))
                  ) : stats?.recentJobs && stats.recentJobs.length > 0 ? (
                    stats.recentJobs.slice(0, 5).map((job) => (
                      <Link 
                        key={job._id} 
                        href={`/jobs/${job._id}`}
                        className="flex items-center justify-between p-2 bg-green-50 hover:bg-green-100 rounded-lg transition-all duration-200 group"
                      >
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-semibold text-gray-900 line-clamp-1 group-hover:text-green-700">{job.title}</h4>
                          <p className="text-[10px] text-gray-600 truncate">{job.company}</p>
                        </div>
                        <div className="ml-2 flex-shrink-0">
                          <span className="bg-green-600 text-white text-[9px] px-2 py-0.5 rounded font-medium">
                            View
                          </span>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="p-3 text-center">
                      <p className="text-xs text-gray-500">No jobs available</p>
                    </div>
                  )}
                </div>

                <Link 
                  href="/jobs"
                  className="block text-center py-2 bg-gray-100 hover:bg-green-50 text-green-700 font-semibold text-xs transition-colors"
                >
                  View All Jobs →
                </Link>
              </div>

              {/* Latest News Notification */}
              <div className="relative bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-white/30 overflow-hidden">
                {/* Premium Header */}
                <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Newspaper className="w-5 h-5 text-white" />
                      <h3 className="font-bold text-white text-sm">Latest News & Updates</h3>
                    </div>
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  </div>
                </div>

                {/* Notifications List */}
                <div className="p-4 space-y-2 max-h-48 overflow-y-auto">
                  {loading ? (
                    Array.from({ length: 3 }).map((_, index) => (
                      <div key={index} className="animate-pulse">
                        <div className="flex items-center p-2 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
                            <div className="h-2 bg-gray-200 rounded w-2/3"></div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : stats?.latestNews ? (
                    <Link 
                      href={`/news/${stats.latestNews._id}`}
                      className="block p-2 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-all duration-200 group"
                    >
                      <p className="text-xs font-semibold text-gray-900 line-clamp-2 group-hover:text-emerald-700 mb-1">
                        {stats.latestNews.title}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] text-gray-600">
                          {new Date(stats.latestNews.publishedAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                        </span>
                        <span className="text-[9px] text-emerald-600 font-medium">Read →</span>
                      </div>
                    </Link>
                  ) : (
                    <div className="p-3 text-center">
                      <p className="text-xs text-gray-500">No news available</p>
                    </div>
                  )}
                </div>

                <Link 
                  href="/news"
                  className="block text-center py-2 bg-gray-100 hover:bg-emerald-50 text-emerald-700 font-semibold text-xs transition-colors"
                >
                  View All News →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      
    </section>
  )
}
