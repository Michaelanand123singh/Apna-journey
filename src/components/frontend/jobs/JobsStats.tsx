'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, Users, MapPin, Clock } from 'lucide-react'

interface JobsStatsProps {
  className?: string
  variant?: 'grid' | 'compact'
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

export default function JobsStats({ className = '', variant = 'grid' }: JobsStatsProps) {
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
    if (variant === 'compact') {
      return (
        <div className={`flex flex-wrap items-center gap-2 sm:gap-3 ${className}`}>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-8 sm:h-9 w-28 sm:w-32 bg-slate-200/70 rounded-full animate-pulse" />
          ))}
        </div>
      )
    }
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
    if (variant === 'compact') {
      return (
        <div className={`flex flex-wrap items-center gap-2 sm:gap-3 ${className}`}>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-8 sm:h-9 w-28 sm:w-32 bg-red-100 text-red-700 rounded-full px-3 flex items-center justify-center text-xs sm:text-sm">
              Error
            </div>
          ))}
        </div>
      )
    }
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
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      value: `${stats.totalCompanies}+`,
      label: 'Companies',
      description: 'Hiring partners'
    },
    {
      icon: MapPin,
      iconBg: 'bg-teal-100',
      iconColor: 'text-teal-600',
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

  if (variant === 'compact') {
    return (
      <div className={`flex flex-wrap items-center gap-2 sm:gap-3 ${className}`}>
        {statsItems.map((item, index) => (
          <div key={index} className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-full border border-slate-200 bg-white shadow-sm">
            <div className={`p-1.5 ${item.iconBg} rounded-md`}>
              <item.icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${item.iconColor}`} />
            </div>
            <span className="text-[11px] sm:text-xs font-semibold text-slate-900">{item.value}</span>
            <span className="hidden sm:inline text-[11px] text-slate-600">{item.label}</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={`grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mt-4 sm:mt-6 md:mt-8 ${className}`}>
      {statsItems.map((item, index) => (
        <div key={index} className="group relative bg-gradient-to-br from-white to-slate-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-slate-200/50 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 overflow-hidden">
          <div className={`absolute inset-0 bg-gradient-to-br ${item.iconColor === 'text-green-600' ? 'from-green-500/5 to-emerald-500/5' : item.iconColor === 'text-emerald-600' ? 'from-emerald-500/5 to-teal-500/5' : item.iconColor === 'text-teal-600' ? 'from-teal-500/5 to-green-500/5' : 'from-orange-500/5 to-amber-500/5'} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
          <div className="relative">
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2.5 sm:p-3 ${item.iconBg} rounded-xl shadow-md group-hover:scale-110 transition-transform duration-300`}>
                <item.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${item.iconColor}`} />
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-semibold ${item.iconColor === 'text-green-600' ? 'bg-green-100 text-green-700' : item.iconColor === 'text-emerald-600' ? 'bg-emerald-100 text-emerald-700' : item.iconColor === 'text-teal-600' ? 'bg-teal-100 text-teal-700' : 'bg-orange-100 text-orange-700'}`}>
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
            <div className={`absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-br ${item.iconBg} opacity-5 rounded-tl-full`}></div>
          </div>
        </div>
      ))}
    </div>
  )
}
