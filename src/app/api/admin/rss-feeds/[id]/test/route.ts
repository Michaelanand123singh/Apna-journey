import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db/mongodb'
import RssFeed from '@/lib/models/RssFeed.model'
import { verifyAdminTokenFromRequest } from '@/lib/middleware/adminAuth'
import { parseRssFeed } from '@/lib/services/rssParser'

export async function POST(
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

    if (!feed) {
      return NextResponse.json(
        { success: false, message: 'RSS feed not found' },
        { status: 404 }
      )
    }

    // Parse the RSS feed
    const result = await parseRssFeed(id)

    return NextResponse.json({
      success: result.success,
      message: result.success 
        ? `Successfully processed ${result.processed} items. Created ${result.created} articles.`
        : 'Failed to parse RSS feed',
      created: result.created,
      processed: result.processed,
      skipped: result.skipped,
      errors: result.errors
    })

  } catch (error: any) {
    console.error('Error testing RSS feed:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to test RSS feed' },
      { status: 500 }
    )
  }
}

