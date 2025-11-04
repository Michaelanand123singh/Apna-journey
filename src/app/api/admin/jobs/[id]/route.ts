import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db/mongodb'
import Job from '@/lib/models/Job.model'
import { verifyAdminTokenFromRequest } from '@/lib/middleware/adminAuth'

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

