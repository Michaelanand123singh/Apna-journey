import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db/mongodb'
import News from '@/lib/models/News.model'
import { verifyAdminTokenFromRequest } from '@/lib/middleware/adminAuth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin authentication
    const admin = await verifyAdminTokenFromRequest(request)
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()

    const { id } = await params
    const news = await News.findById(id)
      .populate('author', 'name email')
      .lean()

    if (!news) {
      return NextResponse.json(
        { success: false, message: 'News article not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: news
    })

  } catch (error) {
    console.error('Error fetching news article:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin authentication
    const admin = await verifyAdminTokenFromRequest(request)
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()

    const { id } = await params
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
    if (!title || !excerpt || !content || !category) {
      return NextResponse.json(
        { success: false, message: 'Title, excerpt, content, and category are required' },
        { status: 400 }
      )
    }

    const news = await News.findByIdAndUpdate(
      id,
      {
        title,
        excerpt,
        content,
        featuredImage,
        category,
        tags: tags || [],
        language: language || 'english',
        status: status || 'draft',
        isFeatured: isFeatured || false,
        seoTitle,
        seoDescription,
        updatedAt: new Date()
      },
      { new: true }
    ).populate('author', 'name email')

    if (!news) {
      return NextResponse.json(
        { success: false, message: 'News article not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'News article updated successfully',
      data: news
    })

  } catch (error) {
    console.error('Error updating news article:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin authentication
    const admin = await verifyAdminTokenFromRequest(request)
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()

    const { id } = await params
    const news = await News.findByIdAndDelete(id)

    if (!news) {
      return NextResponse.json(
        { success: false, message: 'News article not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'News article deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting news article:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
