'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Users, 
  Search, 
  UserCheck, 
  UserX, 
  Mail,
  Calendar,
  Shield,
  User as UserIcon,
  UserPlus,
  X
} from 'lucide-react'

interface User {
  _id: string
  name: string
  email: string
  phone?: string
  role: 'user' | 'admin' | 'collaborator' | 'content-creator'
  status: 'active' | 'banned' | 'pending'
  permissions: string[]
  createdBy: {
    _id: string
    name: string
  }
  lastActive: string
  resumeUrl?: string
  createdAt: string
  updatedAt: string
}

export default function AdminUsersPage() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [createUserData, setCreateUserData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'collaborator' as 'user' | 'admin' | 'collaborator' | 'content-creator',
    status: 'pending' as 'active' | 'banned' | 'pending',
    permissions: [] as string[]
  })
  const [createUserErrors, setCreateUserErrors] = useState<Record<string, string>>({})
  const [isCreating, setIsCreating] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  })

  useEffect(() => {
    checkAuth()
    fetchUsers()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const checkAuth = () => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin/login')
    }
  }

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('adminToken')
      
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(search && { search }),
        ...(statusFilter && { status: statusFilter }),
        ...(roleFilter && { role: roleFilter })
      })

      const response = await fetch(`/api/admin/users?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setUsers(data.data)
          setPagination(data.pagination)
        }
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateUserStatus = async (userId: string, status: string) => {
    try {
      const token = localStorage.getItem('adminToken')
      
      const response = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userId, status })
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          fetchUsers() // Refresh the list
        }
      }
    } catch (error) {
      console.error('Error updating user status:', error)
    }
  }

  const updateUserRole = async (userId: string, role: string) => {
    try {
      const token = localStorage.getItem('adminToken')
      
      const response = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userId, role })
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          fetchUsers() // Refresh the list
        }
      }
    } catch (error) {
      console.error('Error updating user role:', error)
    }
  }

  const validateCreateUserForm = () => {
    const errors: Record<string, string> = {}

    if (!createUserData.name.trim()) {
      errors.name = 'Name is required'
    } else if (createUserData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters'
    }

    if (!createUserData.email.trim()) {
      errors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(createUserData.email)) {
      errors.email = 'Please enter a valid email address'
    }

    if (!createUserData.password) {
      errors.password = 'Password is required'
    } else if (createUserData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters'
    }

    if (createUserData.phone && !/^[6-9]\d{9}$/.test(createUserData.phone)) {
      errors.phone = 'Please enter a valid 10-digit phone number'
    }

    setCreateUserErrors(errors)
    return Object.keys(errors).length === 0
  }

  const createUser = async () => {
    if (!validateCreateUserForm()) {
      return
    }

    try {
      setIsCreating(true)
      setCreateUserErrors({})
      
      const token = localStorage.getItem('adminToken')
      
      const response = await fetch('/api/admin/users/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(createUserData)
      })

      const data = await response.json()

      if (response.ok && data.success) {
        fetchUsers() // Refresh the list
        setShowCreateModal(false)
        resetCreateUserForm()
        setNotification({ type: 'success', message: `User "${createUserData.name}" created successfully!` })
        setTimeout(() => setNotification(null), 5000)
      } else {
        if (data.errors) {
          setCreateUserErrors(data.errors)
        } else {
          setNotification({ type: 'error', message: data.message || 'Failed to create user' })
          setTimeout(() => setNotification(null), 5000)
        }
      }
    } catch (error) {
      console.error('Error creating user:', error)
      setNotification({ type: 'error', message: 'Failed to create user. Please try again.' })
      setTimeout(() => setNotification(null), 5000)
    } finally {
      setIsCreating(false)
    }
  }

  const resetCreateUserForm = () => {
    setCreateUserData({
      name: '',
      email: '',
      password: '',
      phone: '',
      role: 'collaborator',
      status: 'pending',
      permissions: []
    })
    setCreateUserErrors({})
    setShowPassword(false)
  }

  const handleCreateUserModalClose = () => {
    setShowCreateModal(false)
    resetCreateUserForm()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'banned':
        return 'bg-red-100 text-red-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800'
      case 'collaborator':
        return 'bg-blue-100 text-blue-800'
      case 'content-creator':
        return 'bg-green-100 text-green-800'
      case 'user':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [search, statusFilter, roleFilter, pagination.page]) // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return (
      <div className="p-3 sm:p-4 lg:p-6">
        <div className="animate-pulse">
          <div className="h-6 sm:h-8 bg-gray-200 rounded w-1/4 mb-4 sm:mb-6"></div>
          <div className="space-y-3 sm:space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white p-4 sm:p-6 rounded-lg shadow">
                <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-2 sm:h-3 bg-gray-200 rounded w-1/2 mb-3 sm:mb-4"></div>
                <div className="h-2 sm:h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-2 sm:h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-3 sm:p-4 lg:p-6">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-3 sm:top-4 right-3 sm:right-4 z-50 max-w-sm w-full bg-white rounded-lg shadow-lg border-l-4 ${
          notification.type === 'success' ? 'border-green-400' : 'border-red-400'
        }`}>
          <div className="p-3 sm:p-4">
            <div className="flex items-start">
              <div className={`flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 mt-0.5 ${
                notification.type === 'success' ? 'text-green-400' : 'text-red-400'
              }`}>
                {notification.type === 'success' ? (
                  <UserCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <UserX className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </div>
              <div className="ml-2 sm:ml-3">
                <p className={`text-xs sm:text-sm font-medium ${
                  notification.type === 'success' ? 'text-green-800' : 'text-red-800'
                }`}>
                  {notification.message}
                </p>
              </div>
              <div className="ml-auto pl-2 sm:pl-3">
                <button
                  onClick={() => setNotification(null)}
                  className={`inline-flex rounded-md p-1 sm:p-1.5 ${
                    notification.type === 'success' 
                      ? 'text-green-500 hover:bg-green-100' 
                      : 'text-red-500 hover:bg-red-100'
                  }`}
                >
                  <X className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">User Management</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">Manage user accounts, roles, and permissions</p>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-primary-500 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors flex items-center justify-center text-sm sm:text-base"
            >
              <UserPlus className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Create New User</span>
              <span className="sm:hidden">Create User</span>
            </button>
            <button
              onClick={fetchUsers}
              className="bg-gray-100 text-gray-700 px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center text-sm sm:text-base"
            >
              <Search className="w-4 h-4 mr-1 sm:mr-2" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 lg:p-6">
          <div className="flex items-center">
            <Users className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-blue-600 mr-2 sm:mr-3 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-medium text-blue-800 truncate">Total Users</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-900">{pagination.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 lg:p-6">
          <div className="flex items-center">
            <UserCheck className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-green-600 mr-2 sm:mr-3 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-medium text-green-800 truncate">Active Users</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-900">
                {users.filter(user => user.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 lg:p-6">
          <div className="flex items-center">
            <UserX className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-red-600 mr-2 sm:mr-3 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-medium text-red-800 truncate">Banned Users</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-red-900">
                {users.filter(user => user.status === 'banned').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 sm:p-4 lg:p-6">
          <div className="flex items-center">
            <Shield className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-purple-600 mr-2 sm:mr-3 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-medium text-purple-800 truncate">Admins</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-900">
                {users.filter(user => user.role === 'admin').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow mb-4 sm:mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="sm:col-span-2 lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
              />
            </div>
          </div>
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="banned">Banned</option>
            </select>
          </div>
          <div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
            >
              <option value="">All Roles</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users List */}
      <div className="space-y-3 sm:space-y-4">
        {users.length === 0 ? (
          <div className="bg-white p-6 sm:p-8 rounded-lg shadow text-center">
            <Users className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">No Users Found</h3>
            <p className="text-sm sm:text-base text-gray-600">No users match your current filters.</p>
          </div>
        ) : (
          users.map((user) => (
            <div key={user._id} className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 sm:mb-4">
                <div className="flex items-start space-x-3 sm:space-x-4 mb-3 sm:mb-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <UserIcon className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 truncate">{user.name}</h3>
                    <div className="flex flex-col sm:flex-row sm:items-center text-gray-600 mb-2 space-y-1 sm:space-y-0">
                      <div className="flex items-center text-sm sm:text-base">
                        <Mail className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" />
                        <span className="truncate">{user.email}</span>
                      </div>
                      {user.phone && (
                        <div className="flex items-center text-sm sm:text-base">
                          <span className="hidden sm:inline mr-2">•</span>
                          <span>{user.phone}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 text-xs sm:text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                        <span>Joined: {new Date(user.createdAt).toLocaleDateString()}</span>
                      </div>
                      {user.lastActive && (
                        <div className="flex items-center">
                          <span>Last Active: {new Date(user.lastActive).toLocaleDateString()}</span>
                        </div>
                      )}
                      {user.resumeUrl && (
                        <div className="flex items-center">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                            Has Resume
                          </span>
                        </div>
                      )}
                    </div>
                    {user.permissions && user.permissions.length > 0 && (
                      <div className="mt-2">
                        <div className="flex flex-wrap gap-1">
                          {user.permissions.slice(0, 3).map((permission) => (
                            <span
                              key={permission}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                            >
                              {permission.replace('-', ' ')}
                            </span>
                          ))}
                          {user.permissions.length > 3 && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              +{user.permissions.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                  <span className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getStatusColor(user.status)}`}>
                    {user.status === 'active' ? <UserCheck className="w-3 h-3 sm:w-4 sm:h-4 mr-1" /> : <UserX className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />}
                    {user.status}
                  </span>
                  <span className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getRoleColor(user.role)}`}>
                    {user.role === 'admin' ? <Shield className="w-3 h-3 sm:w-4 sm:h-4 mr-1" /> : <UserIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />}
                    {user.role}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
                <div className="text-xs sm:text-sm text-gray-500">
                  Last updated: {new Date(user.updatedAt).toLocaleDateString()}
                </div>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  {user.status === 'active' ? (
                    <button
                      onClick={() => updateUserStatus(user._id, 'banned')}
                      className="bg-red-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center text-sm"
                    >
                      <UserX className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      Ban User
                    </button>
                  ) : (
                    <button
                      onClick={() => updateUserStatus(user._id, 'active')}
                      className="bg-green-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center text-sm"
                    >
                      <UserCheck className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      Activate User
                    </button>
                  )}
                  
                  <div className="flex flex-wrap gap-1 sm:gap-2">
                    {user.role !== 'collaborator' && (
                      <button
                        onClick={() => updateUserRole(user._id, 'collaborator')}
                        className="bg-blue-500 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg hover:bg-blue-600 transition-colors flex items-center text-xs sm:text-sm"
                      >
                        <UserPlus className="w-3 h-3 mr-1" />
                        <span className="hidden sm:inline">Make Collaborator</span>
                        <span className="sm:hidden">Collaborator</span>
                      </button>
                    )}
                    {user.role !== 'content-creator' && (
                      <button
                        onClick={() => updateUserRole(user._id, 'content-creator')}
                        className="bg-green-500 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg hover:bg-green-600 transition-colors flex items-center text-xs sm:text-sm"
                      >
                        <UserIcon className="w-3 h-3 mr-1" />
                        <span className="hidden sm:inline">Make Content Creator</span>
                        <span className="sm:hidden">Creator</span>
                      </button>
                    )}
                    {user.role !== 'user' && (
                      <button
                        onClick={() => updateUserRole(user._id, 'user')}
                        className="bg-gray-500 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg hover:bg-gray-600 transition-colors flex items-center text-xs sm:text-sm"
                      >
                        <UserIcon className="w-3 h-3 mr-1" />
                        <span className="hidden sm:inline">Make Regular User</span>
                        <span className="sm:hidden">User</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="mt-6 sm:mt-8 flex justify-center">
          <div className="flex space-x-1 sm:space-x-2">
            {pagination.page > 1 && (
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                className="px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Previous
              </button>
            )}
            
            {[...Array(pagination.pages)].map((_, i) => {
              const page = i + 1
              const isCurrentPage = page === pagination.page
              
              return (
                <button
                  key={page}
                  onClick={() => setPagination(prev => ({ ...prev, page }))}
                  className={`px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-md ${
                    isCurrentPage
                      ? 'bg-primary-500 text-white'
                      : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              )
            })}
            
            {pagination.page < pagination.pages && (
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                className="px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Next
              </button>
            )}
          </div>
        </div>
      )}

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 sm:p-4 z-50">
          <div className="bg-white rounded-lg max-w-full sm:max-w-lg w-full p-4 sm:p-6 max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Create New User</h3>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">Add a new user to the system</p>
              </div>
              <button
                onClick={handleCreateUserModalClose}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            <div className="space-y-4 sm:space-y-5">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={createUserData.name}
                  onChange={(e) => {
                    setCreateUserData(prev => ({ ...prev, name: e.target.value }))
                    if (createUserErrors.name) {
                      setCreateUserErrors(prev => ({ ...prev, name: '' }))
                    }
                  }}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base ${
                    createUserErrors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter full name"
                />
                {createUserErrors.name && (
                  <p className="mt-1 text-xs sm:text-sm text-red-600">{createUserErrors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={createUserData.email}
                  onChange={(e) => {
                    setCreateUserData(prev => ({ ...prev, email: e.target.value }))
                    if (createUserErrors.email) {
                      setCreateUserErrors(prev => ({ ...prev, email: '' }))
                    }
                  }}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base ${
                    createUserErrors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter email address"
                />
                {createUserErrors.email && (
                  <p className="mt-1 text-xs sm:text-sm text-red-600">{createUserErrors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={createUserData.password}
                    onChange={(e) => {
                      setCreateUserData(prev => ({ ...prev, password: e.target.value }))
                      if (createUserErrors.password) {
                        setCreateUserErrors(prev => ({ ...prev, password: '' }))
                      }
                    }}
                    className={`w-full px-3 py-2 pr-8 sm:pr-10 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base ${
                      createUserErrors.password ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter password (min 6 characters)"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-2 sm:pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <UserX className="w-3 h-3 sm:w-4 sm:h-4" />
                    ) : (
                      <UserCheck className="w-3 h-3 sm:w-4 sm:h-4" />
                    )}
                  </button>
                </div>
                {createUserErrors.password && (
                  <p className="mt-1 text-xs sm:text-sm text-red-600">{createUserErrors.password}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Password must be at least 6 characters long
                </p>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={createUserData.phone}
                  onChange={(e) => {
                    setCreateUserData(prev => ({ ...prev, phone: e.target.value }))
                    if (createUserErrors.phone) {
                      setCreateUserErrors(prev => ({ ...prev, phone: '' }))
                    }
                  }}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base ${
                    createUserErrors.phone ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter 10-digit phone number"
                />
                {createUserErrors.phone && (
                  <p className="mt-1 text-xs sm:text-sm text-red-600">{createUserErrors.phone}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Optional - Enter a valid 10-digit Indian phone number
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    User Role *
                  </label>
                  <select
                    value={createUserData.role}
                    onChange={(e) => setCreateUserData(prev => ({ ...prev, role: e.target.value as 'user' | 'admin' | 'collaborator' | 'content-creator' }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
                  >
                    <option value="user">Regular User</option>
                    <option value="collaborator">Collaborator</option>
                    <option value="content-creator">Content Creator</option>
                    <option value="admin">Admin</option>
                  </select>
                  <p className="mt-1 text-xs text-gray-500">
                    {createUserData.role === 'collaborator' && 'Can create content and view analytics'}
                    {createUserData.role === 'content-creator' && 'Can create jobs and news articles'}
                    {createUserData.role === 'user' && 'Basic access only'}
                    {createUserData.role === 'admin' && 'Full system access'}
                  </p>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Account Status *
                  </label>
                  <select
                    value={createUserData.status}
                    onChange={(e) => setCreateUserData(prev => ({ ...prev, status: e.target.value as 'active' | 'banned' | 'pending' }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
                  >
                    <option value="pending">Pending</option>
                    <option value="active">Active</option>
                    <option value="banned">Banned</option>
                  </select>
                  <p className="mt-1 text-xs text-gray-500">
                    {createUserData.status === 'pending' && 'User needs admin approval'}
                    {createUserData.status === 'active' && 'User can login immediately'}
                    {createUserData.status === 'banned' && 'User access is blocked'}
                  </p>
                </div>
              </div>

              {/* Permissions Section */}
              {createUserData.role === 'collaborator' && (
                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                    Permissions
                  </label>
                  <div className="grid grid-cols-1 gap-2 sm:gap-3">
                    {[
                      { key: 'create-jobs', label: 'Create Jobs', description: 'Post job opportunities' },
                      { key: 'create-news', label: 'Create News', description: 'Write news articles' },
                      { key: 'edit-own-content', label: 'Edit Own Content', description: 'Modify their posts' },
                      { key: 'delete-own-content', label: 'Delete Own Content', description: 'Remove their posts' },
                      { key: 'view-analytics', label: 'View Analytics', description: 'See performance data' }
                    ].map((permission) => (
                      <label key={permission.key} className="flex items-start space-x-2 sm:space-x-3 p-2 hover:bg-white rounded-md transition-colors">
                        <input
                          type="checkbox"
                          checked={createUserData.permissions.includes(permission.key)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setCreateUserData(prev => ({
                                ...prev,
                                permissions: [...prev.permissions, permission.key]
                              }))
                            } else {
                              setCreateUserData(prev => ({
                                ...prev,
                                permissions: prev.permissions.filter(p => p !== permission.key)
                              }))
                            }
                          }}
                          className="h-3 w-3 sm:h-4 sm:w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-0.5"
                        />
                        <div className="flex-1">
                          <span className="text-xs sm:text-sm font-medium text-gray-700">{permission.label}</span>
                          <p className="text-xs text-gray-500">{permission.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    Select the permissions this collaborator should have
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200 space-y-3 sm:space-y-0">
              <div className="text-xs sm:text-sm text-gray-500">
                * Required fields
              </div>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                <button
                  onClick={handleCreateUserModalClose}
                  disabled={isCreating}
                  className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={createUser}
                  disabled={isCreating}
                  className="px-4 sm:px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm sm:text-base"
                >
                  {isCreating ? (
                    <>
                      <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>Create User</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
