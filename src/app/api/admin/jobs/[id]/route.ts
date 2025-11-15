import { NextRequest, NextResponse } from 'next/server'
import mongoose from 'mongoose'
import dbConnect from '@/lib/db/mongodb'
import User from '@/lib/models/User.model'
import Job from '@/lib/models/Job.model'
import { verifyAdminTokenFromRequest } from '@/lib/middleware/adminAuth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin authentication
    const admin = await verifyAdminTokenFromRequest(request)
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()

    // Ensure User model is registered
    if (!mongoose.models.User) {
      mongoose.model('User', User.schema)
    }

    const { id } = await params
    const job = await Job.findById(id)
      .populate('postedBy', 'name email')
      .lean()

    if (!job) {
      return NextResponse.json(
        { success: false, message: 'Job not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: job
    })

  } catch (error) {
    console.error('Error fetching admin job:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin authentication
    const admin = await verifyAdminTokenFromRequest(request)
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()

    // Ensure User model is registered
    if (!mongoose.models.User) {
      mongoose.model('User', User.schema)
    }

    const { id } = await params
    const job = await Job.findById(id)
    
    if (!job) {
      return NextResponse.json(
        { success: false, message: 'Job not found' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const { createJobSchema } = await import('@/lib/utils/validation')
    const validatedData = createJobSchema.parse(body)

    // Update job - admin edits maintain the current status (don't reset to pending)
    const updatedJob = await Job.findByIdAndUpdate(
      id,
      {
        ...validatedData,
        expiresAt: validatedData.expiresAt ? new Date(validatedData.expiresAt) : undefined
        // Note: We don't change status here - admin edits maintain current status
      },
      { new: true, runValidators: true }
    ).populate('postedBy', 'name email')

    return NextResponse.json({
      success: true,
      message: 'Job updated successfully',
      data: updatedJob
    })

  } catch (error: any) {
    console.error('Error updating admin job:', error)
    
    if (error.name === 'ZodError') {
      const errors = error.issues || error.errors || []
      return NextResponse.json(
        { 
          success: false, 
          message: 'Validation failed',
          errors: errors.map((err: any) => ({
            field: err.path ? err.path.join('.') : 'unknown',
            message: err.message || 'Validation error'
          }))
        },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { success: false, message: 'Failed to update job' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin authentication
    const admin = await verifyAdminTokenFromRequest(request)
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()

    const { id } = await params
    const job = await Job.findByIdAndDelete(id)

    if (!job) {
      return NextResponse.json(
        { success: false, message: 'Job not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Job deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting job:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

