import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db/mongodb'
import Job from '@/lib/models/Job.model'
import News from '@/lib/models/News.model'
import User from '@/lib/models/User.model'
import Application from '@/lib/models/Application.model'
import { verifyAdminTokenFromRequest } from '@/lib/middleware/adminAuth'

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const admin = await verifyAdminTokenFromRequest(request)
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()

    // Get recent activities from different collections
    const [recentJobs, recentNews, recentUsers, recentApplications] = await Promise.all([
      Job.find({ status: 'pending' })
        .populate('postedBy', 'name email')
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
      News.find({ status: 'draft' })
        .populate('author', 'name')
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
      User.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
      Application.find()
        .populate('jobId', 'title')
        .populate('userId', 'name email')
        .sort({ createdAt: -1 })
        .limit(5)
        .lean()
    ])

    // Format activities
    const activities: Array<{
      id: string
      type: 'job' | 'news' | 'user' | 'application'
      title: string
      description: string
      timestamp: Date
      status?: string
    }> = []

    // Add job activities
    recentJobs.forEach(job => {
      activities.push({
        id: `job-${job._id}`,
        type: 'job',
        title: `New job posted: ${job.title}`,
        description: `Posted by ${job.postedBy?.name || 'Unknown'}`,
        timestamp: job.createdAt,
        status: job.status
      })
    })

    // Add news activities
    recentNews.forEach(news => {
      activities.push({
        id: `news-${news._id}`,
        type: 'news',
        title: `New article: ${news.title}`,
        description: `Created by ${news.author?.name || 'Unknown'}`,
        timestamp: news.createdAt,
        status: news.status
      })
    })

    // Add user activities
    recentUsers.forEach(user => {
      activities.push({
        id: `user-${user._id}`,
        type: 'user',
        title: `New user registered: ${user.name}`,
        description: user.email,
        timestamp: user.createdAt,
        status: user.status
      })
    })

    // Add application activities
    recentApplications.forEach(application => {
      activities.push({
        id: `application-${application._id}`,
        type: 'application',
        title: `New job application`,
        description: `Applied for: ${application.jobId?.title || 'Unknown Job'}`,
        timestamp: application.createdAt,
        status: application.status
      })
    })

    // Sort by timestamp and limit to 20
    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    const recentActivities = activities.slice(0, 20)

    return NextResponse.json({
      success: true,
      data: recentActivities
    })

  } catch (error) {
    console.error('Error fetching recent activity:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
