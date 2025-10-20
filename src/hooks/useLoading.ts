'use client'

import { useState, useCallback } from 'react'

interface LoadingState {
  [key: string]: boolean
}

export function useLoading() {
  const [loadingStates, setLoadingStates] = useState<LoadingState>({})

  const setLoading = useCallback((key: string, isLoading: boolean) => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: isLoading
    }))
  }, [])

  const isLoading = useCallback((key: string) => {
    return loadingStates[key] || false
  }, [loadingStates])

  const withLoading = useCallback(async <T>(
    key: string,
    asyncFn: () => Promise<T>
  ): Promise<T> => {
    setLoading(key, true)
    try {
      const result = await asyncFn()
      return result
    } finally {
      setLoading(key, false)
    }
  }, [setLoading])

  const clearLoading = useCallback((key: string) => {
    setLoadingStates(prev => {
      const newState = { ...prev }
      delete newState[key]
      return newState
    })
  }, [])

  const clearAllLoading = useCallback(() => {
    setLoadingStates({})
  }, [])

  return {
    loadingStates,
    setLoading,
    isLoading,
    withLoading,
    clearLoading,
    clearAllLoading
  }
}
