import { NextRequest, NextResponse } from 'next/server'
import mongoose from 'mongoose'
import dbConnect from '@/lib/db/mongodb'
import User from '@/lib/models/User.model'
import Job from '@/lib/models/Job.model'
import { verifyAdminTokenFromRequest } from '@/lib/middleware/adminAuth'

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status') || ''
    const search = searchParams.get('search') || ''

    // Build query
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {}
    if (status) {
      query.status = status
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ]
    }

    // Get jobs with pagination
    const skip = (page - 1) * limit
    const jobs = await Job.find(query)
      .populate('postedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()

    const total = await Job.countDocuments(query)
    const pages = Math.ceil(total / limit)

    return NextResponse.json({
      success: true,
      data: jobs,
      pagination: {
        page,
        limit,
        total,
        pages
      }
    })

  } catch (error) {
    console.error('Error fetching admin jobs:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // Verify admin authentication
    const admin = await verifyAdminTokenFromRequest(request)
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()

    const { jobId, status, reason } = await request.json()

    if (!jobId || !status) {
      return NextResponse.json(
        { success: false, message: 'Job ID and status are required' },
        { status: 400 }
      )
    }

    const job = await Job.findByIdAndUpdate(
      jobId,
      { 
        status,
        ...(reason && { rejectionReason: reason }),
        reviewedBy: admin.id,
        reviewedAt: new Date()
      },
      { new: true }
    ).populate('postedBy', 'name email')

    if (!job) {
      return NextResponse.json(
        { success: false, message: 'Job not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `Job ${status} successfully`,
      data: job
    })

  } catch (error) {
    console.error('Error updating job status:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
