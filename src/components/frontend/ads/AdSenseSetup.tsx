'use client'

import { useEffect } from 'react'

// AdSense setup script
export default function AdSenseSetup() {
  useEffect(() => {
    // Load AdSense script
    const script = document.createElement('script')
    script.async = true
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX' // Replace with your AdSense client ID
    script.crossOrigin = 'anonymous'
    document.head.appendChild(script)

    // Initialize ads
    const initAds = () => {
      if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
        try {
          ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({})
        } catch (error) {
          console.error('AdSense initialization error:', error)
        }
      }
    }

    // Initialize ads after a short delay
    const timer = setTimeout(initAds, 1000)

    return () => {
      clearTimeout(timer)
      // Cleanup if needed
    }
  }, [])

  return null
}


