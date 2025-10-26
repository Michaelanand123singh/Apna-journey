'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import AdminHeader from '@/components/admin/layout/AdminHeader'
import AdminSidebar from '@/components/admin/layout/AdminSidebar'
import ErrorBoundary from '@/components/shared/ErrorBoundary'
import { ToastContainer } from '@/components/shared/Toast'
import { useToast } from '@/hooks/useToast'
import { useAuth } from '@/contexts/AuthContext'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { toasts, removeToast } = useToast()
  const { admin, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && !admin && pathname !== '/admin/login') {
      router.push('/admin/login')
    }
  }, [isLoading, admin, pathname, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  // Don't show sidebar and header on login page
  if (pathname === '/admin/login') {
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-gray-50">
          {children}
        </div>
        <ToastContainer toasts={toasts} onClose={removeToast} />
      </ErrorBoundary>
    )
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <AdminSidebar />
        <div className="lg:pl-64">
          <AdminHeader />
          <main className="py-2 sm:py-4 lg:py-6">
            <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
              {children}
            </div>
          </main>
        </div>
      </div>
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </ErrorBoundary>
  )
}