'use client'

import { ReactNode } from 'react'
import TopLoadingBar from './TopLoadingBar'

interface LoadingProviderProps {
  children: ReactNode
}

export default function LoadingProvider({ children }: LoadingProviderProps) {
  return (
    <>
      <TopLoadingBar />
      {children}
    </>
  )
}
