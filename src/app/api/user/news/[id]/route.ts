import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db/mongodb'
import News from '@/lib/models/News.model'
import { verifyToken } from '@/lib/utils/jwt'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    
    const { id } = await params
    
    // Find the news article and verify ownership
    const news = await News.findOne({ _id: id, author: payload.userId })
    
    if (!news) {
      return NextResponse.json(
        { success: false, message: 'News article not found or you do not have permission to delete it' },
        { status: 404 }
      )
    }
    
    // Delete the news article
    await News.findByIdAndDelete(id)
    
    return NextResponse.json({
      success: true,
      message: 'News article deleted successfully'
    })
    
  } catch (error: any) {
    console.error('Delete news article error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to delete news article' },
      { status: 500 }
    )
  }
}
