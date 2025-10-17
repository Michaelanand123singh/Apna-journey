import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db/mongodb'
import News from '@/lib/models/News.model'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await dbConnect()
    const { slug } = await params
    const news = await News.findOne({ slug })
      .populate('author', 'name email')
    
    if (!news) {
      return NextResponse.json(
        { success: false, message: 'News article not found' },
        { status: 404 }
      )
    }
    
    // Only show published articles to public
    if (news.status !== 'published') {
      return NextResponse.json(
        { success: false, message: 'News article not available' },
        { status: 404 }
      )
    }
    
    // Increment view count
    await News.findOneAndUpdate(
      { slug },
      { $inc: { views: 1 } }
    )
    
    return NextResponse.json({
      success: true,
      data: news
    })
    
  } catch (error) {
    console.error('Get news article error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch news article' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
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
    
    const { slug } = await params
    const news = await News.findOne({ slug })
    if (!news) {
      return NextResponse.json(
        { success: false, message: 'News article not found' },
        { status: 404 }
      )
    }
    
    // Check if admin owns the article or is super-admin
    if (news.author.toString() !== payload.userId && payload.role !== 'super-admin') {
      return NextResponse.json(
        { success: false, message: 'Not authorized to update this article' },
        { status: 403 }
      )
    }
    
    const body = await request.json()
    const { createNewsSchema } = await import('@/lib/utils/validation')
    const validatedData = createNewsSchema.parse(body)
    
    // Update news article
    const updatedNews = await News.findOneAndUpdate(
      { slug },
      validatedData,
      { new: true, runValidators: true }
    ).populate('author', 'name email')
    
    return NextResponse.json({
      success: true,
      message: 'News article updated successfully',
      data: updatedNews
    })
    
  } catch (error: any) {
    console.error('Update news article error:', error)
    
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
      { success: false, message: 'Failed to update news article' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
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
    
    const { slug } = await params
    const news = await News.findOne({ slug })
    if (!news) {
      return NextResponse.json(
        { success: false, message: 'News article not found' },
        { status: 404 }
      )
    }
    
    // Check if admin owns the article or is super-admin
    if (news.author.toString() !== payload.userId && payload.role !== 'super-admin') {
      return NextResponse.json(
        { success: false, message: 'Not authorized to delete this article' },
        { status: 403 }
      )
    }
    
    await News.findOneAndDelete({ slug })
    
    return NextResponse.json({
      success: true,
      message: 'News article deleted successfully'
    })
    
  } catch (error) {
    console.error('Delete news article error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to delete news article' },
      { status: 500 }
    )
  }
}
