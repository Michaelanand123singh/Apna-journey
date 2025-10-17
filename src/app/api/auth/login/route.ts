import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db/mongodb'
import User from '@/lib/models/User.model'
import { verifyPassword } from '@/lib/utils/bcrypt'
import { loginSchema } from '@/lib/utils/validation'
import { generateToken } from '@/lib/utils/jwt'

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    
    const body = await request.json()
    const validatedData = loginSchema.parse(body)
    
    // Find user by email
    const user = await User.findOne({ email: validatedData.email })
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      )
    }
    
    // Check if user is active
    if (user.status !== 'active') {
      return NextResponse.json(
        { success: false, message: 'Account is inactive. Please contact support.' },
        { status: 401 }
      )
    }
    
    // Verify password
    const isPasswordValid = await verifyPassword(validatedData.password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      )
    }
    
    // Generate token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role
    })
    
    // Return user data (without password)
    const userData = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
      resumeUrl: user.resumeUrl,
      createdAt: user.createdAt
    }
    
    return NextResponse.json({
      success: true,
      message: 'Login successful',
      data: {
        user: userData,
        token
      }
    })
    
  } catch (error: any) {
    console.error('Login error:', error)
    
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
      { success: false, message: 'Login failed' },
      { status: 500 }
    )
  }
}
