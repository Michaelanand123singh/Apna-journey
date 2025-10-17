import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db/mongodb'
import Admin from '@/lib/models/Admin.model'
import { verifyPassword } from '@/lib/utils/bcrypt'
import { loginSchema } from '@/lib/utils/validation'
import { generateAdminToken } from '@/lib/utils/jwt'

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    
    const body = await request.json()
    const validatedData = loginSchema.parse(body)
    
    // Find admin by email
    const admin = await Admin.findOne({ email: validatedData.email })
    if (!admin) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      )
    }
    
    // Verify password
    const isPasswordValid = await verifyPassword(validatedData.password, admin.password)
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      )
    }
    
    // Generate admin token
    const token = generateAdminToken({
      userId: admin._id.toString(),
      email: admin.email,
      role: admin.role
    })
    
    // Update last login
    admin.lastLogin = new Date()
    await admin.save()
    
    // Return admin data (without password)
    const adminData = {
      _id: admin._id.toString(),
      name: admin.name,
      email: admin.email,
      role: admin.role,
      permissions: admin.permissions,
      lastLogin: admin.lastLogin,
      createdAt: admin.createdAt
    }
    
    return NextResponse.json({
      success: true,
      message: 'Admin login successful',
      data: {
        admin: adminData,
        token
      }
    })
    
  } catch (error: any) {
    console.error('Admin login error:', error)
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Validation failed',
          errors: error.errors.map((err: any) => ({
            field: err.path.join('.'),
            message: err.message
          }))
        },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { success: false, message: 'Admin login failed' },
      { status: 500 }
    )
  }
}
