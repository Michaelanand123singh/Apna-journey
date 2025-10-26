'use client'

import { useState, useEffect } from 'react'
import { Briefcase, Newspaper, User, FileText, Clock } from 'lucide-react'

interface ActivityItem {
  id: string
  type: 'job' | 'news' | 'user' | 'application'
  title: string
  description: string
  timestamp: string
  status?: string
}

export default function RecentActivity() {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRecentActivity()
  }, [])

  const fetchRecentActivity = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('adminToken')
      
      const response = await fetch('/api/admin/activity', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setActivities(data.data)
        }
      }
    } catch (error) {
      console.error('Error fetching recent activity:', error)
    } finally {
      setLoading(false)
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'job':
        return Briefcase
      case 'news':
        return Newspaper
      case 'user':
        return User
      case 'application':
        return FileText
      default:
        return Clock
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'job':
        return 'text-blue-600 bg-blue-100'
      case 'news':
        return 'text-purple-600 bg-purple-100'
      case 'user':
        return 'text-green-600 bg-green-100'
      case 'application':
        return 'text-orange-600 bg-orange-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3 animate-pulse">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white p-4 sm:p-4 lg:p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 sm:mb-4">Recent Activity</h3>
      <div className="space-y-4 sm:space-y-4">
        {activities.length === 0 ? (
          <div className="text-center py-6 sm:py-8">
            <Clock className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
            <p className="text-sm sm:text-base text-gray-500">No recent activity</p>
          </div>
        ) : (
          activities.map((activity) => {
            const Icon = getActivityIcon(activity.type)
            return (
              <div key={activity.id} className="flex items-start space-x-3 sm:space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <div className={`p-2 sm:p-2 rounded-xl ${getActivityColor(activity.type)} flex-shrink-0`}>
                  <Icon className="w-4 h-4 sm:w-4 sm:h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm sm:text-sm font-medium text-gray-900 truncate mb-1">
                    {activity.title}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600 truncate mb-2">
                    {activity.description}
                  </p>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">
                      {formatTimeAgo(activity.timestamp)}
                    </span>
                    {activity.status && (
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        activity.status === 'pending' 
                          ? 'bg-yellow-100 text-yellow-800'
                          : activity.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {activity.status}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
      {activities.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <a
            href="#"
            className="text-sm text-primary-600 hover:text-primary-500 font-medium"
          >
            View all activity →
          </a>
        </div>
      )}
    </div>
  )
}
