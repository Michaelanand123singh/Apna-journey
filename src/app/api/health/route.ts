import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Basic health check
    const healthCheck = {
      uptime: process.uptime(),
      message: 'OK',
      timestamp: new Date().toISOString(),
      status: 'healthy',
      environment: process.env.NODE_ENV || 'development',
    }

    return NextResponse.json(healthCheck, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      {
        message: 'Health check failed',
        timestamp: new Date().toISOString(),
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 }
    )
  }
}
