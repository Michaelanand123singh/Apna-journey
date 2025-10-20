import dbConnect from '@/lib/db/mongodb'

/**
 * Safely connects to the database and returns a connection or null
 * This handles build-time scenarios where MONGODB_URI might not be available
 */
export async function safeDbConnect() {
  try {
    const connection = await dbConnect()
    return connection
  } catch (error) {
    console.warn('⚠️ Database connection failed:', error)
    return null
  }
}

/**
 * Checks if we're in a build context where database operations should be skipped
 */
export function isBuildContext(): boolean {
  return process.env.NEXT_PHASE === 'phase-production-build' || !process.env.MONGODB_URI
}

/**
 * Returns an empty response for build-time scenarios
 */
export function getBuildTimeResponse() {
  return {
    success: true,
    data: [],
    message: 'Build time - no data available'
  }
}
