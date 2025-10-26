'use client'

import { useEffect, useState, Suspense } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

function TopLoadingBarContent() {
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Track route changes
  useEffect(() => {
    setLoading(true)
    setProgress(0)
    
    const timer = setTimeout(() => {
      setProgress(100)
      setTimeout(() => {
        setLoading(false)
        setProgress(0)
      }, 200)
    }, 300)

    return () => clearTimeout(timer)
  }, [pathname, searchParams])

  // Listen to manual loading triggers
  useEffect(() => {
    const handleStart = () => {
      setLoading(true)
      setProgress(0)
    }

    const handleComplete = () => {
      setProgress(100)
      setTimeout(() => {
        setLoading(false)
        setProgress(0)
      }, 200)
    }

    const handleLoadingStart = () => handleStart()
    const handleLoadingComplete = () => handleComplete()

    window.addEventListener('loading-start', handleLoadingStart)
    window.addEventListener('loading-complete', handleLoadingComplete)

    return () => {
      window.removeEventListener('loading-start', handleLoadingStart)
      window.removeEventListener('loading-complete', handleLoadingComplete)
    }
  }, [])

  if (!loading) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-1 shadow-sm">
      <div
        className="h-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-lg transition-all duration-200 ease-out animate-pulse"
        style={{
          width: `${progress}%`,
          transition: progress < 90 ? 'width 0.3s ease-out' : 'width 0.2s ease-out',
          boxShadow: '0 0 10px rgba(99, 102, 241, 0.5)'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
      </div>
    </div>
  )
}

export default function TopLoadingBar() {
  return (
    <Suspense fallback={null}>
      <TopLoadingBarContent />
    </Suspense>
  )
}

// Re-export helper functions for convenience
export { triggerLoading, stopLoading, withLoadingBar as withLoadingBar } from '@/utils/loadingBar'
