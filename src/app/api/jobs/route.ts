import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db/mongodb'
import Job from '@/lib/models/Job.model'
import User from '@/lib/models/User.model'
import { jobFiltersSchema } from '@/lib/utils/validation'

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    
    const { searchParams } = new URL(request.url)
    const filters = Object.fromEntries(searchParams.entries())
    const validatedFilters = jobFiltersSchema.parse(filters)
    
    const {
      category,
      jobType,
      location,
      search,
      page = '1',
      limit = '10'
    } = validatedFilters
    
    // Build query efficiently
    const query: Record<string, unknown> = { status: 'approved' } // Only show approved jobs
    
    if (category) {
      query.category = category
    }
    
    if (jobType) {
      query.jobType = jobType
    }
    
    if (location) {
      query.location = location
    }
    
    if (search) {
      query.$text = { $search: search }
    }
    
    // Pagination - ensure valid values
    const pageNum = Math.max(1, parseInt(page) || 1)
    const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 10)) // Cap at 100, min 1
    const skip = (pageNum - 1) * limitNum
    
    // Execute query with optimized projection (only fetch needed fields)
    const [jobs, total] = await Promise.all([
      Job.find(query)
        .select('title slug company description category jobType location salary requirements contactEmail contactPhone views applicationCount expiresAt allowApplication allowDirectMail createdAt updatedAt postedBy')
        .populate('postedBy', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Job.countDocuments(query)
    ])
    
    // Calculate pagination info
    const pages = Math.ceil(total / limitNum) || 1
    
    return NextResponse.json({
      success: true,
      data: jobs,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages
      }
    })
    
  } catch (error: any) {
    console.error('Get jobs error:', error)
    
    if (error.name === 'ZodError') {
      const errors = error.issues || error.errors || []
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid query parameters',
          errors: errors.map((err: any) => ({
            field: err.path ? err.path.join('.') : 'unknown',
            message: err.message || 'Validation error'
          }))
        },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { success: false, message: 'Failed to fetch jobs' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    
    const body = await request.json()
    const { createJobSchema } = await import('@/lib/utils/validation')
    const validatedData = createJobSchema.parse(body)
    
    // Get user from Authorization header
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
    
    // Create job
    const job = await Job.create({
      ...validatedData,
      postedBy: payload.userId,
      expiresAt: validatedData.expiresAt ? new Date(validatedData.expiresAt) : undefined
    })
    
    // Get user details separately to avoid population issues
    const user = await User.findById(payload.userId).select('name email').lean()
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: 'Job created successfully. It will be reviewed before publishing.',
      data: {
        ...job.toObject(),
        postedBy: user
      }
    }, { status: 201 })
    
  } catch (error: any) {
    console.error('Create job error:', error)
    
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
      { success: false, message: 'Failed to create job' },
      { status: 500 }
    )
  }
}
