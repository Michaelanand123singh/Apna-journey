'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  User, 
  Briefcase, 
  FileText, 
  Settings, 
  Plus,
  Eye,
  Edit,
  Trash2,
  Calendar,
  MapPin,
  Newspaper,
  Globe
} from 'lucide-react'
import Link from 'next/link'
import PageLoader, { CardLoader } from '@/components/shared/PageLoader'
import LoadingButton from '@/components/shared/LoadingButton'
import { useLoading } from '@/hooks/useLoading'

interface UserData {
  _id: string
  name: string
  email: string
  phone?: string
  role: string
  status: string
  resumeUrl?: string
  createdAt: string
}

interface JobApplication {
  _id: string
  jobId: {
    _id: string
    title: string
    company: string
    location: string
    jobType: string
  }
  status: string
  appliedAt: string
}

interface PostedJob {
  _id: string
  title: string
  company: string
  location: string
  jobType: string
  status: 'pending' | 'approved' | 'rejected'
  views: number
  applicationCount: number
  rejectionReason?: string
  reviewedBy?: string
  reviewedAt?: string
  createdAt: string
}

interface PostedNews {
  _id: string
  title: string
  excerpt: string
  category: string
  status: 'draft' | 'published' | 'pending' | 'approved' | 'rejected'
  views: number
  isFeatured: boolean
  rejectionReason?: string
  reviewedBy?: string
  reviewedAt?: string
  createdAt: string
}

