'use client'

import { useState, useEffect } from 'react'
import { Bell, User, Search } from 'lucide-react'

export default function AdminHeader() {
  const [admin, setAdmin] = useState<any>(null)

  useEffect(() => {
    const adminData = localStorage.getItem('admin')
    if (adminData) {
      setAdmin(JSON.parse(adminData))
    }
  }, [])

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Search */}
          <div className="flex-1 max-w-lg">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="p-2 text-gray-400 hover:text-gray-500 relative">
              <Bell className="h-6 w-6" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
            </button>

            {/* Admin info */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-primary-600" />
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-700">
                  {admin?.name || 'Admin'}
                </p>
                <p className="text-xs text-gray-500">
                  {admin?.role || 'Administrator'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
