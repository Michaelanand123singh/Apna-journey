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

    // Build match stage for aggregation
    const matchStage: any = {}

    // Default to published status if not specified
    if (status) {
      matchStage.status = status
    } else {
      matchStage.status = 'published' // Only show published news by default
    }

    if (category) matchStage.category = category
    if (language) matchStage.language = language
    if (featured === 'true') matchStage.isFeatured = true

    if (search) {
      // Use text search with index
      matchStage.$text = { $search: search }
    }

    // Pagination - reduced max limit to 20
    const pageNum = parseInt(page)
    const limitNum = Math.min(20, parseInt(limit))
    const skip = (pageNum - 1) * limitNum

    // Ensure Admin model is registered
    if (!mongoose.models.Admin) {
      mongoose.model('Admin', Admin.schema)
    }

    // Optimized aggregation pipeline - eliminates N+1 query problem
    const pipeline: any[] = [
      { $match: matchStage },
      { $sort: { publishedAt: -1 as const, createdAt: -1 as const } },
      {
        $facet: {
          data: [
            { $skip: skip },
            { $limit: limitNum },
            // Lookup users
            {
              $lookup: {
                from: 'users',
                localField: 'author',
                foreignField: '_id',
                as: 'userAuthor'
              }
            },
            // Lookup admins
            {
              $lookup: {
                from: 'admins',
                localField: 'author',
                foreignField: '_id',
                as: 'adminAuthor'
              }
            },
            // Merge author based on authorModel
            {
              $addFields: {
                author: {
                  $cond: {
                    if: { $eq: ['$authorModel', 'User'] },
                    then: { $arrayElemAt: ['$userAuthor', 0] },
                    else: { $arrayElemAt: ['$adminAuthor', 0] }
                  }
                }
              }
            },
            // Clean up and remove password
            {
              $project: {
                userAuthor: 0,
                adminAuthor: 0,
                'author.password': 0
              }
            }
          ],
          total: [{ $count: 'count' }]
        }
      }
    ]

    const results = await News.aggregate(pipeline)
    const news = results[0]?.data || []
    const total = results[0]?.total[0]?.count || 0

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
