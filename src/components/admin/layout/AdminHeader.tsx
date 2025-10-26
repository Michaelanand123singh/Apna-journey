'use client'

import { useState, useEffect } from 'react'
import { Bell, User, Search, Menu } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function AdminHeader() {
  const { admin } = useAuth()
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-gray-200">
      <div className="px-2 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Mobile menu button - only show on mobile */}
          <div className="lg:hidden">
            <button
              onClick={() => {
                // This will be handled by the sidebar component
                const event = new CustomEvent('toggleSidebar')
                window.dispatchEvent(event)
              }}
              className="p-2 text-gray-400 hover:text-gray-500"
              aria-label="Toggle sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>

          {/* Search - responsive */}
          <div className={`flex-1 ${isSearchOpen ? 'block' : 'hidden sm:block'} max-w-lg mx-2 sm:mx-4`}>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search..."
                className="block w-full pl-8 sm:pl-10 pr-3 py-1.5 sm:py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 text-sm"
              />
            </div>
          </div>

          {/* Mobile search toggle */}
          <div className="sm:hidden">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-gray-400 hover:text-gray-500"
              aria-label="Toggle search"
            >
              <Search className="h-5 w-5" />
            </button>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-4">
            {/* Notifications */}
            <button className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-500 relative">
              <Bell className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
              <span className="absolute top-0 right-0 block h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-red-400 ring-1 sm:ring-2 ring-white"></span>
            </button>

            {/* Admin info */}
            <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <User className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-primary-600" />
              </div>
              <div className="hidden sm:block">
                <p className="text-xs sm:text-sm font-medium text-gray-700">
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
