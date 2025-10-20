import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db/mongodb'
import Job from '@/lib/models/Job.model'
import News from '@/lib/models/News.model'
import User from '@/lib/models/User.model'
import Application from '@/lib/models/Application.model'
import Inquiry from '@/lib/models/Inquiry.model'
import { verifyAdminTokenFromRequest } from '@/lib/middleware/adminAuth'

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const admin = await verifyAdminTokenFromRequest(request)
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()

    // Get all stats in parallel
    const [
      totalJobs,
      activeJobs,
      pendingJobs,
      totalNews,
      publishedNews,
      draftNews,
      totalUsers,
      totalApplications,
      totalInquiries,
      newInquiries,
      resolvedInquiries
    ] = await Promise.all([
      Job.countDocuments(),
      Job.countDocuments({ status: 'approved' }),
      Job.countDocuments({ status: 'pending' }),
      News.countDocuments(),
      News.countDocuments({ status: 'published' }),
      News.countDocuments({ status: 'draft' }),
      User.countDocuments(),
      Application.countDocuments(),
      Inquiry.countDocuments(),
      Inquiry.countDocuments({ status: 'new' }),
      Inquiry.countDocuments({ status: 'resolved' })
    ])

    // Mock page views data (in a real app, this would come from analytics)
    const pageViews = {
      today: Math.floor(Math.random() * 500) + 100,
      thisWeek: Math.floor(Math.random() * 3000) + 1000,
      thisMonth: Math.floor(Math.random() * 15000) + 5000
    }

    const stats = {
      totalJobs,
      activeJobs,
      pendingJobs,
      totalNews,
      publishedNews,
      draftNews,
      totalUsers,
      totalApplications,
      totalInquiries,
      newInquiries,
      resolvedInquiries,
      pageViews
    }

    return NextResponse.json({
      success: true,
      data: stats
    })

  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
