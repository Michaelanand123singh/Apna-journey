import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db/mongodb'
import Application from '@/lib/models/Application.model'
import { verifyToken } from '@/lib/utils/jwt'

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
    
    const applications = await Application.find({ userId: payload.userId })
      .populate('jobId', 'title company location slug')
      .sort({ createdAt: -1 })
      .lean()
    
    return NextResponse.json({
      success: true,
      data: applications
    })
    
  } catch (error: any) {
    console.error('Get applications error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch applications' },
      { status: 500 }
    )
  }
}
