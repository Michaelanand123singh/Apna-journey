import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db/mongodb'
import mongoose from 'mongoose'
import News from '@/lib/models/News.model'
import Admin from '@/lib/models/Admin.model'
import { newsFiltersSchema } from '@/lib/utils/validation'

export async function GET(request: NextRequest) {
  try {
    // Check if we're in build context
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      return NextResponse.json({
        success: true,
        data: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          pages: 0
        }
      })
    }

    await dbConnect()
    
    // Ensure News model is registered
    if (!mongoose.models.News) {
      mongoose.model('News', News.schema)
    }
    
    const { searchParams } = new URL(request.url)
    const filters = Object.fromEntries(searchParams.entries())
    
    // Parse filters with better error handling
    let validatedFilters
    try {
      validatedFilters = newsFiltersSchema.parse(filters)
    } catch (error) {
      console.error('Validation error:', error)
      // Return default values if validation fails
      validatedFilters = {
        category: undefined,
        language: undefined,
        search: undefined,
        featured: undefined,
        page: '1',
        limit: '10'
      }
    }
    
    const {
      category,
      language,
      search,
      featured,
      status,
      page = '1',
      limit = '10'
    } = validatedFilters
    
    // Build query
    const query: any = {}
    
    // Default to published status if not specified
    if (status) {
      query.status = status
    } else {
      query.status = 'published' // Only show published news by default
    }
    
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
      // Use regex search instead of text search to avoid index issues
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ]
    }
    
    // Pagination
    const pageNum = parseInt(page)
    const limitNum = parseInt(limit)
    const skip = (pageNum - 1) * limitNum
    
    // Ensure Admin model is registered
    if (!mongoose.models.Admin) {
      mongoose.model('Admin', Admin.schema)
    }
    
    // Ensure News model is registered
    if (!mongoose.models.News) {
      mongoose.model('News', News.schema)
    }

    // Execute query with error handling
    let news: any[] = []
    let total = 0
    
    try {
      console.log('News API Query:', JSON.stringify(query, null, 2))
      console.log('Pagination:', { pageNum, limitNum, skip })
      
      // Test basic query first
      const testQuery = await News.find({ status: 'published' }).lean()
      console.log('Test query result:', testQuery.length)
      
      const results = await Promise.all([
        News.find(query)
          .sort({ publishedAt: -1, createdAt: -1 })
          .skip(skip)
          .limit(limitNum)
          .lean(),
        News.countDocuments(query)
      ])
      
      news = results[0]
      total = results[1]
      
      console.log('Query results:', { newsCount: news.length, total })
    } catch (dbError) {
      console.error('Database query error:', dbError)
      return NextResponse.json({
        success: true,
        data: [],
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: 0,
          pages: 0
        }
      })
    }
    
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
    
    // Return empty data instead of error for better UX
    return NextResponse.json({
      success: true,
      data: [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        pages: 0
      }
    })
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
