'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { 
  Search, 
  Newspaper, 
  Briefcase, 
  MapPin, 
  Users, 
  TrendingUp,
  ArrowRight,
  Star,
  CheckCircle,
  Play
} from 'lucide-react'

export default function HeroSection() {
  const [currentText, setCurrentText] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  const heroTexts = [
    "Find Your Dream Job in Gaya",
    "Stay Updated with Local News",
    "Connect with Local Community",
    "Discover Opportunities"
  ]

  useEffect(() => {
    setIsVisible(true)
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % heroTexts.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full animate-float"></div>
      <div className="absolute top-40 right-20 w-16 h-16 bg-secondary-500/20 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
      <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white/10 rounded-full animate-float" style={{animationDelay: '2s'}}></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className={`text-white space-y-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm font-medium">
              <Star className="w-4 h-4 text-yellow-400" />
              <span>Trusted by 10,000+ Users</span>
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                <span className="block">Apna Journey</span>
                <span className="block text-3xl lg:text-4xl font-hindi text-white/90 mt-2">
                  गया की आवाज़
                </span>
              </h1>
              
              {/* Animated Text */}
              <div className="h-16 flex items-center">
                <h2 className="text-2xl lg:text-3xl font-semibold text-white/90 transition-all duration-500">
                  {heroTexts[currentText]}
                </h2>
              </div>
            </div>

            {/* Description */}
            <p className="text-xl text-white/80 leading-relaxed max-w-lg">
              Your comprehensive platform for local job opportunities and news in Gaya, Bihar. 
              Connect with the community and discover endless possibilities.
            </p>

            {/* Features List */}
            <div className="space-y-3">
              {[
                "Verified job listings from local employers",
                "Real-time news updates from Gaya",
                "Community-driven content and reviews",
                "Mobile-first responsive design"
              ].map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-white/90">{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/jobs" 
                className="group bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 hover:shadow-glow-lg transition-all duration-300 inline-flex items-center justify-center space-x-2 transform hover:-translate-y-1"
              >
                <Briefcase className="w-5 h-5" />
                <span>Find Jobs</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link 
                href="/news" 
                className="group bg-transparent border-2 border-white/30 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 hover:border-white/50 transition-all duration-300 inline-flex items-center justify-center space-x-2 backdrop-blur-sm"
              >
                <Newspaper className="w-5 h-5" />
                <span>Read News</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/20">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">500+</div>
                <div className="text-sm text-white/70">Active Jobs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">10K+</div>
                <div className="text-sm text-white/70">Happy Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">50+</div>
                <div className="text-sm text-white/70">News Daily</div>
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
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
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
                  {[
                    { title: "Software Engineer", company: "TechCorp Gaya", salary: "₹8-12 LPA", type: "Full Time" },
                    { title: "Marketing Manager", company: "LocalBiz", salary: "₹6-10 LPA", type: "Full Time" },
                    { title: "Data Analyst", company: "StartupXYZ", salary: "₹5-8 LPA", type: "Remote" }
                  ].map((job, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{job.title}</h4>
                          <p className="text-sm text-gray-600">{job.company}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-primary-600">{job.salary}</p>
                          <p className="text-xs text-gray-500">{job.type}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* View All Button */}
                <button className="w-full mt-6 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors">
                  View All Jobs
                </button>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-secondary-500/20 rounded-full animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-primary-500/20 rounded-full animate-bounce-slow"></div>
            </div>

            {/* News Card */}
            <div className="absolute -bottom-8 -left-8 bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 max-w-xs">
              <div className="flex items-center space-x-3 mb-3">
                <Newspaper className="w-5 h-5 text-primary-600" />
                <span className="font-semibold text-gray-900">Breaking News</span>
              </div>
              <p className="text-sm text-gray-700 line-clamp-2">
                New IT park inaugurated in Gaya, creating 1000+ job opportunities for local youth.
              </p>
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-gray-500">2 hours ago</span>
                <button className="text-primary-600 text-xs font-medium hover:underline">
                  Read More
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  )
}
