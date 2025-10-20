import { NextRequest, NextResponse } from 'next/server'
import cloudinaryService from '@/lib/services/cloudinary'

export async function GET(request: NextRequest) {
  try {
    // Test Cloudinary configuration
    const testResult = await cloudinaryService.uploadFromUrl(
      'https://via.placeholder.com/300x200.png',
      'apna-journey/test'
    )

    return NextResponse.json({
      success: true,
      message: 'Cloudinary configuration test',
      cloudinary: {
        configured: true,
        testUpload: testResult
      }
    })

  } catch (error) {
    console.error('Cloudinary test error:', error)
    return NextResponse.json({
      success: false,
      message: 'Cloudinary configuration error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
