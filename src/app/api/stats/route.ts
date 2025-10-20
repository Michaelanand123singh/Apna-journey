import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db/mongodb'
import Job from '@/lib/models/Job.model'
import News from '@/lib/models/News.model'
import User from '@/lib/models/User.model'

export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    // Get public stats (only approved/published content)
    const [
      activeJobs,
      publishedNews,
      totalUsers,
      recentJobs
    ] = await Promise.all([
      Job.countDocuments({ status: 'approved' }),
      News.countDocuments({ status: 'published' }),
      User.countDocuments(),
      Job.find({ status: 'approved' })
        .populate('postedBy', 'name email')
        .sort({ createdAt: -1 })
        .limit(3)
        .select('title company salary jobType location createdAt')
        .lean()
    ])

    // Get latest news for hero section
    const latestNews = await News.find({ status: 'published' })
      .sort({ publishedAt: -1, createdAt: -1 })
      .limit(1)
      .select('title excerpt publishedAt')
      .lean()

    const stats = {
      activeJobs,
      publishedNews,
      totalUsers,
      recentJobs,
      latestNews: latestNews[0] || null
    }

    return NextResponse.json({
      success: true,
      data: stats
    })

  } catch (error) {
    console.error('Error fetching public stats:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
