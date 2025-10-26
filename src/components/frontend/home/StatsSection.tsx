'use client'

import { TrendingUp, Users, Briefcase, Newspaper, Eye, Award } from 'lucide-react'
import AdSenseBanner from '../ads/AdSenseBanner'

export default function StatsSection() {
  const stats = [
    {
      icon: Briefcase,
      value: '500+',
      label: 'Active Jobs',
      description: 'Verified job opportunities',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Newspaper,
      value: '1000+',
      label: 'News Articles',
      description: 'Latest updates daily',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50'
    },
    {
      icon: Users,
      value: '5K+',
      label: 'Happy Users',
      description: 'Active community members',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      icon: Eye,
      value: '10K+',
      label: 'Monthly Visitors',
      description: 'Growing user base',
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      icon: Award,
      value: '95%',
      label: 'Success Rate',
      description: 'Job placement success',
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50'
    },
    {
      icon: TrendingUp,
      value: '24/7',
      label: 'Support',
      description: 'Always here to help',
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50'
    }
  ]

  return (
    <section className="py-16 bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Trusted by Thousands
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our platform has helped thousands of people find their dream jobs and stay updated with local news.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <div key={index} className={`${stat.bgColor} rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}>
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br ${stat.color} mb-4`}>
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-lg font-semibold text-gray-700 mb-1">{stat.label}</div>
                <div className="text-sm text-gray-600">{stat.description}</div>
              </div>
            )
          })}
        </div>

        {/* Bottom Ad Banner */}
        <div className="w-full">
          <AdSenseBanner 
            slot="1234567895" 
            className="h-24 w-full"
            placeholder="Stats Section Ad"
          />
        </div>
      </div>
    </section>
  )
}
