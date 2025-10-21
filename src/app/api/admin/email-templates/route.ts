import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db/mongodb'
import { verifyAdminTokenFromRequest } from '@/lib/middleware/adminAuth'

// GET - Fetch email templates
export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const admin = await verifyAdminTokenFromRequest(request)
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()

    // Default email templates
    const templates = [
      {
        id: 'welcome',
        name: 'Welcome Email',
        subject: 'Welcome to Apna Journey!',
        body: 'Dear {{name}},\n\nWelcome to Apna Journey - Bihar Ki Awaaz! We\'re excited to have you join our community.\n\nYou can now:\n- Browse and apply for local jobs across Bihar\n- Stay updated with Bihar news\n- Post job opportunities\n- Connect with the community\n\nIf you have any questions, feel free to contact us.\n\nBest regards,\nThe Apna Journey Team',
        type: 'welcome'
      },
      {
        id: 'job_approval',
        name: 'Job Approval Email',
        subject: 'Your Job Post Has Been Approved',
        body: 'Dear {{name}},\n\nGreat news! Your job posting "{{jobTitle}}" has been approved and is now live on our platform.\n\nJob Details:\n- Title: {{jobTitle}}\n- Company: {{company}}\n- Location: {{location}}\n- Posted: {{postedDate}}\n\nYour job is now visible to job seekers and will help connect you with potential candidates.\n\nBest regards,\nThe Apna Journey Team',
        type: 'job_approval'
      },
      {
        id: 'job_rejection',
        name: 'Job Rejection Email',
        subject: 'Job Post Requires Modifications',
        body: 'Dear {{name}},\n\nThank you for submitting your job posting "{{jobTitle}}". After review, we need some modifications before we can approve it.\n\nReason: {{reason}}\n\nPlease review and resubmit your job posting with the necessary changes.\n\nIf you have any questions, feel free to contact us.\n\nBest regards,\nThe Apna Journey Team',
        type: 'job_rejection'
      },
      {
        id: 'inquiry_response',
        name: 'Inquiry Response Email',
        subject: 'Thank You for Your Inquiry',
        body: 'Dear {{name}},\n\nThank you for reaching out to us. We have received your inquiry regarding "{{subject}}".\n\nYour message: {{message}}\n\nWe will review your inquiry and get back to you within 24 hours.\n\nIf this is urgent, please call us at +91 98765 43210.\n\nBest regards,\nThe Apna Journey Team',
        type: 'inquiry_response'
      }
    ]

    return NextResponse.json({
      success: true,
      data: templates
    })

  } catch (error) {
    console.error('Error fetching email templates:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch email templates' },
      { status: 500 }
    )
  }
}

// PUT - Update email template
export async function PUT(request: NextRequest) {
  try {
    // Verify admin authentication
    const admin = await verifyAdminTokenFromRequest(request)
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()

    const body = await request.json()
    const { id, name, subject, body: templateBody, type } = body

    // Validate required fields
    if (!id || !name || !subject || !templateBody) {
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
        { status: 400 }
      )
    }

    // In a real application, you would save these to a database
    // For now, we'll just return success
    console.log('Email template updated:', { id, name, subject, body: templateBody, type })

    return NextResponse.json({
      success: true,
      message: 'Email template updated successfully',
      data: {
        id,
        name,
        subject,
        body: templateBody,
        type
      }
    })

  } catch (error) {
    console.error('Error updating email template:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to update email template' },
      { status: 500 }
    )
  }
}
