'use client'

import Link from 'next/link'
import { ArrowRight, Briefcase, Newspaper, Users, Star, CheckCircle } from 'lucide-react'
import AdSenseBanner from '../ads/AdSenseBanner'

export default function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          {/* Main Content - 8 columns */}
          <div className="lg:col-span-8 text-center lg:text-left">
            <div className="mb-8">
              <div className="inline-flex items-center space-x-2 bg-white/10 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Star className="w-4 h-4" />
                <span>Join Our Community</span>
              </div>
              
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                Ready to start your
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  journey in Bihar?
                </span>
              </h2>
              
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto lg:mx-0">
                Join thousands of Bihar residents who have found their dream jobs and stay updated with the latest news and opportunities.
              </p>

              {/* Features List */}
              <div className="grid md:grid-cols-2 gap-4 mb-8 max-w-2xl mx-auto lg:mx-0">
                {[
                  "Free job postings for employers",
                  "Real-time job notifications",
                  "Latest Bihar news updates",
                  "Community support and guidance"
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3 text-left">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link 
                  href="/auth/register" 
                  className="group bg-white text-slate-900 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 hover:shadow-glow-lg transition-all duration-300 inline-flex items-center justify-center space-x-2"
                >
                  <span>Get Started Free</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                
                <Link 
                  href="/jobs" 
                  className="group bg-transparent border-2 border-white/30 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 hover:border-white/50 transition-all duration-300 inline-flex items-center justify-center space-x-2 backdrop-blur-sm"
                >
                  <Briefcase className="w-5 h-5" />
                  <span>Browse Jobs</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Sidebar - 4 columns */}
          <div className="lg:col-span-4 space-y-6">
            {/* AdSense Rectangle */}
            <AdSenseBanner 
              slot="1234567896" 
              className="h-32 w-full"
              placeholder="CTA Sidebar Ad"
            />

            {/* Quick Stats */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white">
              <h3 className="text-lg font-bold mb-4">Platform Highlights</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Briefcase className="w-5 h-5 text-blue-400" />
                    <span className="text-sm">Active Jobs</span>
                  </div>
                  <span className="font-bold text-blue-400">500+</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Newspaper className="w-5 h-5 text-green-400" />
                    <span className="text-sm">News Articles</span>
                  </div>
                  <span className="font-bold text-green-400">1000+</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-purple-400" />
                    <span className="text-sm">Happy Users</span>
                  </div>
                  <span className="font-bold text-purple-400">5K+</span>
                </div>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white">
              <h3 className="text-lg font-bold mb-3">Stay Updated</h3>
              <p className="text-sm text-gray-300 mb-4">
                Get the latest job alerts and news updates delivered to your inbox.
              </p>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm">
                  Subscribe Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
