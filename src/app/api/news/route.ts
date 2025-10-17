import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db/mongodb'
import News from '@/lib/models/News.model'
import { newsFiltersSchema } from '@/lib/utils/validation'

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    
    const { searchParams } = new URL(request.url)
    const filters = Object.fromEntries(searchParams.entries())
    const validatedFilters = newsFiltersSchema.parse(filters)
    
    const {
      category,
      language,
      search,
      featured,
      page = '1',
      limit = '10'
    } = validatedFilters
    
    // Build query
    const query: any = { status: 'published' } // Only show published news
    
    if (category) {
      query.category = category
    }
    
    if (language) {
      query.language = language
    }
    
    if (featured === 'true') {
      query.isFeatured = true
    }
    
    if (search) {
      query.$text = { $search: search }
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
    
  } catch (error: any) {
    console.error('Get news error:', error)
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid query parameters',
          errors: error.errors.map((err: any) => ({
            field: err.path.join('.'),
            message: err.message
          }))
        },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { success: false, message: 'Failed to fetch news' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    
    // Check admin authentication
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Admin authentication required' },
        { status: 401 }
      )
    }
    
    const token = authHeader.substring(7)
    const { verifyAdminToken } = await import('@/lib/utils/jwt')
    const payload = verifyAdminToken(token)
    
    if (!payload) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired admin token' },
        { status: 401 }
      )
    }
    
    const body = await request.json()
    const { createNewsSchema } = await import('@/lib/utils/validation')
    const validatedData = createNewsSchema.parse(body)
    
    // Create news article
    const news = await News.create({
      ...validatedData,
      author: payload.userId
    })
    
    // Populate author field
    await news.populate('author', 'name email')
    
    return NextResponse.json({
      success: true,
      message: 'News article created successfully',
      data: news
    }, { status: 201 })
    
  } catch (error: any) {
    console.error('Create news error:', error)
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Validation failed',
          errors: error.errors.map((err: any) => ({
            field: err.path.join('.'),
            message: err.message
          }))
        },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { success: false, message: 'Failed to create news article' },
      { status: 500 }
    )
  }
}
