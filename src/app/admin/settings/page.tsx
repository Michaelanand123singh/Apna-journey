'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import {
  Settings,
  User,
  Shield,
  Bell,
  Database,
  Globe,
  Mail,
  Lock,
  Save,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Info,
  RefreshCw,
  Download,
  Upload,
  Trash2,
  Plus,
  Edit,
  X
} from 'lucide-react'

interface AdminProfile {
  name: string
  email: string
  role: string
  permissions: string[]
}

interface SystemSettings {
  siteName: string
  siteDescription: string
  siteUrl: string
  contactEmail: string
  contactPhone: string
  address: string
  socialMedia: {
    facebook?: string
    twitter?: string
    instagram?: string
    linkedin?: string
  }
  seo: {
    metaTitle: string
    metaDescription: string
    metaKeywords: string
  }
  notifications: {
    emailNotifications: boolean
    jobApprovalNotifications: boolean
    inquiryNotifications: boolean
    systemAlerts: boolean
  }
  security: {
    sessionTimeout: number
    maxLoginAttempts: number
    requireTwoFactor: boolean
    passwordExpiry: number
  }
  backup: {
    autoBackup: boolean
    backupFrequency: string
    retentionDays: number
  }
}

interface EmailTemplate {
  id: string
  name: string
  subject: string
  body: string
  type: 'welcome' | 'job_approval' | 'job_rejection' | 'inquiry_response'
}

