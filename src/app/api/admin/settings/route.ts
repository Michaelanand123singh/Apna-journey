import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db/mongodb'
import { verifyAdminTokenFromRequest } from '@/lib/middleware/adminAuth'

// GET - Fetch system settings
export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const admin = await verifyAdminTokenFromRequest(request)
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()

    // For now, return default settings
    // In a real application, you would store these in a database
    const settings = {
      siteName: 'Apna Journey',
      siteDescription: 'Gaya Ki Awaaz - Jobs & News Platform',
      siteUrl: 'https://apnajourney.com',
      contactEmail: 'info@apnajourney.com',
      contactPhone: '+91 98765 43210',
      address: 'Gaya City Center, Bihar, India - 823001',
      socialMedia: {
        facebook: '',
        twitter: '',
        instagram: '',
        linkedin: ''
      },
      seo: {
        metaTitle: 'Apna Journey - Gaya Ki Awaaz | Jobs & News in Gaya, Bihar',
        metaDescription: 'Find local jobs and stay updated with Gaya news. Your one-stop platform for opportunities and information in Gaya, Bihar.',
        metaKeywords: 'Gaya jobs, Bihar news, local jobs, Gaya news, jobs in Gaya, government jobs Gaya, part time jobs Gaya'
      },
      notifications: {
        emailNotifications: true,
        jobApprovalNotifications: true,
        inquiryNotifications: true,
        systemAlerts: true
      },
      security: {
        sessionTimeout: 30,
        maxLoginAttempts: 5,
        requireTwoFactor: false,
        passwordExpiry: 90
      },
      backup: {
        autoBackup: true,
        backupFrequency: 'daily',
        retentionDays: 30
      }
    }

    return NextResponse.json({
      success: true,
      data: settings
    })

  } catch (error) {
    console.error('Error fetching system settings:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch system settings' },
      { status: 500 }
    )
  }
}

// PUT - Update system settings
export async function PUT(request: NextRequest) {
  try {
    // Verify admin authentication
    const admin = await verifyAdminTokenFromRequest(request)
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()

    const body = await request.json()
    
    // Validate required fields
    if (!body.siteName || !body.contactEmail) {
      return NextResponse.json(
        { success: false, message: 'Site name and contact email are required' },
        { status: 400 }
      )
    }

    // In a real application, you would save these to a database
    // For now, we'll just return success
    console.log('System settings updated:', body)

    return NextResponse.json({
      success: true,
      message: 'System settings updated successfully',
      data: body
    })

  } catch (error) {
    console.error('Error updating system settings:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to update system settings' },
      { status: 500 }
    )
  }
}
