/**
 * Get the base URL for API calls
 * Works in development, production, and all deployment platforms
 */
export function getApiBaseUrl(): string {
  // If NEXT_PUBLIC_API_URL is set, use it (for custom deployments)
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL
  }

  // For Vercel deployments
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }

  // For other platforms (Netlify, Railway, etc.)
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  }

  // For local development
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000'
  }

  // Fallback - try to construct from request headers in production
  // This will be handled by the server-side rendering
  return 'http://localhost:3000'
}

/**
 * Get the full API URL for a specific endpoint
 */
export function getApiUrl(endpoint: string): string {
  const baseUrl = getApiBaseUrl()
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  return `${baseUrl}/api${cleanEndpoint}`
}

/**
 * Check if we're running on the server side
 */
export function isServerSide(): boolean {
  return typeof window === 'undefined'
}

/**
 * Get the appropriate URL for API calls based on environment
 * This function handles both server-side and client-side scenarios
 */
export function getApiUrlForFetch(endpoint: string): string {
  // For server-side rendering, we need absolute URLs
  if (isServerSide()) {
    return getApiUrl(endpoint)
  }
  
  // For client-side, relative URLs work fine
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  return `/api${cleanEndpoint}`
}
