'use client'

import { usePathname } from 'next/navigation'
import RoleBasedNavbar from '@/components/shared/RoleBasedNavbar'
import Footer from '@/components/frontend/layout/Footer'

interface ConditionalLayoutProps {
  children: React.ReactNode
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname()
  
  // Don't render Header and Footer for admin pages
  const isAdminPage = pathname.startsWith('/admin')
  
  // Don't render Header and Footer for user panel pages (they have their own navbar)
  const isUserPanelPage = pathname.startsWith('/user')
  
  if (isAdminPage || isUserPanelPage) {
    return <>{children}</>
  }
  
  return (
    <>
      <RoleBasedNavbar />
      <main className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
      <Footer />
    </>
  )
}

