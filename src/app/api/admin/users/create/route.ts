import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db/mongodb'
import User from '@/lib/models/User.model'
import { hashPassword } from '@/lib/utils/bcrypt'
import { verifyAdminTokenFromRequest } from '@/lib/middleware/adminAuth'
import { z } from 'zod'

const createUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional(),
  role: z.enum(['user', 'admin']).default('user'),
  status: z.enum(['active', 'banned']).default('active')
})

export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const admin = await verifyAdminTokenFromRequest(request)
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()
    
    const body = await request.json()
    const validatedData = createUserSchema.parse(body)
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: validatedData.email })
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'User with this email already exists' },
        { status: 400 }
      )
    }
    
    // Hash password
    const hashedPassword = await hashPassword(validatedData.password)
    
    // Create user
    const user = await User.create({
      ...validatedData,
      password: hashedPassword
    })
    
    // Return user data (without password)
    const userData = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt
    }
    
    return NextResponse.json({
      success: true,
      message: 'User created successfully',
      data: userData
    }, { status: 201 })
    
  } catch (error: any) {
    console.error('User creation error:', error)
    
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
    
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: 'User with this email already exists' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { success: false, message: 'User creation failed' },
      { status: 500 }
    )
  }
}