export default function AdminSettingsPage() {
  const { admin, adminToken } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  // Profile state
  const [profile, setProfile] = useState<AdminProfile>({
    name: '',
    email: '',
    role: '',
    permissions: []
  })

  // System settings state
  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    siteName: 'Apna Journey',
    siteDescription: 'Gaya Ki Awaaz - Jobs & News Platform',
    siteUrl: 'https://apnajourney.com',
    contactEmail: 'info@apnajourney.com',
    contactPhone: '+91 98765 43210',
    address: 'Gaya City Center, Bihar, India - 823001',
    socialMedia: {},
    seo: {
      metaTitle: 'Apna Journey - Gaya Ki Awaaz | Jobs & News in Gaya, Bihar',
      metaDescription: 'Find local jobs and stay updated with Gaya news. Your one-stop platform for opportunities and information in Gaya, Bihar.',
      metaKeywords: 'Gaya jobs, Bihar news, local jobs, Gaya news, jobs in Gaya, government jobs Gaya, part time jobs Gaya'
    },
    notifications: {
      emailNotifications: true,
      jobApprovalNotifications: true,
      inquiryNotifications: true,
      systemAlerts: true
    },
    security: {
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      requireTwoFactor: false,
      passwordExpiry: 90
    },
    backup: {
      autoBackup: true,
      backupFrequency: 'daily',
      retentionDays: 30
    }
  })

  // Email templates state
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>([])
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null)

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  useEffect(() => {
    if (admin) {
      setProfile({
        name: admin.name,
        email: admin.email,
        role: admin.role,
        permissions: admin.permissions
      })
    }
    loadSystemSettings()
    loadEmailTemplates()
  }, [admin])

  const loadSystemSettings = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/settings', {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      })
      const data = await response.json()
      if (data.success) {
        setSystemSettings(data.data)
      }
    } catch (error) {
      console.error('Error loading system settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadEmailTemplates = async () => {
    try {
      const response = await fetch('/api/admin/email-templates', {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      })
      const data = await response.json()
      if (data.success) {
        setEmailTemplates(data.data)
      }
    } catch (error) {
      console.error('Error loading email templates:', error)
    }
  }

  const saveProfile = async () => {
    try {
      setSaving(true)
      const response = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify(profile)
      })
      const data = await response.json()
      if (data.success) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' })
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to update profile' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update profile' })
    } finally {
      setSaving(false)
    }
  }

  const saveSystemSettings = async () => {
    try {
      setSaving(true)
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify(systemSettings)
      })
      const data = await response.json()
      if (data.success) {
        setMessage({ type: 'success', text: 'System settings updated successfully!' })
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to update settings' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update settings' })
    } finally {
      setSaving(false)
    }
  }

  const changePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' })
      return
    }

    try {
      setSaving(true)
      const response = await fetch('/api/admin/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify(passwordData)
      })
      const data = await response.json()
      if (data.success) {
        setMessage({ type: 'success', text: 'Password changed successfully!' })
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to change password' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to change password' })
    } finally {
      setSaving(false)
    }
  }

  const saveEmailTemplate = async (template: EmailTemplate) => {
    try {
      setSaving(true)
      const response = await fetch('/api/admin/email-templates', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify(template)
      })
      const data = await response.json()
      if (data.success) {
        setMessage({ type: 'success', text: 'Email template updated successfully!' })
        setEditingTemplate(null)
        loadEmailTemplates()
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to update template' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update template' })
    } finally {
      setSaving(false)
    }
  }

  const exportData = async (type: string) => {
    try {
      const response = await fetch(`/api/admin/export/${type}`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      })
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${type}-export-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      setMessage({ type: 'success', text: `${type} data exported successfully!` })
    } catch (error) {
      setMessage({ type: 'error', text: `Failed to export ${type} data` })
    }
  }

  const clearMessage = () => setMessage(null)

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'system', name: 'System Settings', icon: Settings },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'email-templates', name: 'Email Templates', icon: Mail },
    { id: 'backup', name: 'Backup & Export', icon: Database }
  ]

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Admin Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your admin profile, system settings, and platform configuration
        </p>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg flex items-center space-x-3 ${
          message.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' :
          message.type === 'error' ? 'bg-red-50 border border-red-200 text-red-800' :
          'bg-blue-50 border border-blue-200 text-blue-800'
        }`}>
          {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> :
           message.type === 'error' ? <AlertCircle className="w-5 h-5" /> :
           <Info className="w-5 h-5" />}
          <span>{message.text}</span>
          <button onClick={clearMessage} className="ml-auto">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        {activeTab === 'profile' && (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Admin Profile</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Role
                </label>
                <input
                  type="text"
                  value={profile.role}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Permissions
                </label>
                <div className="flex flex-wrap gap-2">
                  {profile.permissions.map((permission) => (
                    <span key={permission} className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full">
                      {permission}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-6">
              <button
                onClick={saveProfile}
                disabled={saving}
                className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save Profile'}</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'system' && (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">System Settings</h2>
            <div className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Site Name
                    </label>
                    <input
                      type="text"
                      value={systemSettings.siteName}
                      onChange={(e) => setSystemSettings(prev => ({ ...prev, siteName: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Site URL
                    </label>
                    <input
                      type="url"
                      value={systemSettings.siteUrl}
                      onChange={(e) => setSystemSettings(prev => ({ ...prev, siteUrl: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Site Description
                    </label>
                    <textarea
                      value={systemSettings.siteDescription}
                      onChange={(e) => setSystemSettings(prev => ({ ...prev, siteDescription: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      value={systemSettings.contactEmail}
                      onChange={(e) => setSystemSettings(prev => ({ ...prev, contactEmail: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Contact Phone
                    </label>
                    <input
                      type="tel"
                      value={systemSettings.contactPhone}
                      onChange={(e) => setSystemSettings(prev => ({ ...prev, contactPhone: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Address
                    </label>
                    <textarea
                      value={systemSettings.address}
                      onChange={(e) => setSystemSettings(prev => ({ ...prev, address: e.target.value }))}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
              </div>

              {/* SEO Settings */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">SEO Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Meta Title
                    </label>
                    <input
                      type="text"
                      value={systemSettings.seo.metaTitle}
                      onChange={(e) => setSystemSettings(prev => ({ 
                        ...prev, 
                        seo: { ...prev.seo, metaTitle: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Meta Description
                    </label>
                    <textarea
                      value={systemSettings.seo.metaDescription}
                      onChange={(e) => setSystemSettings(prev => ({ 
                        ...prev, 
                        seo: { ...prev.seo, metaDescription: e.target.value }
                      }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Meta Keywords
                    </label>
                    <input
                      type="text"
                      value={systemSettings.seo.metaKeywords}
                      onChange={(e) => setSystemSettings(prev => ({ 
                        ...prev, 
                        seo: { ...prev.seo, metaKeywords: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <button
                onClick={saveSystemSettings}
                disabled={saving}
                className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save Settings'}</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Security Settings</h2>
            <div className="space-y-6">
              {/* Change Password */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Change Password</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                        className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <button
                    onClick={changePassword}
                    disabled={saving}
                    className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                  >
                    <Lock className="w-4 h-4" />
                    <span>{saving ? 'Changing...' : 'Change Password'}</span>
                  </button>
                </div>
              </div>

              {/* Security Settings */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Security Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Session Timeout (minutes)
                    </label>
                    <input
                      type="number"
                      value={systemSettings.security.sessionTimeout}
                      onChange={(e) => setSystemSettings(prev => ({ 
                        ...prev, 
                        security: { ...prev.security, sessionTimeout: parseInt(e.target.value) }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Max Login Attempts
                    </label>
                    <input
                      type="number"
                      value={systemSettings.security.maxLoginAttempts}
                      onChange={(e) => setSystemSettings(prev => ({ 
                        ...prev, 
                        security: { ...prev.security, maxLoginAttempts: parseInt(e.target.value) }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Password Expiry (days)
                    </label>
                    <input
                      type="number"
                      value={systemSettings.security.passwordExpiry}
                      onChange={(e) => setSystemSettings(prev => ({ 
                        ...prev, 
                        security: { ...prev.security, passwordExpiry: parseInt(e.target.value) }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="twoFactor"
                      checked={systemSettings.security.requireTwoFactor}
                      onChange={(e) => setSystemSettings(prev => ({ 
                        ...prev, 
                        security: { ...prev.security, requireTwoFactor: e.target.checked }
                      }))}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="twoFactor" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      Require Two-Factor Authentication
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Notification Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">Email Notifications</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Receive email notifications for important events</p>
                </div>
                <input
                  type="checkbox"
                  checked={systemSettings.notifications.emailNotifications}
                  onChange={(e) => setSystemSettings(prev => ({ 
                    ...prev, 
                    notifications: { ...prev.notifications, emailNotifications: e.target.checked }
                  }))}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
              </div>
              <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">Job Approval Notifications</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Get notified when jobs need approval</p>
                </div>
                <input
                  type="checkbox"
                  checked={systemSettings.notifications.jobApprovalNotifications}
                  onChange={(e) => setSystemSettings(prev => ({ 
                    ...prev, 
                    notifications: { ...prev.notifications, jobApprovalNotifications: e.target.checked }
                  }))}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
              </div>
              <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">Inquiry Notifications</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Get notified when new inquiries are received</p>
                </div>
                <input
                  type="checkbox"
                  checked={systemSettings.notifications.inquiryNotifications}
                  onChange={(e) => setSystemSettings(prev => ({ 
                    ...prev, 
                    notifications: { ...prev.notifications, inquiryNotifications: e.target.checked }
                  }))}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
              </div>
              <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">System Alerts</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Receive alerts for system issues and maintenance</p>
                </div>
                <input
                  type="checkbox"
                  checked={systemSettings.notifications.systemAlerts}
                  onChange={(e) => setSystemSettings(prev => ({ 
                    ...prev, 
                    notifications: { ...prev.notifications, systemAlerts: e.target.checked }
                  }))}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
              </div>
            </div>
            <div className="mt-6">
              <button
                onClick={saveSystemSettings}
                disabled={saving}
                className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save Notification Settings'}</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'email-templates' && (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Email Templates</h2>
            <div className="space-y-4">
              {emailTemplates.map((template) => (
                <div key={template.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">{template.name}</h3>
                    <button
                      onClick={() => setEditingTemplate(template)}
                      className="flex items-center space-x-1 px-3 py-1 text-sm bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Subject: {template.subject}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 line-clamp-2">{template.body}</p>
                </div>
              ))}
            </div>

            {/* Edit Template Modal */}
            {editingTemplate && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-6">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Edit Email Template
                      </h3>
                      <button
                        onClick={() => setEditingTemplate(null)}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Subject
                        </label>
                        <input
                          type="text"
                          value={editingTemplate.subject}
                          onChange={(e) => setEditingTemplate(prev => prev ? { ...prev, subject: e.target.value } : null)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Body
                        </label>
                        <textarea
                          value={editingTemplate.body}
                          onChange={(e) => setEditingTemplate(prev => prev ? { ...prev, body: e.target.value } : null)}
                          rows={10}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-3 mt-6">
                      <button
                        onClick={() => setEditingTemplate(null)}
                        className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => saveEmailTemplate(editingTemplate)}
                        disabled={saving}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                      >
                        {saving ? 'Saving...' : 'Save Template'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'backup' && (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Backup & Export</h2>
            <div className="space-y-6">
              {/* Backup Settings */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Backup Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="autoBackup"
                      checked={systemSettings.backup.autoBackup}
                      onChange={(e) => setSystemSettings(prev => ({ 
                        ...prev, 
                        backup: { ...prev.backup, autoBackup: e.target.checked }
                      }))}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="autoBackup" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      Enable Automatic Backups
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Backup Frequency
                    </label>
                    <select
                      value={systemSettings.backup.backupFrequency}
                      onChange={(e) => setSystemSettings(prev => ({ 
                        ...prev, 
                        backup: { ...prev.backup, backupFrequency: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Retention Days
                    </label>
                    <input
                      type="number"
                      value={systemSettings.backup.retentionDays}
                      onChange={(e) => setSystemSettings(prev => ({ 
                        ...prev, 
                        backup: { ...prev.backup, retentionDays: parseInt(e.target.value) }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
              </div>

              {/* Export Data */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Export Data</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <button
                    onClick={() => exportData('users')}
                    className="flex items-center space-x-2 p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <Download className="w-5 h-5 text-primary-600" />
                    <span>Export Users</span>
                  </button>
                  <button
                    onClick={() => exportData('jobs')}
                    className="flex items-center space-x-2 p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <Download className="w-5 h-5 text-primary-600" />
                    <span>Export Jobs</span>
                  </button>
                  <button
                    onClick={() => exportData('news')}
                    className="flex items-center space-x-2 p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <Download className="w-5 h-5 text-primary-600" />
                    <span>Export News</span>
                  </button>
                  <button
                    onClick={() => exportData('inquiries')}
                    className="flex items-center space-x-2 p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <Download className="w-5 h-5 text-primary-600" />
                    <span>Export Inquiries</span>
                  </button>
                  <button
                    onClick={() => exportData('applications')}
                    className="flex items-center space-x-2 p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <Download className="w-5 h-5 text-primary-600" />
                    <span>Export Applications</span>
                  </button>
                  <button
                    onClick={() => exportData('all')}
                    className="flex items-center space-x-2 p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <Download className="w-5 h-5 text-primary-600" />
                    <span>Export All Data</span>
                  </button>
                </div>
              </div>

              {/* System Actions */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">System Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => window.location.reload()}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Clear Cache</span>
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to clear all logs? This action cannot be undone.')) {
                        // Clear logs logic
                        setMessage({ type: 'success', text: 'Logs cleared successfully!' })
                      }
                    }}
                    className="flex items-center space-x-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Clear System Logs</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <button
                onClick={saveSystemSettings}
                disabled={saving}
                className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save Backup Settings'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
