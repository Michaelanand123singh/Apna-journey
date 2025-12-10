/**
 * Image URL utilities for handling and sanitizing image URLs
 */

/**
 * Get Cloudinary cloud name from environment
 */
export function getCloudinaryCloudName(): string {
  const cloudinaryUrl = process.env.CLOUDINARY_URL
  if (cloudinaryUrl) {
    // Extract cloud name from cloudinary://api_key:api_secret@cloud_name
    const match = cloudinaryUrl.match(/@([^/]+)/)
    if (match && match[1]) {
      return match[1]
    }
  }
  return 'demo' // Default fallback
}

/**
 * Get default news image URL
 * Uses a working placeholder or Cloudinary sample image
 */
export function getDefaultNewsImageUrl(): string {
  // If custom default is set, use it
  if (process.env.DEFAULT_NEWS_IMAGE_URL) {
    return process.env.DEFAULT_NEWS_IMAGE_URL
  }
  
  // Use Cloudinary's demo sample image (always works)
  // Correct format: https://res.cloudinary.com/{cloud_name}/image/upload/{transformations}/{public_id}
  // Note: This uses the demo account's sample image as a fallback
  // You can upload your own default image to your Cloudinary account and set DEFAULT_NEWS_IMAGE_URL
  return 'https://res.cloudinary.com/demo/image/upload/w_800,h_400,c_fill,q_auto,f_auto/sample.jpg'
}

/**
 * Sanitize image URL - replace placeholder URLs with Cloudinary default
 */
export function sanitizeImageUrl(imageUrl: string): string {
  // If it's a placeholder URL, use Cloudinary default
  if (imageUrl.includes('via.placeholder.com') || imageUrl.includes('placeholder')) {
    return getDefaultNewsImageUrl()
  }
  
  // If it's already a valid Cloudinary URL, use it
  if (imageUrl.includes('res.cloudinary.com')) {
    return imageUrl
  }
  
  // If it's a valid URL, use it
  try {
    new URL(imageUrl)
    return imageUrl
  } catch {
    // Invalid URL, use default
    return getDefaultNewsImageUrl()
  }
}

/**
 * Check if image URL is valid for Next.js Image component
 */
export function isValidImageUrl(imageUrl: string): boolean {
  try {
    const url = new URL(imageUrl)
    // Check if it's a Cloudinary URL or other allowed domains
    return url.hostname.includes('cloudinary.com') || 
           url.hostname.includes('unsplash.com') ||
           url.protocol === 'https:'
  } catch {
    return false
  }
}

