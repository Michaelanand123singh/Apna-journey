import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db/mongodb'
import News from '@/lib/models/News.model'
import { verifyToken } from '@/lib/utils/jwt'
import { createNewsSchema } from '@/lib/utils/validation'
import { ZodError } from 'zod'

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      )
    }
    
    const token = authHeader.substring(7)
    const payload = verifyToken(token)
    
    if (!payload) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired token' },
        { status: 401 }
      )
    }
    
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status') || ''
    
    // Build query for user's news articles
    const query: Record<string, unknown> = { author: payload.userId }
    if (status) {
      query.status = status
    }
    
    // Pagination
    const skip = (page - 1) * limit
    
    // Get user's news articles
    const news = await News.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
    
    // Populate author information for each news article
    for (let i = 0; i < news.length; i++) {
      const article = news[i]
      if (article.authorModel === 'User') {
        const User = await import('@/lib/models/User.model')
        const user = await User.default.findById(article.author).select('name email').lean()
        if (user) {
          article.author = user
        }
      } else if (article.authorModel === 'Admin') {
        const Admin = await import('@/lib/models/Admin.model')
        const admin = await Admin.default.findById(article.author).select('name email').lean()
        if (admin) {
          article.author = admin
        }
      }
    }
    
    const total = await News.countDocuments(query)
    const pages = Math.ceil(total / limit)
    
    return NextResponse.json({
      success: true,
      data: news,
      pagination: {
        page,
        limit,
        total,
        pages
      }
    })
    
  } catch (error: unknown) {
    console.error('Get user news error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch news articles' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      )
    }
    
    const token = authHeader.substring(7)
    const payload = verifyToken(token)
    
    if (!payload) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired token' },
        { status: 401 }
      )
    }
    
    const body = await request.json()
    const validatedData = createNewsSchema.parse(body)
    
    // Create news article
    const news = await News.create({
      ...validatedData,
      author: payload.userId,
      authorModel: 'User',
      publishedAt: validatedData.status === 'published' ? new Date() : null
    })
    
    return NextResponse.json({
      success: true,
      message: 'News article created successfully. It will be reviewed before publishing.',
      data: news
    }, { status: 201 })
    
  } catch (error: unknown) {
    console.error('Create news article error:', error)
    
    if (error instanceof ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Validation failed',
          errors: error.issues.map((err) => ({
            field: err.path.join('.'),
            message: err.message
          }))
        },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { success: false, message: 'Failed to create news article', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
