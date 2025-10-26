'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Briefcase, 
  Search, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock,
  MapPin,
  Calendar,
  Building,
  AlertCircle,
  X
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
  description: string
  requirements: string[]
  responsibilities: string[]
}

export default function PendingJobsPage() {
  const router = useRouter()
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    checkAuth()
    fetchPendingJobs()
  }, [])

  const checkAuth = () => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin/login')
    }
  }

  const fetchPendingJobs = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('adminToken')
      
      const response = await fetch('/api/admin/jobs?status=pending', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setJobs(data.data)
        }
      }
    } catch (error) {
      console.error('Error fetching pending jobs:', error)
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
          fetchPendingJobs() // Refresh the list
          setShowModal(false)
          setSelectedJob(null)
        }
      }
    } catch (error) {
      console.error('Error updating job status:', error)
    }
  }

  const openJobDetails = (job: Job) => {
    setSelectedJob(job)
    setShowModal(true)
  }

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
        <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
          <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500" />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Pending Jobs</h1>
        </div>
        <p className="text-sm sm:text-base text-gray-600">Review and approve job postings waiting for moderation</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-6 lg:mb-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 sm:p-4 lg:p-6">
          <div className="flex items-center">
            <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-600 mr-2 sm:mr-3" />
            <div>
              <p className="text-xs sm:text-sm font-medium text-yellow-800">Pending Review</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-yellow-900">{jobs.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 sm:p-4 lg:p-6">
          <div className="flex items-center">
            <Briefcase className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 mr-2 sm:mr-3" />
            <div>
              <p className="text-xs sm:text-sm font-medium text-blue-800">Total Jobs</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-900">{jobs.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-3 sm:p-4 lg:p-6">
          <div className="flex items-center">
            <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 mr-2 sm:mr-3" />
            <div>
              <p className="text-xs sm:text-sm font-medium text-green-800">Ready to Review</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-900">{jobs.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Jobs List */}
      <div className="space-y-3 sm:space-y-4">
        {jobs.length === 0 ? (
          <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-100 text-center">
            <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-green-400 mx-auto mb-3 sm:mb-4" />
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">All Caught Up!</h3>
            <p className="text-sm sm:text-base text-gray-600">No pending jobs to review at the moment.</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block space-y-4">
              {jobs.map((job) => (
                <div key={job._id} className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border-l-4 border-yellow-400 hover:shadow-md transition-shadow duration-200">
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
                      <p className="text-gray-600 mt-2 line-clamp-2 text-sm">{job.description}</p>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-yellow-100 text-yellow-800">
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        Pending
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-xs sm:text-sm text-gray-500">
                      Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openJobDetails(job)}
                        className="bg-blue-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center text-xs sm:text-sm"
                      >
                        <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        Review
                      </button>
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
                          if (reason !== null) {
                            updateJobStatus(job._id, 'rejected', reason || undefined)
                          }
                        }}
                        className="bg-red-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center text-xs sm:text-sm"
                      >
                        <XCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-3">
              {jobs.map((job) => (
                <div key={job._id} className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border-l-4 border-yellow-400">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm sm:text-base font-semibold text-gray-900 line-clamp-2 mb-1">
                        {job.title}
                      </h3>
                      <div className="flex items-center text-xs sm:text-sm text-gray-600 mb-1">
                        <Building className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                        <span className="truncate">{job.company}</span>
                      </div>
                      <div className="flex items-center text-xs sm:text-sm text-gray-600 mb-1">
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
                      <p className="text-xs text-gray-600 line-clamp-2">{job.description}</p>
                    </div>
                    <div className="flex-shrink-0 ml-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <Clock className="w-3 h-3 mr-1" />
                        Pending
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}
                    </div>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => openJobDetails(job)}
                        className="bg-blue-500 text-white px-2 py-1 rounded text-xs flex items-center"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        Review
                      </button>
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
                          if (reason !== null) {
                            updateJobStatus(job._id, 'rejected', reason || undefined)
                          }
                        }}
                        className="bg-red-500 text-white px-2 py-1 rounded text-xs flex items-center"
                      >
                        <XCircle className="w-3 h-3 mr-1" />
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Job Details Modal */}
      {showModal && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[95vh] overflow-y-auto">
            <div className="p-3 sm:p-4 lg:p-6">
              <div className="flex justify-between items-start mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 pr-2">{selectedJob.title}</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 flex-shrink-0"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>

              <div className="space-y-4 sm:space-y-6">
                {/* Job Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">Company</h3>
                    <p className="text-gray-600 text-sm sm:text-base">{selectedJob.company}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">Location</h3>
                    <p className="text-gray-600 text-sm sm:text-base">{selectedJob.location}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">Job Type</h3>
                    <p className="text-gray-600 text-sm sm:text-base">{selectedJob.jobType}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">Salary (INR)</h3>
                    <p className="text-gray-600 text-sm sm:text-base">{selectedJob.salary}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">Posted By</h3>
                    <p className="text-gray-600 text-sm sm:text-base">{selectedJob.postedBy.name} ({selectedJob.postedBy.email})</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">Deadline</h3>
                    <p className="text-gray-600 text-sm sm:text-base">{new Date(selectedJob.applicationDeadline).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">Description</h3>
                  <p className="text-gray-600 whitespace-pre-wrap text-sm sm:text-base">{selectedJob.description}</p>
                </div>

                {/* Requirements */}
                {selectedJob.requirements && selectedJob.requirements.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">Requirements</h3>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm sm:text-base">
                      {selectedJob.requirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Responsibilities */}
                {selectedJob.responsibilities && selectedJob.responsibilities.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">Responsibilities</h3>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm sm:text-base">
                      {selectedJob.responsibilities.map((resp, index) => (
                        <li key={index}>{resp}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 pt-4 sm:pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 sm:px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm sm:text-base"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      const reason = prompt('Rejection reason (optional):')
                      if (reason !== null) {
                        updateJobStatus(selectedJob._id, 'rejected', reason || undefined)
                      }
                    }}
                    className="px-4 sm:px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center text-sm sm:text-base"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </button>
                  <button
                    onClick={() => updateJobStatus(selectedJob._id, 'active')}
                    className="px-4 sm:px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center text-sm sm:text-base"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}