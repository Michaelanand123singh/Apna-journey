'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
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
  Globe,
  Menu,
  X
} from 'lucide-react'
import Link from 'next/link'
import PageLoader from '@/components/shared/PageLoader'
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showPostJobForm, setShowPostJobForm] = useState(false)
  const [showPostNewsForm, setShowPostNewsForm] = useState(false)

  useEffect(() => {
    checkAuth()
    fetchUserData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      {/* Mobile Header */}
      <div className="bg-white shadow lg:hidden sticky top-0 z-50">
        <div className="px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <Image 
                src="/logo1.png" 
                alt="Apna Journey Logo" 
                width={32}
                height={32}
                className="object-contain"
              />
              <h1 className="text-lg font-bold text-gray-800">Dashboard</h1>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-3 py-1.5 text-sm rounded-lg hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Image 
                src="/logo1.png" 
                alt="Apna Journey Logo" 
                width={40}
                height={40}
                className="object-contain"
              />
              <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            </div>
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

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Mobile Sidebar Drawer */}
        <div className={`lg:hidden fixed inset-0 z-40 ${isMobileMenuOpen ? '' : 'pointer-events-none'}`}>
          {/* Overlay */}
          <div 
            className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'}`}
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Drawer */}
          <div className={`fixed left-0 top-0 bottom-0 w-80 max-w-[80vw] bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="p-4">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-primary-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-800 truncate">{user.name}</h3>
                  <p className="text-xs text-gray-600 truncate">{user.email}</p>
                </div>
              </div>

              <nav className="space-y-2">
                <button
                  onClick={() => { setActiveTab('overview'); setIsMobileMenuOpen(false); }}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                    activeTab === 'overview'
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <User className="w-5 h-5" />
                  <span>Overview</span>
                </button>
                <button
                  onClick={() => { setActiveTab('applications'); setIsMobileMenuOpen(false); }}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                    activeTab === 'applications'
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <FileText className="w-5 h-5" />
                  <span>My Applications</span>
                </button>
                <button
                  onClick={() => { setActiveTab('jobs'); setIsMobileMenuOpen(false); }}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                    activeTab === 'jobs'
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Briefcase className="w-5 h-5" />
                  <span>My Jobs</span>
                </button>
                <button
                  onClick={() => { setActiveTab('news'); setIsMobileMenuOpen(false); }}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                    activeTab === 'news'
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Newspaper className="w-5 h-5" />
                  <span>My News</span>
                </button>
                <button
                  onClick={() => { setActiveTab('settings'); setIsMobileMenuOpen(false); }}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
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
        </div>

        <div className="grid lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 sticky top-8">
              <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm sm:text-base font-semibold text-gray-800 truncate">{user.name}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 truncate">{user.email}</p>
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
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                  <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 lg:p-6">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                        <FileText className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-blue-600" />
                      </div>
                      <div className="ml-2 sm:ml-3 lg:ml-4 min-w-0">
                        <p className="text-xs font-medium text-gray-600 truncate">Applications</p>
                        <p className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900">{applications.length}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 lg:p-6">
                    <div className="flex items-center">
                      <div className="p-2 bg-green-100 rounded-lg flex-shrink-0">
                        <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-green-600" />
                      </div>
                      <div className="ml-2 sm:ml-3 lg:ml-4 min-w-0">
                        <p className="text-xs font-medium text-gray-600 truncate">Jobs Posted</p>
                        <p className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900">{postedJobs.length}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 lg:p-6 col-span-2 lg:col-span-1">
                    <div className="flex items-center">
                      <div className="p-2 bg-purple-100 rounded-lg flex-shrink-0">
                        <Eye className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-purple-600" />
                      </div>
                      <div className="ml-2 sm:ml-3 lg:ml-4 min-w-0">
                        <p className="text-xs font-medium text-gray-600 truncate">Total Views</p>
                        <p className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900">
                          {postedJobs.reduce((sum, job) => sum + job.views, 0) + postedNews.reduce((sum, news) => sum + news.views, 0)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 lg:p-6 col-span-2 lg:col-span-1">
                    <div className="flex items-center">
                      <div className="p-2 bg-orange-100 rounded-lg flex-shrink-0">
                        <Newspaper className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-orange-600" />
                      </div>
                      <div className="ml-2 sm:ml-3 lg:ml-4 min-w-0">
                        <p className="text-xs font-medium text-gray-600 truncate">News Articles</p>
                        <p className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900">{postedNews.length}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800">Quick Actions</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    <button
                      onClick={() => setShowPostJobForm(true)}
                      className="flex items-start sm:items-center p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left w-full"
                    >
                      <Plus className="w-5 h-5 text-primary-500 mr-3 flex-shrink-0 mt-1 sm:mt-0" />
                      <div className="min-w-0">
                        <h4 className="font-medium text-gray-800 text-sm sm:text-base">Post a New Job</h4>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1">Share job opportunities with the community</p>
                      </div>
                    </button>
                    <button
                      onClick={() => setShowPostNewsForm(true)}
                      className="flex items-start sm:items-center p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left w-full"
                    >
                      <Newspaper className="w-5 h-5 text-primary-500 mr-3 flex-shrink-0 mt-1 sm:mt-0" />
                      <div className="min-w-0">
                        <h4 className="font-medium text-gray-800 text-sm sm:text-base">Post News Article</h4>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1">Share news with the community</p>
                      </div>
                    </button>
                    <Link
                      href="/jobs"
                      className="flex items-start sm:items-center p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors col-span-1 sm:col-span-2 lg:col-span-1"
                    >
                      <Briefcase className="w-5 h-5 text-primary-500 mr-3 flex-shrink-0 mt-1 sm:mt-0" />
                      <div className="min-w-0">
                        <h4 className="font-medium text-gray-800 text-sm sm:text-base">Browse Jobs</h4>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1">Find your next career opportunity</p>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'applications' && (
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-4 sm:p-6 border-b border-gray-200">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800">My Applications</h3>
                </div>
                <div className="p-4 sm:p-6">
                  {applications.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h4 className="text-lg font-medium text-gray-800 mb-2">No Applications Yet</h4>
                      <p className="text-gray-600 mb-4">You haven&apos;t applied for any jobs yet.</p>
                      <Link
                        href="/jobs"
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Browse Jobs
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3 sm:space-y-4">
                      {applications.map((application) => (
                        <div key={application._id} className="border border-gray-200 rounded-lg p-3 sm:p-4">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-gray-800 truncate">{application.jobId.title}</h4>
                              <p className="text-gray-600 truncate">{application.jobId.company}</p>
                              <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2 text-xs sm:text-sm text-gray-500">
                                <div className="flex items-center">
                                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                                  <span className="truncate">{application.jobId.location.replace('-', ' ').toUpperCase()}</span>
                                </div>
                                <div className="flex items-center">
                                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                                  <span>Applied {formatDate(application.appliedAt)}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex-shrink-0">
                              <span className={`inline-block px-3 py-1 text-xs sm:text-sm font-medium rounded-full whitespace-nowrap ${getStatusColor(application.status)}`}>
                                {application.status.toUpperCase()}
                              </span>
                            </div>
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
                <div className="p-4 sm:p-6 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800">My Posted Jobs</h3>
                    <button
                      onClick={() => setShowPostJobForm(true)}
                      className="bg-primary-500 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-primary-600 transition-colors flex items-center justify-center text-sm"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Post New Job
                    </button>
                  </div>
                </div>
                <div className="p-4 sm:p-6">
                  {postedJobs.length === 0 ? (
                    <div className="text-center py-8">
                      <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h4 className="text-lg font-medium text-gray-800 mb-2">No Jobs Posted Yet</h4>
                      <p className="text-gray-600 mb-4">Start by posting your first job opportunity.</p>
                      <button
                        onClick={() => setShowPostJobForm(true)}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Post Your First Job
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3 sm:space-y-4">
                      {postedJobs.map((job) => (
                        <div key={job._id} className="border border-gray-200 rounded-lg p-3 sm:p-4">
                          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-3">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-gray-800 truncate">{job.title}</h4>
                              <p className="text-gray-600 truncate">{job.company}</p>
                              <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2 text-xs sm:text-sm text-gray-500">
                                <div className="flex items-center">
                                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                                  <span className="truncate">{job.location.replace('-', ' ').toUpperCase()}</span>
                                </div>
                                <div className="flex items-center">
                                  <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                                  <span>{job.views} views</span>
                                </div>
                                <div className="flex items-center">
                                  <FileText className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                                  <span>{job.applicationCount} applications</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2 sm:gap-3">
                              <div className="flex flex-col sm:items-end gap-1">
                                <span className={`inline-block px-3 py-1 text-xs sm:text-sm font-medium rounded-full whitespace-nowrap ${getContentStatusColor(job.status)}`}>
                                  {job.status.toUpperCase()}
                                </span>
                                {job.status === 'rejected' && job.rejectionReason && (
                                  <div className="text-xs text-red-600 text-left sm:text-right max-w-full sm:max-w-xs">
                                    <strong>Reason:</strong> {job.rejectionReason}
                                  </div>
                                )}
                                {job.reviewedAt && (
                                  <div className="text-xs text-gray-500 text-left sm:text-right">
                                    Reviewed: {formatDate(job.reviewedAt)}
                                  </div>
                                )}
                              </div>
                              <div className="flex space-x-1 sm:space-x-2">
                                <button className="p-1.5 sm:p-1 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-100">
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button className="p-1.5 sm:p-1 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-100">
                                  <Edit className="w-4 h-4" />
                                </button>
                                <LoadingButton
                                  onClick={() => deleteJob(job._id)}
                                  loading={isLoading('deleteJob')}
                                  variant="danger"
                                  size="sm"
                                  className="p-1.5 sm:p-1"
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
                <div className="p-4 sm:p-6 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800">My News Articles</h3>
                    <button
                      onClick={() => setShowPostNewsForm(true)}
                      className="inline-flex items-center justify-center px-3 py-2 sm:px-4 sm:py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700 transition-colors"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Post New Article
                    </button>
                  </div>
                </div>
                <div className="p-4 sm:p-6">
                  {postedNews.length === 0 ? (
                    <div className="text-center py-12">
                      <Newspaper className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No news articles yet</h3>
                      <p className="text-gray-600 mb-6">Start sharing news with the community</p>
                      <button
                        onClick={() => setShowPostNewsForm(true)}
                        className="inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700 transition-colors"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Post Your First Article
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3 sm:space-y-4">
                      {postedNews.map((news) => (
                        <div key={news._id} className="border border-gray-200 rounded-lg p-3 sm:p-6 hover:shadow-md transition-shadow">
                          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-3 mb-3 sm:mb-4">
                            <div className="flex-1 min-w-0">
                              <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 truncate">{news.title}</h4>
                              <p className="text-gray-600 mb-2 sm:mb-3 line-clamp-2 text-sm sm:text-base">{news.excerpt}</p>
                              <div className="flex flex-wrap gap-x-3 sm:gap-x-4 gap-y-2 text-xs sm:text-sm text-gray-500">
                                <span className="flex items-center">
                                  <Globe className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                                  <span className="truncate">{news.category}</span>
                                </span>
                                <span className="flex items-center">
                                  <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                                  <span>{news.views} views</span>
                                </span>
                                <span className="flex items-center">
                                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                                  <span>{formatDate(news.createdAt)}</span>
                                </span>
                                {news.isFeatured && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                    Featured
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex flex-col sm:items-end space-y-1 sm:space-y-2 lg:ml-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${getContentStatusColor(news.status)}`}>
                                {news.status}
                              </span>
                              {news.status === 'rejected' && news.rejectionReason && (
                                <div className="text-xs text-red-600 text-left sm:text-right max-w-full sm:max-w-xs">
                                  <strong>Reason:</strong> {news.rejectionReason}
                                </div>
                              )}
                              {news.reviewedAt && (
                                <div className="text-xs text-gray-500 text-left sm:text-right">
                                  Reviewed: {formatDate(news.reviewedAt)}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => window.open(`/news/${news._id}`, '_blank')}
                                className="inline-flex items-center px-3 py-1.5 text-xs sm:text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                              >
                                <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                View
                              </button>
                              <button
                                onClick={() => {/* TODO: Implement edit functionality */}}
                                className="inline-flex items-center px-3 py-1.5 text-xs sm:text-sm text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-md transition-colors"
                              >
                                <Edit className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                Edit
                              </button>
                            </div>
                            <LoadingButton
                              onClick={() => deleteNews(news._id)}
                              loading={isLoading('deleteNews')}
                              loadingText="Deleting..."
                              className="inline-flex items-center px-3 py-1.5 text-xs sm:text-sm text-red-600 hover:text-red-900 hover:bg-red-50 rounded-md transition-colors"
                            >
                              <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
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
                <div className="p-4 sm:p-6 border-b border-gray-200">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800">Account Settings</h3>
                </div>
                <div className="p-4 sm:p-6">
                  <div className="space-y-4 sm:space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={user.name}
                        className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
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
                        className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
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
                        className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
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
                        className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 break-all"
                        readOnly
                      />
                    </div>
                    <div className="pt-2 sm:pt-4">
                      <button className="w-full sm:w-auto bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base">
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

      {/* Post Job Form Modal */}
      {showPostJobForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
          <div className="min-h-screen px-4 py-8">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
                <h2 className="text-xl font-bold text-gray-800">Post a New Job</h2>
                <button
                  onClick={() => setShowPostJobForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6">
                <iframe
                  src="/user/post-job"
                  className="w-full h-[calc(100vh-200px)] border-0"
                  title="Post Job Form"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Post News Form Modal */}
      {showPostNewsForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
          <div className="min-h-screen px-4 py-8">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
                <h2 className="text-xl font-bold text-gray-800">Post a News Article</h2>
                <button
                  onClick={() => setShowPostNewsForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6">
                <iframe
                  src="/user/post-news"
                  className="w-full h-[calc(100vh-200px)] border-0"
                  title="Post News Form"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
