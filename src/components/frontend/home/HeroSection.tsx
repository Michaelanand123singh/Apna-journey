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
    <section className="relative min-h-[60vh] md:min-h-[70vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 w-full pt-16 md:pt-20" style={{ marginLeft: 'calc(-50vw + 50%)', marginRight: 'calc(-50vw + 50%)', width: '100vw' }}>
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
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Content */}
          <div className={`text-white space-y-4 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Main Heading */}
            <div className="space-y-1">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-white">
                Your Gateway to Success in Bihar
              </h1>
              <p className="text-lg md:text-xl text-white/90">
                बिहार की आवाज़
              </p>
            </div>

            {/* Description */}
            <p className="text-base text-white/85 max-w-xl">
              Find verified jobs, stay updated with latest news, and connect with opportunities across Bihar.
            </p>

            {/* Features List */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-1.5">
              {[
                "Verified Jobs",
                "Latest News",
                "Free Platform",
                "Hindi & English"
              ].map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <span className="text-sm text-white/85">{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
            <Link 
              href="/jobs" 
                className="group bg-green-600 hover:bg-green-700 text-white px-6 md:px-8 py-3 md:py-3.5 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 inline-flex items-center justify-center space-x-2 transform hover:-translate-y-0.5"
            >
                <Briefcase className="w-4 h-4 md:w-5 md:h-5" />
                <span>Explore Jobs</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
              
            <Link 
              href="/news" 
                className="group bg-transparent border-2 border-white/40 text-white px-6 md:px-8 py-3 md:py-3.5 rounded-lg font-semibold hover:bg-white/15 hover:border-white/60 transition-all duration-300 inline-flex items-center justify-center space-x-2 backdrop-blur-sm"
            >
                <Newspaper className="w-4 h-4 md:w-5 md:h-5" />
                <span>Latest News</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 md:gap-5 pt-5 md:pt-6 border-t border-white/20">
              <div className="text-center">
                <div className="text-lg md:text-xl lg:text-2xl font-bold text-white">
                  {loading ? '...' : `${stats?.activeJobs || 0}+`}
                </div>
                <div className="text-[11px] md:text-xs text-white/70">Verified Jobs</div>
              </div>
              <div className="text-center">
                <div className="text-lg md:text-xl lg:text-2xl font-bold text-white">
                  {loading ? '...' : `${Math.floor((stats?.totalUsers || 0) / 1000)}K+`}
                </div>
                <div className="text-[11px] md:text-xs text-white/70">Members</div>
              </div>
              <div className="text-center">
                <div className="text-lg md:text-xl lg:text-2xl font-bold text-white">
                  {loading ? '...' : `${stats?.publishedNews || 0}+`}
                </div>
                <div className="text-[11px] md:text-xs text-white/70">News Stories</div>
              </div>
            </div>
          </div>

          {/* Right Content - Visual */}
          <div className={`relative transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            {/* Main Card */}
            <div className="relative">
              {/* Background Card */}
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-3xl transform rotate-3"></div>
              
              {/* Main Card */}
              <div className="relative bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20">
                {/* Card Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                      <Briefcase className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Latest Jobs</h3>
                      <p className="text-sm text-gray-600">Updated 2 hours ago</p>
                    </div>
                  </div>
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                </div>

                {/* Job Cards */}
                <div className="space-y-4">
                  {loading ? (
                    // Loading skeleton
                    Array.from({ length: 3 }).map((_, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-xl animate-pulse">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                          </div>
                          <div className="text-right">
                            <div className="h-3 bg-gray-200 rounded w-16 mb-1"></div>
                            <div className="h-3 bg-gray-200 rounded w-12"></div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : stats?.recentJobs && stats.recentJobs.length > 0 ? (
                    stats.recentJobs.map((job) => (
                      <div key={job._id} className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 line-clamp-1">{job.title}</h4>
                            <p className="text-sm text-gray-600">{job.company}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-green-600">{job.salary || 'Not specified'}</p>
                            <p className="text-xs text-gray-500 capitalize">{job.jobType.replace('-', ' ')}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 bg-gray-50 rounded-xl text-center">
                      <p className="text-sm text-gray-500">No recent jobs available</p>
                    </div>
                  )}
                </div>

                {/* View All Button */}
                <Link 
                  href="/jobs"
                  className="w-full mt-6 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors inline-block text-center"
                >
                  View All Jobs
                </Link>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-secondary-500/20 rounded-full animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-green-500/20 rounded-full animate-bounce-slow"></div>
            </div>

            {/* News Card */}
            <div className="absolute -bottom-8 -left-8 bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 max-w-xs">
              <div className="flex items-center space-x-3 mb-3">
                <Newspaper className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-gray-900">Latest News</span>
              </div>
              {loading ? (
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-full animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                </div>
              ) : stats?.latestNews ? (
                <>
                  <p className="text-sm text-gray-700 line-clamp-2">
                    {stats.latestNews.title}
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-gray-500">
                      {new Date(stats.latestNews.publishedAt).toLocaleDateString()}
                    </span>
                    <Link href="/news" className="text-green-600 text-xs font-medium hover:underline">
                      Read More
                    </Link>
                  </div>
                </>
              ) : (
                <p className="text-sm text-gray-500">No recent news available</p>
              )}
            </div>
          </div>
        </div>
      </div>

      
    </section>
  )
}
