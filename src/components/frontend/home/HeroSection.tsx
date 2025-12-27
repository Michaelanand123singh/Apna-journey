'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

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
    <section className="relative min-h-[70vh] md:min-h-[80vh] lg:min-h-[85vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 w-full py-12 md:py-20 lg:py-24 mb-2" style={{ marginLeft: 'calc(-50vw + 50%)', marginRight: 'calc(-50vw + 50%)', width: '100vw' }}>
      {/* Animated Background Images - Jobs Platform Theme */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        {/* Professional team meeting/collaboration */}
        <div className="absolute inset-0 opacity-30">
          <div className="w-full h-full bg-cover bg-center bg-no-repeat animate-scroll" style={{
            backgroundImage: `url("https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")`,
            animation: 'scroll 20s linear infinite'
          }}></div>
        </div>
        {/* Modern office workspace */}
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full bg-cover bg-center bg-no-repeat animate-scroll-reverse" style={{
            backgroundImage: `url("https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80")`,
            animation: 'scroll-reverse 25s linear infinite'
          }}></div>
        </div>
        {/* Business professional networking/career growth */}
        <div className="absolute inset-0 opacity-15">
          <div className="w-full h-full bg-cover bg-center bg-no-repeat animate-scroll-slow" style={{
            backgroundImage: `url("https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2092&q=80")`,
            animation: 'scroll-slow 30s linear infinite'
          }}></div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-32 left-10 w-20 h-20 bg-white/10 rounded-full animate-float"></div>
      <div className="absolute top-48 right-20 w-16 h-16 bg-secondary-500/20 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white/10 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>

      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="text-center">
          <div className={`text-white space-y-10 md:space-y-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Main Heading */}
            <div className="space-y-5 md:space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight">
                Your Gateway to Success in India
              </h1>
              <p className="text-lg md:text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto">
                Find verified jobs and stay updated with the latest news across India
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
              <Link
                href="/jobs"
                className="bg-green-600 hover:bg-green-700 text-white px-12 py-4 rounded-lg font-medium text-lg transition-colors"
              >
                Explore Jobs
              </Link>

              <Link
                href="/news"
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white px-12 py-4 rounded-lg font-medium text-lg transition-colors"
              >
                Latest News
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-12 md:gap-16 pt-16 md:pt-20 max-w-xl mx-auto">
              <div>
                <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2">
                  {loading ? '...' : `${stats?.activeJobs || 0}+`}
                </div>
                <div className="text-lg md:text-xl text-white/70">Jobs</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2">
                  {loading ? '...' : `${stats?.publishedNews || 0}+`}
                </div>
                <div className="text-lg md:text-xl text-white/70">Stories</div>
              </div>
            </div>
          </div>
        </div>
      </div>


    </section>
  )
}
