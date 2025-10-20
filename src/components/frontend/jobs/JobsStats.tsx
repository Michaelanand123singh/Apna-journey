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
      <div className={`grid grid-cols-1 md:grid-cols-4 gap-6 mt-8 ${className}`}>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-slate-200 shadow-sm animate-pulse">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-slate-200 rounded-lg"></div>
              <div className="flex-1">
                <div className="h-6 bg-slate-200 rounded w-16 mb-2"></div>
                <div className="h-4 bg-slate-200 rounded w-20"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-4 gap-6 mt-8 ${className}`}>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-slate-200 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <span className="text-red-600 text-sm">!</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">--</p>
                <p className="text-sm text-slate-600">Error</p>
              </div>
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
    <div className={`grid grid-cols-1 md:grid-cols-4 gap-6 mt-8 ${className}`}>
      {statsItems.map((item, index) => (
        <div key={index} className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-3">
            <div className={`p-2 ${item.iconBg} rounded-lg`}>
              <item.icon className={`w-5 h-5 ${item.iconColor}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{item.value}</p>
              <p className="text-sm text-slate-600">{item.label}</p>
              <p className="text-xs text-slate-500">{item.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
