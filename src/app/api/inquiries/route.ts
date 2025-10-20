import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db/mongodb'
import Inquiry from '@/lib/models/Inquiry.model'
import { verifyAdminTokenFromRequest } from '@/lib/middleware/adminAuth'

// GET - Fetch all inquiries (Admin only)
export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const admin = await verifyAdminTokenFromRequest(request)
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const type = searchParams.get('type')
    const priority = searchParams.get('priority')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    // Build query
    const query: any = {}
    if (status) query.status = status
    if (type) query.type = type
    if (priority) query.priority = priority

    // Pagination
    const skip = (page - 1) * limit

    // Execute query
    const [inquiries, total] = await Promise.all([
      Inquiry.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Inquiry.countDocuments(query)
    ])

    return NextResponse.json({
      success: true,
      data: inquiries,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Error fetching inquiries:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch inquiries' },
      { status: 500 }
    )
  }
}

// POST - Create new inquiry (Public)
export async function POST(request: NextRequest) {
  try {
    await dbConnect()

    const body = await request.json()
    const { name, email, phone, subject, message, type = 'general' } = body

    // Basic validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, message: 'Name, email, subject, and message are required' },
        { status: 400 }
      )
    }

    // Create inquiry
    const inquiry = await Inquiry.create({
      name,
      email,
      phone,
      subject,
      message,
      type
    })

    return NextResponse.json({
      success: true,
      message: 'Inquiry submitted successfully. We will get back to you soon!',
      data: inquiry
    }, { status: 201 })

  } catch (error: any) {
    console.error('Error creating inquiry:', error)
    
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { success: false, message: 'Validation failed', errors: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, message: 'Failed to submit inquiry' },
      { status: 500 }
    )
  }
}
