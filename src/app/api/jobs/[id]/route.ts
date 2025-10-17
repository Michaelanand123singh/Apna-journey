import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db/mongodb'
import Job from '@/lib/models/Job.model'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect()
    const { id } = await params
    const job = await Job.findById(id)
      .populate('postedBy', 'name email')
    
    if (!job) {
      return NextResponse.json(
        { success: false, message: 'Job not found' },
        { status: 404 }
      )
    }
    
    // Only show approved jobs to public
    if (job.status !== 'approved') {
      return NextResponse.json(
        { success: false, message: 'Job not available' },
        { status: 404 }
      )
    }
    
    // Increment view count
    await Job.findByIdAndUpdate(id, { $inc: { views: 1 } })
    
    return NextResponse.json({
      success: true,
      data: job
    })
    
  } catch (error) {
    console.error('Get job error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch job' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect()
    
    // Check authentication
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      )
    }
    
    const token = authHeader.substring(7)
    const { verifyToken } = await import('@/lib/utils/jwt')
    const payload = verifyToken(token)
    
    if (!payload) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired token' },
        { status: 401 }
      )
    }
    
    const { id } = await params
    const job = await Job.findById(id)
    if (!job) {
      return NextResponse.json(
        { success: false, message: 'Job not found' },
        { status: 404 }
      )
    }
    
    // Check if user owns the job or is admin
    if (job.postedBy.toString() !== payload.userId && payload.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Not authorized to update this job' },
        { status: 403 }
      )
    }
    
    const body = await request.json()
    const { createJobSchema } = await import('@/lib/utils/validation')
    const validatedData = createJobSchema.parse(body)
    
    // Update job
    const updatedJob = await Job.findByIdAndUpdate(
      id,
      {
        ...validatedData,
        expiresAt: new Date(validatedData.expiresAt),
        status: 'pending' // Reset to pending after update
      },
      { new: true, runValidators: true }
    ).populate('postedBy', 'name email')
    
    return NextResponse.json({
      success: true,
      message: 'Job updated successfully',
      data: updatedJob
    })
    
  } catch (error: any) {
    console.error('Update job error:', error)
    
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
    await dbConnect()
    
    // Check authentication
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      )
    }
    
    const token = authHeader.substring(7)
    const { verifyToken } = await import('@/lib/utils/jwt')
    const payload = verifyToken(token)
    
    if (!payload) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired token' },
        { status: 401 }
      )
    }
    
    const { id } = await params
    const job = await Job.findById(id)
    if (!job) {
      return NextResponse.json(
        { success: false, message: 'Job not found' },
        { status: 404 }
      )
    }
    
    // Check if user owns the job or is admin
    if (job.postedBy.toString() !== payload.userId && payload.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Not authorized to delete this job' },
        { status: 403 }
      )
    }
    
    await Job.findByIdAndDelete(id)
    
    return NextResponse.json({
      success: true,
      message: 'Job deleted successfully'
    })
    
  } catch (error) {
    console.error('Delete job error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to delete job' },
      { status: 500 }
    )
  }
}
