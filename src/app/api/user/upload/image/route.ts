import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/utils/jwt'
import cloudinaryService from '@/lib/services/cloudinary'

export async function POST(request: NextRequest) {
  try {
    // Verify user authentication
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      )
    }
    
    const token = authHeader.substring(7)
    const { verifyToken } = await import('@/lib/utils/jwt')
    const payload = verifyToken(token)
    
    if (!payload) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('image') as File
    const folder = formData.get('folder') as string || 'apna-journey/user-news'

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No image file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' },
        { status: 400 }
      )
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, message: 'File size too large. Maximum size is 5MB.' },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload to Cloudinary
    const uploadResult = await cloudinaryService.uploadImage(buffer, folder)

    if (!uploadResult.success) {
      return NextResponse.json(
        { success: false, message: uploadResult.error || 'Upload failed' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        url: uploadResult.url,
        publicId: uploadResult.publicId,
        width: uploadResult.width,
        height: uploadResult.height
      }
    })

  } catch (error) {
    console.error('Error uploading image:', error)
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('api_key')) {
        return NextResponse.json(
          { success: false, message: 'Cloudinary API key not configured properly' },
          { status: 500 }
        )
      }
      if (error.message.includes('cloud_name')) {
        return NextResponse.json(
          { success: false, message: 'Cloudinary cloud name not configured properly' },
          { status: 500 }
        )
      }
    }
    
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Handle image upload from URL
export async function PUT(request: NextRequest) {
  try {
    // Verify user authentication
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      )
    }
    
    const token = authHeader.substring(7)
    const { verifyToken } = await import('@/lib/utils/jwt')
    const payload = verifyToken(token)
    
    if (!payload) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { imageUrl, folder } = body

    if (!imageUrl) {
      return NextResponse.json(
        { success: false, message: 'No image URL provided' },
        { status: 400 }
      )
    }

    // Validate URL format
    try {
      new URL(imageUrl)
    } catch {
      return NextResponse.json(
        { success: false, message: 'Invalid URL format' },
        { status: 400 }
      )
    }

    // Upload from URL to Cloudinary
    const uploadResult = await cloudinaryService.uploadFromUrl(imageUrl, folder || 'apna-journey/user-news')

    if (!uploadResult.success) {
      return NextResponse.json(
        { success: false, message: uploadResult.error || 'Upload failed' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        url: uploadResult.url,
        publicId: uploadResult.publicId,
        width: uploadResult.width,
        height: uploadResult.height
      }
    })

  } catch (error) {
    console.error('Error uploading image from URL:', error)
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('api_key')) {
        return NextResponse.json(
          { success: false, message: 'Cloudinary API key not configured properly' },
          { status: 500 }
        )
      }
      if (error.message.includes('cloud_name')) {
        return NextResponse.json(
          { success: false, message: 'Cloudinary cloud name not configured properly' },
          { status: 500 }
        )
      }
    }
    
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
