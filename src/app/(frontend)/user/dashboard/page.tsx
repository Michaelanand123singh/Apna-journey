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
  MapPin
} from 'lucide-react'
import Link from 'next/link'

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
  status: string
  views: number
  applicationCount: number
  createdAt: string
}

export default function UserDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<UserData | null>(null)
  const [applications, setApplications] = useState<JobApplication[]>([])
  const [postedJobs, setPostedJobs] = useState<PostedJob[]>([])
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
      'approved': 'bg-green-100 text-green-800'
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
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

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{user.name}</h3>
                  <p className="text-sm text-gray-600">{user.email}</p>
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
              <div className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <FileText className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Applications</p>
                        <p className="text-2xl font-semibold text-gray-900">{applications.length}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Briefcase className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Jobs Posted</p>
                        <p className="text-2xl font-semibold text-gray-900">{postedJobs.length}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Eye className="w-6 h-6 text-purple-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Total Views</p>
                        <p className="text-2xl font-semibold text-gray-900">
                          {postedJobs.reduce((sum, job) => sum + job.views, 0)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Quick Actions</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
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
                            <div className="flex items-center space-x-2">
                              <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(job.status)}`}>
                                {job.status.toUpperCase()}
                              </span>
                              <div className="flex space-x-1">
                                <button className="p-1 text-gray-400 hover:text-gray-600">
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button className="p-1 text-gray-400 hover:text-gray-600">
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button className="p-1 text-gray-400 hover:text-red-600">
                                  <Trash2 className="w-4 h-4" />
                                </button>
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
