import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db/mongodb'
import Job from '@/lib/models/Job.model'
import News from '@/lib/models/News.model'
import { verifyAdminTokenFromRequest } from '@/lib/middleware/adminAuth'

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const admin = await verifyAdminTokenFromRequest(request)
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const type = searchParams.get('type') || ''
    const status = searchParams.get('status') || 'pending'

    // Build query for jobs
    const jobQuery: any = {}
    if (status) {
      jobQuery.status = status
    }
    if (search) {
      jobQuery.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ]
    }

    // Build query for news
    const newsQuery: any = {}
    if (status) {
      newsQuery.status = status
    }
    if (search) {
      newsQuery.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ]
    }

    let jobs: any[] = []
    let news: any[] = []

    // Fetch jobs if type is not specified or is 'job'
    if (!type || type === 'job') {
      jobs = await Job.find(jobQuery)
        .populate('postedBy', 'name email')
        .sort({ createdAt: -1 })
        .lean()
    }

    // Fetch news if type is not specified or is 'news'
    if (!type || type === 'news') {
      news = await News.find(newsQuery)
        .populate('author', 'name email')
        .sort({ createdAt: -1 })
        .lean()
    }

    // Combine and format the results
    const combinedContent = [
      ...jobs.map(job => ({
        _id: job._id,
        title: job.title,
        type: 'job' as const,
        author: {
          _id: job.postedBy._id,
          name: job.postedBy.name,
          email: job.postedBy.email
        },
        status: job.status,
        createdAt: job.createdAt,
        company: job.company,
        location: job.location,
        jobType: job.jobType
      })),
      ...news.map(article => ({
        _id: article._id,
        title: article.title,
        type: 'news' as const,
        author: {
          _id: article.author._id,
          name: article.author.name,
          email: article.author.email
        },
        status: article.status,
        createdAt: article.createdAt,
        excerpt: article.excerpt,
        category: article.category,
        isFeatured: article.isFeatured
      }))
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return NextResponse.json({
      success: true,
      data: combinedContent
    })

  } catch (error) {
    console.error('Error fetching pending content:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
