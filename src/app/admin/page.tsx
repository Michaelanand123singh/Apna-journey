'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import StatsCard from '@/components/admin/dashboard/StatsCard'
import RecentActivity from '@/components/admin/dashboard/RecentActivity'
import { 
  Briefcase, 
  Newspaper, 
  Users, 
  FileText,
  TrendingUp,
  Eye,
  Calendar
} from 'lucide-react'
import PageLoader, { CardLoader } from '@/components/shared/PageLoader'

interface DashboardStats {
  totalJobs: number
  activeJobs: number
  pendingJobs: number
  totalNews: number
  publishedNews: number
  draftNews: number
  totalUsers: number
  totalApplications: number
  pageViews: {
    today: number
    thisWeek: number
    thisMonth: number
  }
}

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
    fetchStats()
  }, [])

  const checkAuth = () => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin/login')
    }
  }

  const fetchStats = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('adminToken')
      
      const response = await fetch('/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setStats(data.data)
        }
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-2 sm:p-4 lg:p-6">
        <div className="animate-pulse">
          <div className="h-6 sm:h-8 bg-gray-200 rounded w-1/3 sm:w-1/4 mb-4 sm:mb-6"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
            {[...Array(8)].map((_, i) => (
              <CardLoader key={i} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-3 sm:p-4 lg:p-6">
      {/* Header */}
      <div className="mb-6 sm:mb-6 lg:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-2 sm:mt-2">Welcome back! Here's what's happening with your platform.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-6 lg:mb-8">
        <StatsCard
          title="Total Jobs"
          value={stats?.totalJobs || 0}
          icon={Briefcase}
          color="blue"
          change="+12%"
          changeType="positive"
        />
        <StatsCard
          title="Active Jobs"
          value={stats?.activeJobs || 0}
          icon={TrendingUp}
          color="green"
          change="+8%"
          changeType="positive"
        />
        <StatsCard
          title="Pending Jobs"
          value={stats?.pendingJobs || 0}
          icon={FileText}
          color="yellow"
          change="+3"
          changeType="neutral"
        />
        <StatsCard
          title="Total News"
          value={stats?.totalNews || 0}
          icon={Newspaper}
          color="purple"
          change="+15%"
          changeType="positive"
        />
        <StatsCard
          title="Published News"
          value={stats?.publishedNews || 0}
          icon={Eye}
          color="green"
          change="+22%"
          changeType="positive"
        />
        <StatsCard
          title="Draft News"
          value={stats?.draftNews || 0}
          icon={FileText}
          color="gray"
          change="+2"
          changeType="neutral"
        />
        <StatsCard
          title="Total Users"
          value={stats?.totalUsers || 0}
          icon={Users}
          color="indigo"
          change="+18%"
          changeType="positive"
        />
        <StatsCard
          title="Applications"
          value={stats?.totalApplications || 0}
          icon={FileText}
          color="pink"
          change="+25%"
          changeType="positive"
        />
      </div>

      {/* Page Views */}
      <div className="grid grid-cols-3 sm:grid-cols-3 gap-2 sm:gap-4 lg:gap-6 mb-6 sm:mb-6 lg:mb-8">
        <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
          <div className="text-center">
            <div className="p-2 bg-blue-100 rounded-xl mx-auto w-fit mb-2">
              <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            </div>
            <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Today</p>
            <p className="text-lg sm:text-xl font-bold text-gray-900">{stats?.pageViews?.today || 0}</p>
          </div>
        </div>
        <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
          <div className="text-center">
            <div className="p-2 bg-green-100 rounded-xl mx-auto w-fit mb-2">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
            </div>
            <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">This Week</p>
            <p className="text-lg sm:text-xl font-bold text-gray-900">{stats?.pageViews?.thisWeek || 0}</p>
          </div>
        </div>
        <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
          <div className="text-center">
            <div className="p-2 bg-purple-100 rounded-xl mx-auto w-fit mb-2">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
            </div>
            <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">This Month</p>
            <p className="text-lg sm:text-xl font-bold text-gray-900">{stats?.pageViews?.thisMonth || 0}</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-4 lg:gap-6">
        <RecentActivity />
        <div className="bg-white p-4 sm:p-4 lg:p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 sm:mb-4">Quick Actions</h3>
          <div className="space-y-3 sm:space-y-3">
            <a
              href="/admin/news/create"
              className="block p-3 sm:p-3 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-primary-200 transition-all duration-200"
            >
              <div className="flex items-center">
                <Newspaper className="w-5 h-5 sm:w-5 sm:h-5 text-primary-500 mr-3 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm sm:text-base font-medium text-gray-800 truncate">Create News Article</p>
                  <p className="text-xs sm:text-sm text-gray-600 truncate">Write and publish a new article</p>
                </div>
              </div>
            </a>
            <a
              href="/admin/jobs/pending"
              className="block p-3 sm:p-3 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-primary-200 transition-all duration-200"
            >
              <div className="flex items-center">
                <Briefcase className="w-5 h-5 sm:w-5 sm:h-5 text-primary-500 mr-3 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm sm:text-base font-medium text-gray-800 truncate">Review Pending Jobs</p>
                  <p className="text-xs sm:text-sm text-gray-600 truncate">Approve or reject job postings</p>
                </div>
              </div>
            </a>
            <a
              href="/admin/users"
              className="block p-3 sm:p-3 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-primary-200 transition-all duration-200"
            >
              <div className="flex items-center">
                <Users className="w-5 h-5 sm:w-5 sm:h-5 text-primary-500 mr-3 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm sm:text-base font-medium text-gray-800 truncate">Manage Users</p>
                  <p className="text-xs sm:text-sm text-gray-600 truncate">View and manage user accounts</p>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}