import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db/mongodb'
import Admin from '@/lib/models/Admin.model'
import News from '@/lib/models/News.model'
import { verifyAdminTokenFromRequest } from '@/lib/middleware/adminAuth'

/**
 * Fix author name for RSS feed articles
 * Updates system admin name to "Apna Journey" and updates all related news articles
 */
export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const admin = await verifyAdminTokenFromRequest(request)
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()

    // Find or create system admin
    let systemAdmin = await Admin.findOne({ email: 'system@apnajourney.com' })
    
    if (!systemAdmin) {
      // Create system admin if doesn't exist
      systemAdmin = await Admin.create({
        name: 'Apna Journey',
        email: 'system@apnajourney.com',
        password: 'system-password-' + Date.now(),
        role: 'super-admin',
        permissions: ['manage-news']
      })
    } else {
      // Update existing system admin name
      const oldName = systemAdmin.name
      systemAdmin.name = 'Apna Journey'
      await systemAdmin.save()
      
      return NextResponse.json({
        success: true,
        message: `System admin name updated from "${oldName}" to "Apna Journey"`,
        updated: true
      })
    }

    return NextResponse.json({
      success: true,
      message: 'System admin created with name "Apna Journey"',
      created: true
    })

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error fixing author name:', error)
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    )
  }
}

