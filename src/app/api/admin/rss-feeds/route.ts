import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db/mongodb'
import RssFeed from '@/lib/models/RssFeed.model'
import { verifyAdminTokenFromRequest } from '@/lib/middleware/adminAuth'
import { z } from 'zod'

// Validation schema for RSS feed
const createRssFeedSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters')
    .trim(),
  url: z.string()
    .url('Please enter a valid RSS feed URL')
    .trim(),
  category: z.enum(['politics', 'education', 'crime', 'sports', 'business', 'local-events', 'development', 'health', 'entertainment', 'technology', 'environment', 'other']),
  language: z.enum(['en', 'hi']).default('en'),
  isActive: z.boolean().default(true),
})

const updateRssFeedSchema = createRssFeedSchema.partial()

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
    const isActive = searchParams.get('isActive')
    const search = searchParams.get('search') || ''

    // Build query
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {}
    
    if (isActive !== null && isActive !== '') {
      query.isActive = isActive === 'true'
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { url: { $regex: search, $options: 'i' } }
      ]
    }

    // Get feeds with pagination
    const skip = (page - 1) * limit
    const feeds = await RssFeed.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()

    const total = await RssFeed.countDocuments(query)
    const pages = Math.ceil(total / limit)

    return NextResponse.json({
      success: true,
      data: feeds,
      pagination: {
        page,
        limit,
        total,
        pages
      }
    })

  } catch (error) {
    console.error('Error fetching RSS feeds:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch RSS feeds' },
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
    const validatedData = createRssFeedSchema.parse(body)

    // Check if URL already exists
    const existingFeed = await RssFeed.findOne({ url: validatedData.url })
    if (existingFeed) {
      return NextResponse.json(
        { success: false, message: 'RSS feed with this URL already exists' },
        { status: 400 }
      )
    }

    // Create RSS feed
    const feed = await RssFeed.create({
      ...validatedData,
      createdBy: admin.id
    })

    await feed.populate('createdBy', 'name email')

    return NextResponse.json({
      success: true,
      message: 'RSS feed created successfully',
      data: feed
    }, { status: 201 })

  } catch (error: any) {
    console.error('Error creating RSS feed:', error)
    
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
    
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: 'RSS feed with this URL already exists' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { success: false, message: 'Failed to create RSS feed' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Verify admin authentication
    const admin = await verifyAdminTokenFromRequest(request)
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()

    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Feed ID is required' },
        { status: 400 }
      )
    }

    const validatedData = updateRssFeedSchema.parse(updateData)

    // Check if URL already exists (excluding current feed)
    if (validatedData.url) {
      const existingFeed = await RssFeed.findOne({ 
        url: validatedData.url,
        _id: { $ne: id }
      })
      if (existingFeed) {
        return NextResponse.json(
          { success: false, message: 'RSS feed with this URL already exists' },
          { status: 400 }
        )
      }
    }

    // Update RSS feed
    const feed = await RssFeed.findByIdAndUpdate(
      id,
      validatedData,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email')

    if (!feed) {
      return NextResponse.json(
        { success: false, message: 'RSS feed not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'RSS feed updated successfully',
      data: feed
    })

  } catch (error: any) {
    console.error('Error updating RSS feed:', error)
    
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
      { success: false, message: 'Failed to update RSS feed' },
      { status: 500 }
    )
  }
}

