'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Rss, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  RefreshCw,
  Globe,
  X
} from 'lucide-react'
import { TableLoader } from '@/components/shared/PageLoader'
import LoadingButton from '@/components/shared/LoadingButton'
import { useLoading } from '@/hooks/useLoading'
import { NEWS_CATEGORIES } from '@/lib/constants/categories'

interface RssFeed {
  _id: string
  name: string
  url: string
  category: string
  language: 'en' | 'hi'
  isActive: boolean
  lastFetchedAt: string | null
  lastError: string | null
  fetchCount: number
  successCount: number
  errorCount: number
  createdBy: {
    name: string
    email: string
  }
  createdAt: string
  updatedAt: string
}

export default function RssFeedsPage() {
  const router = useRouter()
  const { isLoading, withLoading } = useLoading()
  const [feeds, setFeeds] = useState<RssFeed[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingFeed, setEditingFeed] = useState<RssFeed | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    category: 'other',
    language: 'en' as 'en' | 'hi',
    isActive: true
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  })

  useEffect(() => {
    checkAuth()
    fetchFeeds()
  }, [])

  useEffect(() => {
    fetchFeeds()
  }, [search, activeFilter, pagination.page])

  const checkAuth = () => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin/login')
    }
  }

  const fetchFeeds = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('adminToken')
      
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(search && { search }),
        ...(activeFilter && { isActive: activeFilter })
      })

      const response = await fetch(`/api/admin/rss-feeds?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setFeeds(data.data)
          setPagination(data.pagination)
        }
      }
    } catch (error) {
      console.error('Error fetching RSS feeds:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    await withLoading('submit', async () => {
      try {
        const token = localStorage.getItem('adminToken')
        const url = editingFeed 
          ? `/api/admin/rss-feeds` 
          : `/api/admin/rss-feeds`
        const method = editingFeed ? 'PUT' : 'POST'
        const body = editingFeed 
          ? { id: editingFeed._id, ...formData }
          : formData

        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(body)
        })

        const data = await response.json()

        if (response.ok && data.success) {
          setShowModal(false)
          setEditingFeed(null)
          resetForm()
          fetchFeeds()
        } else {
          if (data.errors) {
            const formErrors: Record<string, string> = {}
            data.errors.forEach((err: any) => {
              formErrors[err.field] = err.message
            })
            setErrors(formErrors)
          } else {
            setErrors({ submit: data.message || 'Failed to save RSS feed' })
          }
        }
      } catch (error) {
        console.error('Error saving RSS feed:', error)
        setErrors({ submit: 'Failed to save RSS feed' })
      }
    })
  }

  const handleEdit = (feed: RssFeed) => {
    setEditingFeed(feed)
    setFormData({
      name: feed.name,
      url: feed.url,
      category: feed.category,
      language: feed.language,
      isActive: feed.isActive
    })
    setShowModal(true)
  }

  const handleDelete = async (feedId: string) => {
    if (!confirm('Are you sure you want to delete this RSS feed?')) {
      return
    }

    await withLoading('delete', async () => {
      try {
        const token = localStorage.getItem('adminToken')
        
        const response = await fetch(`/api/admin/rss-feeds/${feedId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.ok) {
          fetchFeeds()
        }
      } catch (error) {
        console.error('Error deleting RSS feed:', error)
      }
    })
  }

  const handleTestFeed = async (feedId: string) => {
    await withLoading('test', async () => {
      try {
        const token = localStorage.getItem('adminToken')
        
        const response = await fetch(`/api/admin/rss-feeds/${feedId}/test`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        const data = await response.json()
        if (data.success) {
          alert(`Test successful! Created ${data.created} articles.`)
          fetchFeeds()
        } else {
          alert(`Test failed: ${data.message}`)
        }
      } catch (error) {
        console.error('Error testing RSS feed:', error)
        alert('Failed to test RSS feed')
      }
    })
  }

  const resetForm = () => {
    setFormData({
      name: '',
      url: '',
      category: 'other',
      language: 'en',
      isActive: true
    })
    setErrors({})
    setEditingFeed(null)
  }

  const openAddModal = () => {
    resetForm()
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    resetForm()
  }

  const getStatusBadge = (feed: RssFeed) => {
    if (!feed.isActive) {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Inactive</span>
    }
    if (feed.lastError) {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Error</span>
    }
    return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Active</span>
  }

  if (loading) {
    return (
      <div className="p-2 sm:p-4 lg:p-6">
        <div className="animate-pulse">
          <div className="h-6 sm:h-8 bg-gray-200 rounded w-1/3 sm:w-1/4 mb-4 sm:mb-6"></div>
          <TableLoader rows={5} />
        </div>
      </div>
    )
  }

  return (
    <div className="p-2 sm:p-4 lg:p-6">
      {/* Header */}
      <div className="mb-4 sm:mb-6 lg:mb-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">RSS Feeds</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">Manage RSS feeds for automatic news fetching</p>
          </div>
          <button
            onClick={openAddModal}
            className="bg-primary-500 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors flex items-center justify-center sm:justify-start text-sm sm:text-base"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add RSS Feed
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-lg shadow mb-3 sm:mb-4 lg:mb-6">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                placeholder="Search feeds..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
            >
              <option value="">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Feeds List */}
      <div className="space-y-3 sm:space-y-4">
        {feeds.length === 0 ? (
          <div className="text-center py-8 sm:py-12 bg-white rounded-lg shadow">
            <Rss className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">No RSS Feeds Found</h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4">Get started by adding your first RSS feed.</p>
            <button
              onClick={openAddModal}
              className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
            >
              Add RSS Feed
            </button>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Feed</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stats</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Fetched</th>
                      <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {feeds.map((feed) => (
                      <tr key={feed._id} className="hover:bg-gray-50">
                        <td className="px-4 sm:px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{feed.name}</div>
                            <div className="text-sm text-gray-500 truncate max-w-md">{feed.url}</div>
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {feed.category}
                          </span>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(feed)}
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div>Fetches: {feed.fetchCount}</div>
                          <div>Success: {feed.successCount}</div>
                          <div>Errors: {feed.errorCount}</div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {feed.lastFetchedAt 
                            ? new Date(feed.lastFetchedAt).toLocaleString()
                            : 'Never'}
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleTestFeed(feed._id)}
                              className="text-blue-600 hover:text-blue-900 p-1"
                              title="Test Feed"
                              disabled={isLoading('test')}
                            >
                              <RefreshCw className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleEdit(feed)}
                              className="text-primary-600 hover:text-primary-900 p-1"
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(feed._id)}
                              className="text-red-600 hover:text-red-900 p-1"
                              title="Delete"
                              disabled={isLoading('delete')}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-3">
              {feeds.map((feed) => (
                <div key={feed._id} className="bg-white rounded-lg shadow p-3 sm:p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm sm:text-base font-medium text-gray-900 mb-1">
                        {feed.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 truncate mb-2">
                        {feed.url}
                      </p>
                      <div className="flex items-center space-x-2 mb-2">
                        {getStatusBadge(feed)}
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {feed.category}
                        </span>
                      </div>
                      <div className="text-xs sm:text-sm text-gray-500">
                        <div>Fetches: {feed.fetchCount} | Success: {feed.successCount} | Errors: {feed.errorCount}</div>
                        <div className="mt-1">
                          Last: {feed.lastFetchedAt ? new Date(feed.lastFetchedAt).toLocaleString() : 'Never'}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-end space-x-2 pt-2 border-t border-gray-200">
                    <button
                      onClick={() => handleTestFeed(feed._id)}
                      className="text-blue-600 hover:text-blue-900 p-1"
                      title="Test Feed"
                      disabled={isLoading('test')}
                    >
                      <RefreshCw className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleEdit(feed)}
                      className="text-primary-600 hover:text-primary-900 p-1"
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(feed._id)}
                      className="text-red-600 hover:text-red-900 p-1"
                      title="Delete"
                      disabled={isLoading('delete')}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="mt-4 sm:mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
              disabled={pagination.page === 1}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md">
              {pagination.page} of {pagination.pages}
            </span>
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
              disabled={pagination.page === pagination.pages}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  {editingFeed ? 'Edit RSS Feed' : 'Add RSS Feed'}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Feed Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    RSS Feed URL *
                  </label>
                  <input
                    type="url"
                    name="url"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="https://example.com/feed.xml"
                    required
                  />
                  {errors.url && <p className="mt-1 text-sm text-red-600">{errors.url}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    >
                      {NEWS_CATEGORIES.map((category) => (
                        <option key={category.value} value={category.value}>{category.label}</option>
                      ))}
                    </select>
                    {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Language *
                    </label>
                    <select
                      name="language"
                      value={formData.language}
                      onChange={(e) => setFormData({ ...formData, language: e.target.value as 'en' | 'hi' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    >
                      <option value="en">English</option>
                      <option value="hi">Hindi</option>
                    </select>
                    {errors.language && <p className="mt-1 text-sm text-red-600">{errors.language}</p>}
                  </div>
                </div>

                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Active (Feed will be fetched automatically)</span>
                  </label>
                </div>

                {errors.submit && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-sm text-red-600">{errors.submit}</p>
                  </div>
                )}

                <div className="flex items-center justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <LoadingButton
                    type="submit"
                    loading={isLoading('submit')}
                    className="px-4 py-2 text-sm font-medium text-white bg-primary-500 rounded-lg hover:bg-primary-600"
                  >
                    {editingFeed ? 'Update Feed' : 'Add Feed'}
                  </LoadingButton>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

