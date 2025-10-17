import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db/mongodb'
import Application from '@/lib/models/Application.model'
import Job from '@/lib/models/Job.model'
import { jobApplicationSchema } from '@/lib/utils/validation'

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    
    const body = await request.json()
    const validatedData = jobApplicationSchema.parse(body)
    
    // Check if job exists and is approved
    const job = await Job.findById(validatedData.jobId)
    if (!job) {
      return NextResponse.json(
        { success: false, message: 'Job not found' },
        { status: 404 }
      )
    }
    
    if (job.status !== 'approved') {
      return NextResponse.json(
        { success: false, message: 'Job is not available for applications' },
        { status: 400 }
      )
    }
    
    // Check if job has expired
    if (new Date() > job.expiresAt) {
      return NextResponse.json(
        { success: false, message: 'Job application deadline has passed' },
        { status: 400 }
      )
    }
    
    // Get user from Authorization header
    const authHeader = request.headers.get('authorization')
    let userId = null
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7)
      const { verifyToken } = await import('@/lib/utils/jwt')
      const payload = verifyToken(token)
      if (payload) {
        userId = payload.userId
      }
    }
    
    // Check if user has already applied for this job
    if (userId) {
      const existingApplication = await Application.findOne({
        jobId: validatedData.jobId,
        userId: userId
      })
      
      if (existingApplication) {
        return NextResponse.json(
          { success: false, message: 'You have already applied for this job' },
          { status: 400 }
        )
      }
    }
    
    // Create application
    const application = await Application.create({
      ...validatedData,
      userId: userId || null
    })
    
    // Increment application count for the job
    await Job.findByIdAndUpdate(validatedData.jobId, {
      $inc: { applicationCount: 1 }
    })
    
    return NextResponse.json({
      success: true,
      message: 'Application submitted successfully',
      data: {
        applicationId: application._id,
        jobTitle: job.title,
        company: job.company
      }
    }, { status: 201 })
    
  } catch (error: any) {
    console.error('Job application error:', error)
    
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
        { success: false, message: 'You have already applied for this job' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { success: false, message: 'Failed to submit application' },
      { status: 500 }
    )
  }
}
