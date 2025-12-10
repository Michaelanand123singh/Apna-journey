import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db/mongodb'
import News from '@/lib/models/News.model'
import { verifyAdminTokenFromRequest } from '@/lib/middleware/adminAuth'
import cloudinaryService from '@/lib/services/cloudinary'

/**
 * Fix existing news articles with placeholder images
 * Uploads placeholder images to Cloudinary and updates the database
 */
export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const admin = await verifyAdminTokenFromRequest(request)
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()

    // Find all news articles with placeholder images
    const articlesWithPlaceholders = await News.find({
      featuredImage: { $regex: /via\.placeholder\.com|placeholder/i }
    })

    if (articlesWithPlaceholders.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No articles with placeholder images found',
        updated: 0
      })
    }

    // Extract cloud name from CLOUDINARY_URL
    const cloudinaryUrl = process.env.CLOUDINARY_URL
    let cloudName = 'demo'
    
    if (cloudinaryUrl) {
      const match = cloudinaryUrl.match(/@([^/]+)/)
      if (match && match[1]) {
        cloudName = match[1]
      }
    }

    // Default Cloudinary image URL
    const defaultImageUrl = process.env.DEFAULT_NEWS_IMAGE_URL || 
      `https://res.cloudinary.com/${cloudName}/image/upload/w_800,h_400,c_fill,q_auto,f_auto/v1/apna-journey/default-news.jpg`

    let updated = 0
    let errors: string[] = []

    // Update each article
    for (const article of articlesWithPlaceholders) {
      try {
        // Update with default Cloudinary image
        article.featuredImage = defaultImageUrl
        await article.save()
        updated++
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        errors.push(`Article ${article._id}: ${errorMessage}`)
      }
    }

    return NextResponse.json({
      success: true,
      message: `Updated ${updated} articles`,
      updated,
      total: articlesWithPlaceholders.length,
      errors: errors.length > 0 ? errors : undefined
    })

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error fixing news images:', error)
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    )
  }
}

