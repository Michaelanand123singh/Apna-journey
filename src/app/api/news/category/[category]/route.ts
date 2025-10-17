import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db/mongodb'
import News from '@/lib/models/News.model'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ category: string }> }
) {
  try {
    await dbConnect()
    const { category } = await params
    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page') || '1'
    const limit = searchParams.get('limit') || '10'
    const language = searchParams.get('language')
    const featured = searchParams.get('featured')
    
    // Build query
    const query: any = { 
      status: 'published',
      category
    }
    
    if (language) {
      query.language = language
    }
    
    if (featured === 'true') {
      query.isFeatured = true
    }
    
    // Pagination
    const pageNum = parseInt(page)
    const limitNum = parseInt(limit)
    const skip = (pageNum - 1) * limitNum
    
    // Execute query
    const [news, total] = await Promise.all([
      News.find(query)
        .populate('author', 'name email')
        .sort({ publishedAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      News.countDocuments(query)
    ])
    
    // Calculate pagination info
    const pages = Math.ceil(total / limitNum)
    
    return NextResponse.json({
      success: true,
      data: news,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages
      }
    })
    
  } catch (error) {
    console.error('Get news by category error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch news by category' },
      { status: 500 }
    )
  }
}
