import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db/mongodb'
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
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status') || ''
    const search = searchParams.get('search') || ''

    // Build query
    const query: any = {}
    if (status) {
      query.status = status
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ]
    }

    // Get news with pagination
    const skip = (page - 1) * limit
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

  } catch (error) {
    console.error('Error fetching admin news:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const admin = await verifyAdminTokenFromRequest(request)
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()

    const body = await request.json()
    const {
      title,
      excerpt,
      content,
      featuredImage,
      category,
      tags,
      language,
      status,
      isFeatured,
      seoTitle,
      seoDescription
    } = body

    // Validate required fields
    if (!title || !excerpt || !content || !category || !featuredImage) {
      return NextResponse.json(
        { success: false, message: 'Title, excerpt, content, category, and featured image are required' },
        { status: 400 }
      )
    }

    // Create news article
    const news = new News({
      title,
      excerpt,
      content,
      featuredImage,
      category,
      tags: tags || [],
      language: language || 'english',
      author: admin.id,
      status: status || 'draft',
      isFeatured: isFeatured || false,
      seoTitle,
      seoDescription
    })

    await news.save()

    return NextResponse.json({
      success: true,
      message: 'News article created successfully',
      data: news
    })

  } catch (error: any) {
    console.error('Error creating news article:', error)
    
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const validationErrors: Record<string, string> = {}
      Object.keys(error.errors).forEach(key => {
        validationErrors[key] = error.errors[key].message
      })
      
      return NextResponse.json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      }, { status: 400 })
    }
    
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
