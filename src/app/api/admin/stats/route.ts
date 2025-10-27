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

    // Calculate page views based on actual job and news views
    // Get date boundaries
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - today.getDay()) // Start of the week (Sunday)
    
    const startOfMonth = new Date(today)
    startOfMonth.setDate(1) // First day of the month
    
    // Get all job and news views for reference
    const allJobsViews = await Job.aggregate([
      {
        $group: {
          _id: null,
          totalViews: { $sum: '$views' }
        }
      }
    ])
    
    const allNewsViews = await News.aggregate([
      {
        $group: {
          _id: null,
          totalViews: { $sum: '$views' }
        }
      }
    ])
    
    const totalAllViews = (allJobsViews[0]?.totalViews || 0) + (allNewsViews[0]?.totalViews || 0)
    
    // Calculate views for items created/updated today
    const todayJobsViews = await Job.aggregate([
      {
        $match: {
          $or: [
            { createdAt: { $gte: today } },
            { updatedAt: { $gte: today } }
          ]
        }
      },
      {
        $group: {
          _id: null,
          totalViews: { $sum: '$views' }
        }
      }
    ])
    
    const todayNewsViews = await News.aggregate([
      {
        $match: {
          $or: [
            { createdAt: { $gte: today } },
            { updatedAt: { $gte: today } }
          ]
        }
      },
      {
        $group: {
          _id: null,
          totalViews: { $sum: '$views' }
        }
      }
    ])
    
    // Calculate views for items created/updated this week
    const weekJobsViews = await Job.aggregate([
      {
        $match: {
          $or: [
            { createdAt: { $gte: startOfWeek } },
            { updatedAt: { $gte: startOfWeek } }
          ]
        }
      },
      {
        $group: {
          _id: null,
          totalViews: { $sum: '$views' }
        }
      }
    ])
    
    const weekNewsViews = await News.aggregate([
      {
        $match: {
          $or: [
            { createdAt: { $gte: startOfWeek } },
            { updatedAt: { $gte: startOfWeek } }
          ]
        }
      },
      {
        $group: {
          _id: null,
          totalViews: { $sum: '$views' }
        }
      }
    ])
    
    // Calculate views for items created/updated this month
    const monthJobsViews = await Job.aggregate([
      {
        $match: {
          $or: [
            { createdAt: { $gte: startOfMonth } },
            { updatedAt: { $gte: startOfMonth } }
          ]
        }
      },
      {
        $group: {
          _id: null,
          totalViews: { $sum: '$views' }
        }
      }
    ])
    
    const monthNewsViews = await News.aggregate([
      {
        $match: {
          $or: [
            { createdAt: { $gte: startOfMonth } },
            { updatedAt: { $gte: startOfMonth } }
          ]
        }
      },
      {
        $group: {
          _id: null,
          totalViews: { $sum: '$views' }
        }
      }
    ])
    
    // Calculate page views (views of content created/updated in each time period)
    const pageViews = {
      today: (todayJobsViews[0]?.totalViews || 0) + (todayNewsViews[0]?.totalViews || 0),
      thisWeek: (weekJobsViews[0]?.totalViews || 0) + (weekNewsViews[0]?.totalViews || 0),
      thisMonth: (monthJobsViews[0]?.totalViews || 0) + (monthNewsViews[0]?.totalViews || 0),
      allTime: totalAllViews
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
