import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminToken, extractTokenFromHeader } from '@/lib/utils/jwt'
import dbConnect from '@/lib/db/mongodb'
import Admin from '@/lib/models/Admin.model'

export interface AuthenticatedAdminRequest extends NextRequest {
  admin?: {
    _id: string
    email: string
    role: string
    name: string
    permissions: string[]
  }
}

export async function authenticateAdmin(request: NextRequest): Promise<NextResponse | null> {
  try {
    await dbConnect()
    
    const authHeader = request.headers.get('authorization')
    const token = extractTokenFromHeader(authHeader)
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Admin access token required' },
        { status: 401 }
      )
    }
    
    const payload = verifyAdminToken(token)
    if (!payload) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired admin token' },
        { status: 401 }
      )
    }
    
    // Verify admin still exists
    const admin = await Admin.findById(payload.userId).select('-password')
    if (!admin) {
      return NextResponse.json(
        { success: false, message: 'Admin not found' },
        { status: 401 }
      )
    }
    
    // Update last login
    admin.lastLogin = new Date()
    await admin.save()
    
    // Add admin to request object
    ;(request as AuthenticatedAdminRequest).admin = {
      _id: admin._id.toString(),
      email: admin.email,
      role: admin.role,
      name: admin.name,
      permissions: admin.permissions
    }
    
    return null // No error, continue
  } catch (error) {
    console.error('Admin authentication error:', error)
    return NextResponse.json(
      { success: false, message: 'Admin authentication failed' },
      { status: 500 }
    )
  }
}

export async function requireAdminAuth(handler: (req: AuthenticatedAdminRequest) => Promise<NextResponse>) {
  return async (request: NextRequest) => {
    const authResponse = await authenticateAdmin(request)
    if (authResponse) {
      return authResponse
    }
    
    return handler(request as AuthenticatedAdminRequest)
  }
}

export function requirePermission(permission: string) {
  return function(handler: (req: AuthenticatedAdminRequest) => Promise<NextResponse>) {
    return async (request: NextRequest) => {
      const authResponse = await authenticateAdmin(request)
      if (authResponse) {
        return authResponse
      }
      
      const req = request as AuthenticatedAdminRequest
      if (!req.admin?.permissions.includes(permission)) {
        return NextResponse.json(
          { success: false, message: `Permission '${permission}' required` },
          { status: 403 }
        )
      }
      
      return handler(req)
    }
  }
}

// Export verifyAdminToken for direct use in API routes
export async function verifyAdminTokenFromRequest(request: NextRequest) {
  try {
    await dbConnect()
    
    const authHeader = request.headers.get('authorization')
    const token = extractTokenFromHeader(authHeader)
    
    if (!token) {
      return null
    }
    
    const payload = verifyAdminToken(token)
    if (!payload) {
      return null
    }
    
    // Verify admin still exists
    const admin = await Admin.findById(payload.userId).select('-password')
    if (!admin) {
      return null
    }
    
    return {
      id: admin._id.toString(),
      email: admin.email,
      role: admin.role,
      name: admin.name,
      permissions: admin.permissions
    }
  } catch (error) {
    console.error('Admin token verification error:', error)
    return null
  }
}