export default function UserDashboard() {
  const router = useRouter()
  const { isLoading, withLoading } = useLoading()
  const [user, setUser] = useState<UserData | null>(null)
  const [applications, setApplications] = useState<JobApplication[]>([])
  const [postedJobs, setPostedJobs] = useState<PostedJob[]>([])
  const [postedNews, setPostedNews] = useState<PostedNews[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    checkAuth()
    fetchUserData()
  }, [])

  const checkAuth = () => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (!token || !userData) {
      router.push('/auth/login')
      return
    }
    
    setUser(JSON.parse(userData))
  }

  const fetchUserData = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      
      // Fetch applications
      const applicationsResponse = await fetch('/api/user/applications', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (applicationsResponse.ok) {
        const applicationsData = await applicationsResponse.json()
        if (applicationsData.success) {
          setApplications(applicationsData.data)
        }
      }
      
      // Fetch posted jobs
      const jobsResponse = await fetch('/api/user/jobs', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (jobsResponse.ok) {
        const jobsData = await jobsResponse.json()
        if (jobsData.success) {
          setPostedJobs(jobsData.data)
        }
      }
      
      // Fetch posted news
      const newsResponse = await fetch('/api/user/news', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (newsResponse.ok) {
        const newsData = await newsResponse.json()
        if (newsData.success) {
          setPostedNews(newsData.data)
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/')
  }

  const getStatusColor = (status: string) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'reviewed': 'bg-blue-100 text-blue-800',
      'shortlisted': 'bg-green-100 text-green-800',
      'rejected': 'bg-red-100 text-red-800',
      'approved': 'bg-green-100 text-green-800',
      'draft': 'bg-gray-100 text-gray-800',
      'published': 'bg-green-100 text-green-800'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getContentStatusColor = (status: string) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'approved': 'bg-green-100 text-green-800',
      'rejected': 'bg-red-100 text-red-800',
      'draft': 'bg-gray-100 text-gray-800',
      'published': 'bg-blue-100 text-blue-800'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const deleteJob = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
      return
    }

    await withLoading('deleteJob', async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch(`/api/jobs/${jobId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.ok) {
          setPostedJobs(prev => prev.filter(job => job._id !== jobId))
        } else {
          alert('Failed to delete job. Please try again.')
        }
      } catch (error) {
        console.error('Error deleting job:', error)
        alert('Failed to delete job. Please try again.')
      }
    })
  }

  const deleteNews = async (newsId: string) => {
    if (!confirm('Are you sure you want to delete this news article? This action cannot be undone.')) {
      return
    }

    await withLoading('deleteNews', async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch(`/api/user/news/${newsId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.ok) {
          setPostedNews(prev => prev.filter(news => news._id !== newsId))
        } else {
          alert('Failed to delete news article. Please try again.')
        }
      } catch (error) {
        console.error('Error deleting news article:', error)
        alert('Failed to delete news article. Please try again.')
      }
    })
  }

  if (loading) {
    return <PageLoader text="Loading dashboard..." />
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome, {user.name}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-semibold text-gray-800">{user.name}</h3>
                  <p className="text-xs sm:text-sm text-gray-600">{user.email}</p>
                </div>
              </div>

              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === 'overview'
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <User className="w-5 h-5" />
                  <span>Overview</span>
                </button>
                <button
                  onClick={() => setActiveTab('applications')}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === 'applications'
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <FileText className="w-5 h-5" />
                  <span>My Applications</span>
                </button>
                <button
                  onClick={() => setActiveTab('jobs')}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === 'jobs'
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Briefcase className="w-5 h-5" />
                  <span>My Jobs</span>
                </button>
                <button
                  onClick={() => setActiveTab('news')}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === 'news'
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Newspaper className="w-5 h-5" />
                  <span>My News</span>
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === 'settings'
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Settings className="w-5 h-5" />
                  <span>Settings</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'overview' && (
              <div className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                      </div>
                      <div className="ml-3 sm:ml-4">
                        <p className="text-xs sm:text-sm font-medium text-gray-600">Applications</p>
                        <p className="text-lg sm:text-2xl font-semibold text-gray-900">{applications.length}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                    <div className="flex items-center">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                      </div>
                      <div className="ml-3 sm:ml-4">
                        <p className="text-xs sm:text-sm font-medium text-gray-600">Jobs Posted</p>
                        <p className="text-lg sm:text-2xl font-semibold text-gray-900">{postedJobs.length}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                    <div className="flex items-center">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Eye className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                      </div>
                      <div className="ml-3 sm:ml-4">
                        <p className="text-xs sm:text-sm font-medium text-gray-600">Total Views</p>
                        <p className="text-lg sm:text-2xl font-semibold text-gray-900">
                          {postedJobs.reduce((sum, job) => sum + job.views, 0) + postedNews.reduce((sum, news) => sum + news.views, 0)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                    <div className="flex items-center">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <Newspaper className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
                      </div>
                      <div className="ml-3 sm:ml-4">
                        <p className="text-xs sm:text-sm font-medium text-gray-600">News Articles</p>
                        <p className="text-lg sm:text-2xl font-semibold text-gray-900">{postedNews.length}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800">Quick Actions</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    <Link
                      href="/user/post-job"
                      className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Plus className="w-5 h-5 text-primary-500 mr-3" />
                      <div>
                        <h4 className="font-medium text-gray-800">Post a New Job</h4>
                        <p className="text-sm text-gray-600">Share job opportunities with the community</p>
                      </div>
                    </Link>
                    <Link
                      href="/user/post-news"
                      className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Newspaper className="w-5 h-5 text-primary-500 mr-3" />
                      <div>
                        <h4 className="font-medium text-gray-800">Post News Article</h4>
                        <p className="text-sm text-gray-600">Share news with the community</p>
                      </div>
                    </Link>
                    <Link
                      href="/jobs"
                      className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Briefcase className="w-5 h-5 text-primary-500 mr-3" />
                      <div>
                        <h4 className="font-medium text-gray-800">Browse Jobs</h4>
                        <p className="text-sm text-gray-600">Find your next career opportunity</p>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'applications' && (
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800">My Applications</h3>
                </div>
                <div className="p-6">
                  {applications.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h4 className="text-lg font-medium text-gray-800 mb-2">No Applications Yet</h4>
                      <p className="text-gray-600 mb-4">You haven't applied for any jobs yet.</p>
                      <Link
                        href="/jobs"
                        className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
                      >
                        Browse Jobs
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {applications.map((application) => (
                        <div key={application._id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-800">{application.jobId.title}</h4>
                              <p className="text-gray-600">{application.jobId.company}</p>
                              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                                <div className="flex items-center">
                                  <MapPin className="w-4 h-4 mr-1" />
                                  {application.jobId.location.replace('-', ' ').toUpperCase()}
                                </div>
                                <div className="flex items-center">
                                  <Calendar className="w-4 h-4 mr-1" />
                                  Applied {formatDate(application.appliedAt)}
                                </div>
                              </div>
                            </div>
                            <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(application.status)}`}>
                              {application.status.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'jobs' && (
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-800">My Posted Jobs</h3>
                    <Link
                      href="/user/post-job"
                      className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors flex items-center"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Post New Job
                    </Link>
                  </div>
                </div>
                <div className="p-6">
                  {postedJobs.length === 0 ? (
                    <div className="text-center py-8">
                      <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h4 className="text-lg font-medium text-gray-800 mb-2">No Jobs Posted Yet</h4>
                      <p className="text-gray-600 mb-4">Start by posting your first job opportunity.</p>
                      <Link
                        href="/user/post-job"
                        className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
                      >
                        Post Your First Job
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {postedJobs.map((job) => (
                        <div key={job._id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-800">{job.title}</h4>
                              <p className="text-gray-600">{job.company}</p>
                              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                                <div className="flex items-center">
                                  <MapPin className="w-4 h-4 mr-1" />
                                  {job.location.replace('-', ' ').toUpperCase()}
                                </div>
                                <div className="flex items-center">
                                  <Eye className="w-4 h-4 mr-1" />
                                  {job.views} views
                                </div>
                                <div className="flex items-center">
                                  <FileText className="w-4 h-4 mr-1" />
                                  {job.applicationCount} applications
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col items-end space-y-2">
                              <span className={`px-3 py-1 text-sm font-medium rounded-full ${getContentStatusColor(job.status)}`}>
                                {job.status.toUpperCase()}
                              </span>
                              {job.status === 'rejected' && job.rejectionReason && (
                                <div className="text-xs text-red-600 max-w-xs text-right">
                                  <strong>Reason:</strong> {job.rejectionReason}
                                </div>
                              )}
                              {job.reviewedAt && (
                                <div className="text-xs text-gray-500">
                                  Reviewed: {formatDate(job.reviewedAt)}
                                </div>
                              )}
                              <div className="flex space-x-1">
                                <button className="p-1 text-gray-400 hover:text-gray-600">
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button className="p-1 text-gray-400 hover:text-gray-600">
                                  <Edit className="w-4 h-4" />
                                </button>
                                <LoadingButton
                                  onClick={() => deleteJob(job._id)}
                                  loading={isLoading('deleteJob')}
                                  variant="danger"
                                  size="sm"
                                  className="p-1"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </LoadingButton>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'news' && (
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-800">My News Articles</h3>
                    <Link
                      href="/user/post-news"
                      className="inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700 transition-colors"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Post New Article
                    </Link>
                  </div>
                </div>
                <div className="p-6">
                  {postedNews.length === 0 ? (
                    <div className="text-center py-12">
                      <Newspaper className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No news articles yet</h3>
                      <p className="text-gray-600 mb-6">Start sharing news with the community</p>
                      <Link
                        href="/user/post-news"
                        className="inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700 transition-colors"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Post Your First Article
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {postedNews.map((news) => (
                        <div key={news._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                              <h4 className="text-lg font-semibold text-gray-900 mb-2">{news.title}</h4>
                              <p className="text-gray-600 mb-3 line-clamp-2">{news.excerpt}</p>
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <span className="flex items-center">
                                  <Globe className="w-4 h-4 mr-1" />
                                  {news.category}
                                </span>
                                <span className="flex items-center">
                                  <Eye className="w-4 h-4 mr-1" />
                                  {news.views} views
                                </span>
                                <span className="flex items-center">
                                  <Calendar className="w-4 h-4 mr-1" />
                                  {formatDate(news.createdAt)}
                                </span>
                                {news.isFeatured && (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                    Featured
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex flex-col items-end space-y-2 ml-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getContentStatusColor(news.status)}`}>
                                {news.status}
                              </span>
                              {news.status === 'rejected' && news.rejectionReason && (
                                <div className="text-xs text-red-600 max-w-xs text-right">
                                  <strong>Reason:</strong> {news.rejectionReason}
                                </div>
                              )}
                              {news.reviewedAt && (
                                <div className="text-xs text-gray-500">
                                  Reviewed: {formatDate(news.reviewedAt)}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => window.open(`/news/${news._id}`, '_blank')}
                                className="inline-flex items-center px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                View
                              </button>
                              <button
                                onClick={() => {/* TODO: Implement edit functionality */}}
                                className="inline-flex items-center px-3 py-1.5 text-sm text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-md transition-colors"
                              >
                                <Edit className="w-4 h-4 mr-1" />
                                Edit
                              </button>
                            </div>
                            <LoadingButton
                              onClick={() => deleteNews(news._id)}
                              loading={isLoading('deleteNews')}
                              loadingText="Deleting..."
                              className="inline-flex items-center px-3 py-1.5 text-sm text-red-600 hover:text-red-900 hover:bg-red-50 rounded-md transition-colors"
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Delete
                            </LoadingButton>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800">Account Settings</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={user.name}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={user.email}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={user.phone || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Resume URL
                      </label>
                      <input
                        type="url"
                        value={user.resumeUrl || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        readOnly
                      />
                    </div>
                    <div className="pt-4">
                      <button className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors">
                        Edit Profile
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
