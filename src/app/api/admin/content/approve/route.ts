import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db/mongodb'
import Job from '@/lib/models/Job.model'
import News from '@/lib/models/News.model'
import { verifyAdminTokenFromRequest } from '@/lib/middleware/adminAuth'
import { z } from 'zod'

const approveContentSchema = z.object({
  type: z.enum(['job', 'news']),
  id: z.string(),
  status: z.enum(['approved', 'rejected']),
  reason: z.string().optional()
})

export async function PATCH(request: NextRequest) {
  try {
    // Verify admin authentication
    const admin = await verifyAdminTokenFromRequest(request)
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()

    const body = await request.json()
    const { type, id, status, reason } = approveContentSchema.parse(body)

    let content
    if (type === 'job') {
      content = await Job.findByIdAndUpdate(
        id,
        { 
          status,
          rejectionReason: reason,
          reviewedBy: admin.id,
          reviewedAt: new Date()
        },
        { new: true }
      ).populate('postedBy', 'name email')
    } else if (type === 'news') {
      content = await News.findByIdAndUpdate(
        id,
        { 
          status,
          rejectionReason: reason,
          reviewedBy: admin.id,
          reviewedAt: new Date()
        },
        { new: true }
      ).populate('author', 'name email')
    }

    if (!content) {
      return NextResponse.json(
        { success: false, message: 'Content not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `Content ${status} successfully`,
      data: content
    })

  } catch (error: any) {
    console.error('Content approval error:', error)
    
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
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
