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
  
  if (isAdminPage) {
    return <>{children}</>
  }
  
  return (
    <>
      <RoleBasedNavbar />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer />
    </>
  )
}

