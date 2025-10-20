import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db/mongodb'
import Job from '@/lib/models/Job.model'
import News from '@/lib/models/News.model'

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const type = searchParams.get('type') // 'all', 'jobs', 'news'
    const limit = parseInt(searchParams.get('limit') || '10')
    
    if (!query || query.trim().length < 2) {
      return NextResponse.json({
        success: true,
        data: {
          jobs: [],
          news: [],
          total: 0
        }
      })
    }

    const searchQuery = query.trim()
    const results: any = {
      jobs: [],
      news: [],
      total: 0
    }

    // Search jobs if type is 'all' or 'jobs'
    if (type === 'all' || type === 'jobs') {
      const jobs = await Job.find({
        status: 'approved',
        $text: { $search: searchQuery }
      })
      .populate('postedBy', 'name email')
      .select('title company salary jobType location createdAt slug')
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean()

      results.jobs = jobs
    }

    // Search news if type is 'all' or 'news'
    if (type === 'all' || type === 'news') {
      const news = await News.find({
        status: 'published',
        $text: { $search: searchQuery }
      })
      .populate('author', 'name email')
      .select('title excerpt slug publishedAt category')
      .sort({ publishedAt: -1, createdAt: -1 })
      .limit(limit)
      .lean()

      results.news = news
    }

    results.total = results.jobs.length + results.news.length

    return NextResponse.json({
      success: true,
      data: results
    })

  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { success: false, message: 'Search failed' },
      { status: 500 }
    )
  }
}
