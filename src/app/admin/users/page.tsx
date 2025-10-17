'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Users, 
  Search, 
  Filter, 
  Eye, 
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
  role: 'user' | 'admin'
  status: 'active' | 'banned'
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
    role: 'user' as 'user' | 'admin',
    status: 'active' as 'active' | 'banned'
  })
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  })

  useEffect(() => {
    checkAuth()
    fetchUsers()
  }, [])

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

  const createUser = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      
      const response = await fetch('/api/admin/users/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(createUserData)
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          fetchUsers() // Refresh the list
          setShowCreateModal(false)
          setCreateUserData({
            name: '',
            email: '',
            password: '',
            phone: '',
            role: 'user',
            status: 'active'
          })
          alert('User created successfully!')
        } else {
          alert(data.message || 'Failed to create user')
        }
      } else {
        alert('Failed to create user')
      }
    } catch (error) {
      console.error('Error creating user:', error)
      alert('Failed to create user')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'banned':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800'
      case 'user':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [search, statusFilter, roleFilter, pagination.page])

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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600 mt-2">Manage user accounts and permissions</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors flex items-center"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Create User
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-blue-800">Total Users</p>
              <p className="text-2xl font-bold text-blue-900">{pagination.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center">
            <UserCheck className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-green-800">Active Users</p>
              <p className="text-2xl font-bold text-green-900">
                {users.filter(user => user.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center">
            <UserX className="w-8 h-8 text-red-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-red-800">Banned Users</p>
              <p className="text-2xl font-bold text-red-900">
                {users.filter(user => user.status === 'banned').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
          <div className="flex items-center">
            <Shield className="w-8 h-8 text-purple-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-purple-800">Admins</p>
              <p className="text-2xl font-bold text-purple-900">
                {users.filter(user => user.role === 'admin').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">All Roles</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users List */}
      <div className="space-y-4">
        {users.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No Users Found</h3>
            <p className="text-gray-600">No users match your current filters.</p>
          </div>
        ) : (
          users.map((user) => (
            <div key={user._id} className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <UserIcon className="w-6 h-6 text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">{user.name}</h3>
                    <div className="flex items-center text-gray-600 mb-2">
                      <Mail className="w-4 h-4 mr-2" />
                      <span className="mr-4">{user.email}</span>
                      {user.phone && (
                        <>
                          <span className="mr-4">•</span>
                          <span>{user.phone}</span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>Joined: {new Date(user.createdAt).toLocaleDateString()}</span>
                      </div>
                      {user.resumeUrl && (
                        <div className="flex items-center">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                            Has Resume
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(user.status)}`}>
                    {user.status === 'active' ? <UserCheck className="w-4 h-4 mr-1" /> : <UserX className="w-4 h-4 mr-1" />}
                    {user.status}
                  </span>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(user.role)}`}>
                    {user.role === 'admin' ? <Shield className="w-4 h-4 mr-1" /> : <UserIcon className="w-4 h-4 mr-1" />}
                    {user.role}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Last updated: {new Date(user.updatedAt).toLocaleDateString()}
                </div>
                <div className="flex space-x-2">
                  {user.status === 'active' ? (
                    <button
                      onClick={() => updateUserStatus(user._id, 'banned')}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center"
                    >
                      <UserX className="w-4 h-4 mr-1" />
                      Ban User
                    </button>
                  ) : (
                    <button
                      onClick={() => updateUserStatus(user._id, 'active')}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center"
                    >
                      <UserCheck className="w-4 h-4 mr-1" />
                      Activate User
                    </button>
                  )}
                  
                  {user.role === 'user' ? (
                    <button
                      onClick={() => updateUserRole(user._id, 'admin')}
                      className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors flex items-center"
                    >
                      <Shield className="w-4 h-4 mr-1" />
                      Make Admin
                    </button>
                  ) : (
                    <button
                      onClick={() => updateUserRole(user._id, 'user')}
                      className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center"
                    >
                      <UserIcon className="w-4 h-4 mr-1" />
                      Remove Admin
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="mt-8 flex justify-center">
          <div className="flex space-x-2">
            {pagination.page > 1 && (
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
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
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
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
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Next
              </button>
            )}
          </div>
        </div>
      )}

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Create New User</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  value={createUserData.name}
                  onChange={(e) => setCreateUserData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={createUserData.email}
                  onChange={(e) => setCreateUserData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter email address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  value={createUserData.password}
                  onChange={(e) => setCreateUserData(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter password (min 6 characters)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={createUserData.phone}
                  onChange={(e) => setCreateUserData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter phone number"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <select
                    value={createUserData.role}
                    onChange={(e) => setCreateUserData(prev => ({ ...prev, role: e.target.value as 'user' | 'admin' }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={createUserData.status}
                    onChange={(e) => setCreateUserData(prev => ({ ...prev, status: e.target.value as 'active' | 'banned' }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="active">Active</option>
                    <option value="banned">Banned</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={createUser}
                className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                Create User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
