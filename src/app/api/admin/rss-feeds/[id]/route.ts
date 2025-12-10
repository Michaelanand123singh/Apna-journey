import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db/mongodb'
import RssFeed from '@/lib/models/RssFeed.model'
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

    const { id } = await params
    const feed = await RssFeed.findById(id)
      .populate('createdBy', 'name email')
      .lean()

    if (!feed) {
      return NextResponse.json(
        { success: false, message: 'RSS feed not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: feed
    })

  } catch (error) {
    console.error('Error fetching RSS feed:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch RSS feed' },
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
    const feed = await RssFeed.findByIdAndDelete(id)

    if (!feed) {
      return NextResponse.json(
        { success: false, message: 'RSS feed not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'RSS feed deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting RSS feed:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to delete RSS feed' },
      { status: 500 }
    )
  }
}

