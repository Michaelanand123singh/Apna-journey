'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye, 
  User, 
  Calendar,
  AlertCircle,
  Filter,
  Search
} from 'lucide-react'
import LoadingButton from '@/components/shared/LoadingButton'

interface PendingContent {
  _id: string
  title: string
  type: 'job' | 'news'
  author: {
    _id: string
    name: string
    email: string
  }
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
  // Job specific fields
  company?: string
  location?: string
  jobType?: string
  // News specific fields
  excerpt?: string
  category?: string
  isFeatured?: boolean
}

export default function ContentApprovalPage() {
  const router = useRouter()
  const [content, setContent] = useState<PendingContent[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('pending')
  const [approving, setApproving] = useState<string | null>(null)
  const [rejecting, setRejecting] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [showRejectModal, setShowRejectModal] = useState<string | null>(null)

  useEffect(() => {
    checkAuth()
    fetchPendingContent()
  }, [])

  const checkAuth = () => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin/login')
    }
  }

  const fetchPendingContent = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('adminToken')
      
      const params = new URLSearchParams({
        ...(search && { search }),
        ...(typeFilter && { type: typeFilter }),
        ...(statusFilter && { status: statusFilter })
      })

      const response = await fetch(`/api/admin/content/pending?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setContent(data.data)
        }
      }
    } catch (error) {
      console.error('Error fetching pending content:', error)
    } finally {
      setLoading(false)
    }
  }

  const approveContent = async (id: string, type: 'job' | 'news') => {
    try {
      setApproving(id)
      const token = localStorage.getItem('adminToken')
      
      const response = await fetch('/api/admin/content/approve', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          type,
          id,
          status: 'approved'
        })
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setContent(prev => prev.filter(item => item._id !== id))
        }
      }
    } catch (error) {
      console.error('Error approving content:', error)
    } finally {
      setApproving(null)
    }
  }

  const rejectContent = async (id: string, type: 'job' | 'news') => {
    if (!rejectReason.trim()) {
      alert('Please provide a reason for rejection')
      return
    }

    try {
      setRejecting(id)
      const token = localStorage.getItem('adminToken')
      
      const response = await fetch('/api/admin/content/approve', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          type,
          id,
          status: 'rejected',
          reason: rejectReason
        })
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setContent(prev => prev.filter(item => item._id !== id))
          setShowRejectModal(null)
          setRejectReason('')
        }
      }
    } catch (error) {
      console.error('Error rejecting content:', error)
    } finally {
      setRejecting(null)
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status: string) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'approved': 'bg-green-100 text-green-800',
      'rejected': 'bg-red-100 text-red-800'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  useEffect(() => {
    fetchPendingContent()
  }, [search, typeFilter, statusFilter])

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow">
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
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Content Approval</h1>
        <p className="text-gray-600 mt-2">Review and approve content from collaborators</p>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search content..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Types</option>
              <option value="job">Jobs</option>
              <option value="news">News</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={fetchPendingContent}
              className="w-full bg-primary-500 text-white px-4 py-2 rounded-md hover:bg-primary-600 transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Content List */}
      <div className="space-y-4">
        {content.length === 0 ? (
          <div className="text-center py-12">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No content to review</h3>
            <p className="text-gray-600">All content has been reviewed or no content matches your filters.</p>
          </div>
        ) : (
          content.map((item) => (
            <div key={item._id} className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {item.type.toUpperCase()}
                    </span>
                  </div>
                  
                  {item.type === 'job' && (
                    <div className="text-gray-600 mb-2">
                      <p className="font-medium">{item.company}</p>
                      <p className="text-sm">{item.location?.replace('-', ' ').toUpperCase()} • {item.jobType}</p>
                    </div>
                  )}
                  
                  {item.type === 'news' && (
                    <div className="text-gray-600 mb-2">
                      <p className="text-sm">{item.excerpt}</p>
                      <p className="text-sm">Category: {item.category} {item.isFeatured && '• Featured'}</p>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      <span>{item.author.name}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{formatDate(item.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => window.open(`/${item.type}s/${item._id}`, '_blank')}
                    className="inline-flex items-center px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Preview
                  </button>
                </div>
                
                {item.status === 'pending' && (
                  <div className="flex items-center space-x-2">
                    <LoadingButton
                      onClick={() => approveContent(item._id, item.type)}
                      loading={approving === item._id}
                      loadingText="Approving..."
                      className="inline-flex items-center px-4 py-2 text-sm text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Approve
                    </LoadingButton>
                    
                    <button
                      onClick={() => setShowRejectModal(item._id)}
                      className="inline-flex items-center px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Reject Content</h3>
              <button
                onClick={() => {
                  setShowRejectModal(null)
                  setRejectReason('')
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for rejection *
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Please provide a reason for rejection..."
              />
            </div>
            
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowRejectModal(null)
                  setRejectReason('')
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <LoadingButton
                onClick={() => {
                  const item = content.find(c => c._id === showRejectModal)
                  if (item) {
                    rejectContent(item._id, item.type)
                  }
                }}
                loading={rejecting === showRejectModal}
                loadingText="Rejecting..."
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Reject
              </LoadingButton>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
