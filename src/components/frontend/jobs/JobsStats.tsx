'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, Users, MapPin, Clock } from 'lucide-react'

interface JobsStatsProps {
  className?: string
}

interface JobsStatsData {
  totalJobs: number
  activeJobs: number
  totalCompanies: number
  totalLocations: number
  recentJobs: number
  totalApplications: number
  avgResponseTime: string
}

export default function JobsStats({ className = '' }: JobsStatsProps) {
  const [stats, setStats] = useState<JobsStatsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/stats/jobs')
      const data = await response.json()
      
      if (data.success) {
        setStats(data.data)
      } else {
        setError(data.message || 'Failed to fetch statistics')
      }
    } catch (err) {
      setError('Failed to fetch statistics')
      console.error('Error fetching jobs stats:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className={`grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mt-4 sm:mt-6 md:mt-8 ${className}`}>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-gradient-to-br from-white to-slate-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-slate-200/50 shadow-sm animate-pulse">
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 bg-slate-200 rounded-xl"></div>
              <div className="w-12 h-5 bg-slate-200 rounded-full"></div>
            </div>
            <div className="space-y-2">
              <div className="h-8 bg-slate-200 rounded w-16"></div>
              <div className="h-4 bg-slate-200 rounded w-20"></div>
              <div className="h-3 bg-slate-200 rounded w-24"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className={`grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mt-4 sm:mt-6 md:mt-8 ${className}`}>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-gradient-to-br from-white to-red-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-red-200 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <span className="text-red-600 text-xl">!</span>
              </div>
              <div className="w-12 h-5 bg-red-100 rounded-full"></div>
            </div>
            <div className="space-y-2">
              <p className="text-2xl sm:text-3xl font-bold text-slate-900">--</p>
              <p className="text-sm text-red-600">Error</p>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!stats) return null

  const statsItems = [
    {
      icon: TrendingUp,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      value: `${stats.activeJobs}+`,
      label: 'Active Jobs',
      description: `${stats.totalJobs} total posted`
    },
    {
      icon: Users,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      value: `${stats.totalCompanies}+`,
      label: 'Companies',
      description: 'Hiring partners'
    },
    {
      icon: MapPin,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      value: `${stats.totalLocations}`,
      label: 'Locations',
      description: 'Coverage areas'
    },
    {
      icon: Clock,
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      value: stats.avgResponseTime,
      label: 'Response Time',
      description: 'Average response'
    }
  ]

  return (
    <div className={`grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mt-4 sm:mt-6 md:mt-8 ${className}`}>
      {statsItems.map((item, index) => (
        <div key={index} className="group relative bg-gradient-to-br from-white to-slate-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-slate-200/50 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 overflow-hidden">
          {/* Decorative gradient overlay */}
          <div className={`absolute inset-0 bg-gradient-to-br ${item.iconColor === 'text-green-600' ? 'from-green-500/5 to-emerald-500/5' : item.iconColor === 'text-blue-600' ? 'from-blue-500/5 to-cyan-500/5' : item.iconColor === 'text-purple-600' ? 'from-purple-500/5 to-violet-500/5' : 'from-orange-500/5 to-amber-500/5'} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
          
          <div className="relative">
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2.5 sm:p-3 ${item.iconBg} rounded-xl shadow-md group-hover:scale-110 transition-transform duration-300`}>
                <item.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${item.iconColor}`} />
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-semibold ${item.iconColor === 'text-green-600' ? 'bg-green-100 text-green-700' : item.iconColor === 'text-blue-600' ? 'bg-blue-100 text-blue-700' : item.iconColor === 'text-purple-600' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'}`}>
                {item.label === 'Active Jobs' ? '💼' : item.label === 'Companies' ? '🏢' : item.label === 'Locations' ? '📍' : '⚡'}
              </div>
            </div>
            
            <div className="space-y-1">
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 group-hover:scale-105 transition-transform duration-300 inline-block">
                {item.value}
              </p>
              <p className="text-sm sm:text-base font-semibold text-slate-700">{item.label}</p>
              <p className="text-xs sm:text-sm text-slate-500">{item.description}</p>
            </div>
            
            {/* Decorative corner accent */}
            <div className={`absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-br ${item.iconBg} opacity-5 rounded-tl-full`}></div>
          </div>
        </div>
      ))}
    </div>
  )
}
