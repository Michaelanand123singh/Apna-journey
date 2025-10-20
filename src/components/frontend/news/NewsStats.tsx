'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, Globe, Eye, Clock } from 'lucide-react'

interface NewsStatsProps {
  className?: string
}

interface NewsStatsData {
  totalArticles: number
  publishedArticles: number
  totalLanguages: number
  totalCategories: number
  recentArticles: number
  totalViews: number
  estimatedReaders: number
  updateFrequency: string
}

export default function NewsStats({ className = '' }: NewsStatsProps) {
  const [stats, setStats] = useState<NewsStatsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/stats/news')
      const data = await response.json()
      
      if (data.success) {
        setStats(data.data)
      } else {
        setError(data.message || 'Failed to fetch statistics')
      }
    } catch (err) {
      setError('Failed to fetch statistics')
      console.error('Error fetching news stats:', err)
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
      iconBg: 'bg-indigo-100',
      iconColor: 'text-indigo-600',
      value: `${stats.publishedArticles}+`,
      label: 'Articles',
      description: `${stats.totalArticles} total created`
    },
    {
      icon: Globe,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      value: `${stats.totalLanguages}`,
      label: 'Languages',
      description: 'Multilingual content'
    },
    {
      icon: Eye,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      value: `${Math.floor(stats.estimatedReaders / 1000)}K+`,
      label: 'Readers',
      description: 'Monthly active readers'
    },
    {
      icon: Clock,
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      value: stats.updateFrequency,
      label: 'Updates',
      description: 'Content frequency'
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
