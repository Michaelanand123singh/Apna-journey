'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Briefcase, 
  Search, 
  Filter, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock,
  MapPin,
  Calendar,
  Building,
  MoreVertical
} from 'lucide-react'

interface Job {
  _id: string
  title: string
  company: string
  location: string
  jobType: string
  salary: string
  status: 'pending' | 'approved' | 'rejected'
  postedBy: {
    name: string
    email: string
  }
  createdAt: string
  applicationDeadline: string
}

export default function AdminJobsPage() {
  const router = useRouter()
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  })

  useEffect(() => {
    checkAuth()
    fetchJobs()
  }, [])

  const checkAuth = () => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin/login')
    }
  }

  const fetchJobs = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('adminToken')
      
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(search && { search }),
        ...(statusFilter && { status: statusFilter })
      })

      const response = await fetch(`/api/admin/jobs?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setJobs(data.data)
          setPagination(data.pagination)
        }
      }
    } catch (error) {
      console.error('Error fetching jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateJobStatus = async (jobId: string, status: string, reason?: string) => {
    try {
      const token = localStorage.getItem('adminToken')
      
      const response = await fetch('/api/admin/jobs', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ jobId, status, reason })
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          fetchJobs() // Refresh the list
        }
      }
    } catch (error) {
      console.error('Error updating job status:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return CheckCircle
      case 'pending':
        return Clock
      case 'rejected':
        return XCircle
      default:
        return Clock
    }
  }

  useEffect(() => {
    fetchJobs()
  }, [search, statusFilter, pagination.page])

  if (loading) {
    return (
      <div className="p-3 sm:p-4 lg:p-6">
        <div className="animate-pulse">
          <div className="h-6 sm:h-8 bg-gray-200 rounded w-1/3 sm:w-1/4 mb-4 sm:mb-6"></div>
          <div className="space-y-3 sm:space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white p-4 sm:p-6 rounded-lg shadow">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
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
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Job Management</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">Manage and moderate job postings</p>
      </div>

      {/* Filters */}
      <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-xl shadow-sm border border-gray-100 mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                placeholder="Search jobs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Jobs List */}
      <div className="space-y-3 sm:space-y-4">
        {jobs.length === 0 ? (
          <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-100 text-center">
            <Briefcase className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">No Jobs Found</h3>
            <p className="text-sm sm:text-base text-gray-600">No jobs match your current filters.</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block space-y-4">
              {jobs.map((job) => {
                const StatusIcon = getStatusIcon(job.status)
                return (
                  <div key={job._id} className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">{job.title}</h3>
                        <div className="flex items-center text-gray-600 mb-2 text-sm sm:text-base">
                          <Building className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span className="mr-4 truncate">{job.company}</span>
                          <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span className="mr-4 truncate">{job.location}</span>
                          <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span>{new Date(job.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-4 text-xs sm:text-sm text-gray-500">
                          <span>Type: {job.jobType}</span>
                          <span>Salary: {job.salary}</span>
                          <span>Posted by: {job.postedBy.name}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <span className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getStatusColor(job.status)}`}>
                          <StatusIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                          {job.status}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="text-xs sm:text-sm text-gray-500">
                        Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}
                      </div>
                      <div className="flex space-x-2">
                        {job.status === 'pending' && (
                          <>
                            <button
                              onClick={() => updateJobStatus(job._id, 'approved')}
                              className="bg-green-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center text-xs sm:text-sm"
                            >
                              <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                              Approve
                            </button>
                            <button
                              onClick={() => {
                                const reason = prompt('Rejection reason (optional):')
                                updateJobStatus(job._id, 'rejected', reason || undefined)
                              }}
                              className="bg-red-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center text-xs sm:text-sm"
                            >
                              <XCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                              Reject
                            </button>
                          </>
                        )}
                        <Link
                          href={`/jobs/${job._id}`}
                          className="bg-gray-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center text-xs sm:text-sm"
                        >
                          <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                          View
                        </Link>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-3">
              {jobs.map((job) => {
                const StatusIcon = getStatusIcon(job.status)
                return (
                  <div key={job._id} className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm sm:text-base font-semibold text-gray-900 line-clamp-2 mb-1">
                          {job.title}
                        </h3>
                        <div className="flex items-center text-xs sm:text-sm text-gray-600 mb-2">
                          <Building className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                          <span className="truncate">{job.company}</span>
                        </div>
                        <div className="flex items-center text-xs sm:text-sm text-gray-600 mb-2">
                          <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                          <span className="truncate">{job.location}</span>
                        </div>
                        <div className="flex items-center text-xs sm:text-sm text-gray-500 mb-2">
                          <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                          <span>{new Date(job.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="text-xs text-gray-500 mb-2">
                          <span className="block">Type: {job.jobType}</span>
                          <span className="block">Salary: {job.salary}</span>
                          <span className="block">Posted by: {job.postedBy.name}</span>
                        </div>
                      </div>
                      <div className="flex-shrink-0 ml-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {job.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-500">
                        Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}
                      </div>
                      <div className="flex items-center space-x-1">
                        {job.status === 'pending' && (
                          <>
                            <button
                              onClick={() => updateJobStatus(job._id, 'approved')}
                              className="bg-green-500 text-white px-2 py-1 rounded text-xs flex items-center"
                            >
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Approve
                            </button>
                            <button
                              onClick={() => {
                                const reason = prompt('Rejection reason (optional):')
                                updateJobStatus(job._id, 'rejected', reason || undefined)
                              }}
                              className="bg-red-500 text-white px-2 py-1 rounded text-xs flex items-center"
                            >
                              <XCircle className="w-3 h-3 mr-1" />
                              Reject
                            </button>
                          </>
                        )}
                        <Link
                          href={`/jobs/${job._id}`}
                          className="bg-gray-500 text-white px-2 py-1 rounded text-xs flex items-center"
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </Link>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="mt-4 sm:mt-6 flex items-center justify-between">
          <div className="text-xs sm:text-sm text-gray-700">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2">
            {pagination.page > 1 && (
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                className="px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Previous
              </button>
            )}
            
            <span className="px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md">
              {pagination.page} of {pagination.pages}
            </span>
            
            {pagination.page < pagination.pages && (
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                className="px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Next
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}