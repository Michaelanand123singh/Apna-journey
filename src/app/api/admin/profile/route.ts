import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db/mongodb'
import Admin from '@/lib/models/Admin.model'
import { verifyAdminTokenFromRequest } from '@/lib/middleware/adminAuth'

// PUT - Update admin profile
export async function PUT(request: NextRequest) {
  try {
    // Verify admin authentication
    const admin = await verifyAdminTokenFromRequest(request)
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()

    const body = await request.json()
    const { name, email } = body

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { success: false, message: 'Name and email are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Please enter a valid email address' },
        { status: 400 }
      )
    }

    // Check if email is already taken by another admin
    const existingAdmin = await Admin.findOne({ 
      email: email.toLowerCase(), 
      _id: { $ne: admin.id } 
    })
    
    if (existingAdmin) {
      return NextResponse.json(
        { success: false, message: 'Email address is already in use' },
        { status: 400 }
      )
    }

    // Update admin profile
    const updatedAdmin = await Admin.findByIdAndUpdate(
      admin.id,
      {
        name: name.trim(),
        email: email.toLowerCase()
      },
      { new: true, runValidators: true }
    ).select('-password')

    if (!updatedAdmin) {
      return NextResponse.json(
        { success: false, message: 'Admin not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        _id: updatedAdmin._id,
        name: updatedAdmin.name,
        email: updatedAdmin.email,
        role: updatedAdmin.role,
        permissions: updatedAdmin.permissions,
        lastLogin: updatedAdmin.lastLogin,
        createdAt: updatedAdmin.createdAt
      }
    })

  } catch (error: any) {
    console.error('Error updating admin profile:', error)
    
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { success: false, message: 'Validation failed', errors: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, message: 'Failed to update profile' },
      { status: 500 }
    )
  }
}
