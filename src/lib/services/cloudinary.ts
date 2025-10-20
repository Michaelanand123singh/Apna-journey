import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary - Support both URL format and individual variables
if (process.env.CLOUDINARY_URL) {
  cloudinary.config()
} else {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  })
}

class CloudinaryService {
  async uploadImage(file: Buffer | string, folder: string = 'apna-journey') {
    try {
      let result: any

      if (Buffer.isBuffer(file)) {
        // Use upload_stream for Buffer data
        result = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder,
              resource_type: 'auto',
              quality: 'auto',
              fetch_format: 'auto',
            },
            (error, result) => {
              if (error) reject(error)
              else resolve(result)
            }
          )
          uploadStream.end(file)
        })
      } else {
        // Use regular upload for string URLs
        result = await cloudinary.uploader.upload(file, {
          folder,
          resource_type: 'auto',
          quality: 'auto',
          fetch_format: 'auto',
        })
      }

      return {
        success: true,
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
      }
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed',
      }
    }
  }

  async uploadFromUrl(url: string, folder: string = 'apna-journey') {
    try {
      const result = await cloudinary.uploader.upload(url, {
        folder,
        resource_type: 'auto',
        quality: 'auto',
        fetch_format: 'auto',
      })

      return {
        success: true,
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
      }
    } catch (error) {
      console.error('Error uploading from URL to Cloudinary:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed',
      }
    }
  }

  async deleteImage(publicId: string) {
    try {
      const result = await cloudinary.uploader.destroy(publicId)
      return {
        success: result.result === 'ok',
        result: result.result,
      }
    } catch (error) {
      console.error('Error deleting from Cloudinary:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Delete failed',
      }
    }
  }

  generateImageUrl(publicId: string, options: any = {}) {
    return cloudinary.url(publicId, {
      quality: 'auto',
      fetch_format: 'auto',
      ...options,
    })
  }

  generateThumbnail(publicId: string, width: number = 300, height: number = 200) {
    return cloudinary.url(publicId, {
      width,
      height,
      crop: 'fill',
      quality: 'auto',
      fetch_format: 'auto',
    })
  }

  generateResponsiveImage(publicId: string, options: any = {}) {
    return cloudinary.url(publicId, {
      quality: 'auto',
      fetch_format: 'auto',
      responsive: true,
      ...options,
    })
  }
}

export default new CloudinaryService()
