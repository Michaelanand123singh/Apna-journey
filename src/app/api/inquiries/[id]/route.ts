import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db/mongodb'
import Inquiry from '@/lib/models/Inquiry.model'
import { verifyAdminTokenFromRequest } from '@/lib/middleware/adminAuth'

// PUT - Update inquiry status/notes (Admin only)
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
    const { status, priority, adminNotes } = body

    // Validate inquiry exists
    const inquiry = await Inquiry.findById(id)
    if (!inquiry) {
      return NextResponse.json(
        { success: false, message: 'Inquiry not found' },
        { status: 404 }
      )
    }

    // Update inquiry
    const updatedInquiry = await Inquiry.findByIdAndUpdate(
      id,
      { 
        status, 
        priority, 
        adminNotes,
        ...(status === 'resolved' && { resolvedAt: new Date() })
      },
      { new: true, runValidators: true }
    )

    return NextResponse.json({
      success: true,
      message: 'Inquiry updated successfully',
      data: updatedInquiry
    })

  } catch (error) {
    console.error('Error updating inquiry:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to update inquiry' },
      { status: 500 }
    )
  }
}

// DELETE - Delete inquiry (Admin only)
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

    // Validate inquiry exists
    const inquiry = await Inquiry.findById(id)
    if (!inquiry) {
      return NextResponse.json(
        { success: false, message: 'Inquiry not found' },
        { status: 404 }
      )
    }

    // Delete inquiry
    await Inquiry.findByIdAndDelete(id)

    return NextResponse.json({
      success: true,
      message: 'Inquiry deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting inquiry:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to delete inquiry' },
      { status: 500 }
    )
  }
}
