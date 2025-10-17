import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, extractTokenFromHeader } from '@/lib/utils/jwt'
import dbConnect from '@/lib/db/mongodb'
import User from '@/lib/models/User.model'

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    _id: string
    email: string
    role: string
    name: string
  }
}

export async function authenticateUser(request: NextRequest): Promise<NextResponse | null> {
  try {
    await dbConnect()
    
    const authHeader = request.headers.get('authorization')
    const token = extractTokenFromHeader(authHeader)
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Access token required' },
        { status: 401 }
      )
    }
    
    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired token' },
        { status: 401 }
      )
    }
    
    // Verify user still exists and is active
    const user = await User.findById(payload.userId).select('-password')
    if (!user || user.status !== 'active') {
      return NextResponse.json(
        { success: false, message: 'User not found or inactive' },
        { status: 401 }
      )
    }
    
    // Add user to request object
    ;(request as AuthenticatedRequest).user = {
      _id: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name
    }
    
    return null // No error, continue
  } catch (error) {
    console.error('Authentication error:', error)
    return NextResponse.json(
      { success: false, message: 'Authentication failed' },
      { status: 500 }
    )
  }
}

export async function requireAuth(handler: (req: AuthenticatedRequest) => Promise<NextResponse>) {
  return async (request: NextRequest) => {
    const authResponse = await authenticateUser(request)
    if (authResponse) {
      return authResponse
    }
    
    return handler(request as AuthenticatedRequest)
  }
}

export async function requireAdmin(handler: (req: AuthenticatedRequest) => Promise<NextResponse>) {
  return async (request: NextRequest) => {
    const authResponse = await authenticateUser(request)
    if (authResponse) {
      return authResponse
    }
    
    const req = request as AuthenticatedRequest
    if (req.user?.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Admin access required' },
        { status: 403 }
      )
    }
    
    return handler(req)
  }
}
