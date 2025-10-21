import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db/mongodb'
import News from '@/lib/models/News.model'
import { verifyToken } from '@/lib/utils/jwt'
import { z } from 'zod'

const createNewsSchema = z.object({
  title: z.string().min(10, 'Title must be at least 10 characters').max(200, 'Title cannot exceed 200 characters'),
  excerpt: z.string().min(20, 'Excerpt must be at least 20 characters').max(500, 'Excerpt cannot exceed 500 characters'),
  content: z.string().min(50, 'Content must be at least 50 characters'),
  featuredImage: z.string().url('Please provide a valid image URL'),
  category: z.enum(['politics', 'education', 'crime', 'sports', 'business', 'local-events', 'development', 'health', 'entertainment', 'technology', 'environment', 'other']),
  tags: z.array(z.string()).optional().default([]),
  language: z.enum(['english', 'hindi']).default('english'),
  status: z.enum(['draft', 'pending', 'published']).default('pending'),
  isFeatured: z.boolean().default(false),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional()
})

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
    const query: any = { author: payload.userId }
    if (status) {
      query.status = status
    }
    
    // Pagination
    const skip = (page - 1) * limit
    
    // Get user's news articles
    const news = await News.find(query)
      .populate('author', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
    
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
    
  } catch (error: any) {
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
      publishedAt: validatedData.status === 'published' ? new Date() : null
    })
    
    return NextResponse.json({
      success: true,
      message: 'News article created successfully. It will be reviewed before publishing.',
      data: news
    }, { status: 201 })
    
  } catch (error: any) {
    console.error('Create news article error:', error)
    
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
