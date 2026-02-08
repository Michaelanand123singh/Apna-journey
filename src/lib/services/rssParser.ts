import Parser from 'rss-parser'
import dbConnect from '@/lib/db/mongodb'
import RssFeed from '@/lib/models/RssFeed.model'
import News from '@/lib/models/News.model'
import Admin from '@/lib/models/Admin.model'
import { getDefaultNewsImageUrl } from '@/lib/utils/imageUtils'
import cloudinaryService from '@/lib/services/cloudinary'

const parser = new Parser({
  timeout: 10000, // 10 seconds timeout
  customFields: {
    item: [
      ['media:content', 'mediaContent', { keepArray: true }],
      ['media:thumbnail', 'mediaThumbnail'],
      ['content:encoded', 'contentEncoded'],
      ['description', 'description'],
      ['itunes:image', 'itunesImage'],
      ['image', 'image'],
    ]
  }
})

interface ParsedFeedItem {
  title: string
  link: string
  pubDate?: string
  content?: string
  contentSnippet?: string
  description?: string
  contentEncoded?: string
  mediaContent?: Array<{ $: { url: string } }>
  mediaThumbnail?: { $: { url: string } }
  itunesImage?: { $: { href: string } }
  image?: { url: string } | string
  enclosure?: {
    url: string
    type: string
  }
  categories?: string[]
}

/**
 * Convert relative URL to absolute URL
 */
function resolveUrl(url: string, baseUrl: string): string {
  try {
    // If already absolute, return as is
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url
    }

    // Resolve relative URL
    const base = new URL(baseUrl)
    return new URL(url, base).href
  } catch {
    return url
  }
}

/**
 * Extract image URL from feed item with comprehensive parsing
 */
function extractImageUrl(item: ParsedFeedItem, feedUrl: string): string | null {
  // 1. Try media:content first (most common in RSS 2.0)
  if (item.mediaContent && item.mediaContent.length > 0) {
    const mediaUrl = item.mediaContent[0]?.$?.url
    if (mediaUrl) {
      return resolveUrl(mediaUrl, feedUrl)
    }
  }

  // 2. Try media:thumbnail
  if (item.mediaThumbnail?.$?.url) {
    return resolveUrl(item.mediaThumbnail.$.url, feedUrl)
  }

  // 3. Try iTunes image
  if (item.itunesImage?.$?.href) {
    return resolveUrl(item.itunesImage.$.href, feedUrl)
  }

  // 4. Try image field (RSS 2.0 standard)
  if (item.image) {
    if (typeof item.image === 'string') {
      return resolveUrl(item.image, feedUrl)
    }
    if (item.image.url) {
      return resolveUrl(item.image.url, feedUrl)
    }
  }

  // 5. Try enclosure (for podcasts/media)
  if (item.enclosure && item.enclosure.type?.startsWith('image/')) {
    return resolveUrl(item.enclosure.url, feedUrl)
  }

  // 6. Try to extract from content/description HTML (multiple patterns)
  const htmlContent = item.contentEncoded || item.content || item.description || ''
  if (htmlContent) {
    // Try multiple image extraction patterns
    const patterns = [
      /<img[^>]+src=["']([^"']+)["']/i,  // Standard img tag
      /<img[^>]+src=([^\s>]+)/i,         // img without quotes
      /background-image:\s*url\(["']?([^"')]+)["']?\)/i,  // CSS background
      /og:image["'\s]*content=["']([^"']+)["']/i,  // Open Graph meta
      /twitter:image["'\s]*content=["']([^"']+)["']/i,  // Twitter card
    ]

    for (const pattern of patterns) {
      const match = htmlContent.match(pattern)
      if (match && match[1]) {
        const extractedUrl = match[1].trim()
        if (extractedUrl && !extractedUrl.startsWith('data:')) {
          return resolveUrl(extractedUrl, feedUrl)
        }
      }
    }
  }

  // 7. Try extracting from article link (fetch og:image)
  // This would require HTTP request, so we'll skip for now to avoid blocking

  return null // No image found
}

/**
 * Validate and sanitize image URL from RSS feed
 * RSS feeds already provide valid image URLs - use them directly
 */
function validateImageUrl(imageUrl: string): string | null {
  if (!imageUrl || typeof imageUrl !== 'string') {
    return null
  }

  // Skip placeholder URLs - use default instead
  if (imageUrl.includes('via.placeholder.com') || imageUrl.includes('placeholder')) {
    return null
  }

  // Validate URL format
  try {
    const url = new URL(imageUrl)
    // Only allow http/https protocols
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return null
    }
    return imageUrl
  } catch {
    // Invalid URL format
    return null
  }
}

/**
 * Get default image URL (use Cloudinary or a configured default)
 */
function getDefaultImageUrl(): string {
  return getDefaultNewsImageUrl()
}

/**
 * Clean HTML content and extract text
 */
function cleanHtmlContent(html: string, maxLength: number = 500): string {
  if (!html) return ''

  // Remove HTML tags
  let text = html.replace(/<[^>]*>/g, ' ')

  // Decode HTML entities
  text = text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")

  // Clean up whitespace
  text = text.replace(/\s+/g, ' ').trim()

  // Truncate if needed
  if (text.length > maxLength) {
    text = text.substring(0, maxLength).trim() + '...'
  }

  return text
}

/**
 * Generate excerpt from content
 */
function generateExcerpt(item: ParsedFeedItem, maxLength: number = 300): string {
  const content = item.contentSnippet ||
    cleanHtmlContent(item.contentEncoded || '', maxLength) ||
    cleanHtmlContent(item.description || '', maxLength) ||
    cleanHtmlContent(item.content || '', maxLength) ||
    ''

  if (content.length <= maxLength) {
    return content
  }

  // Truncate at word boundary
  const truncated = content.substring(0, maxLength)
  const lastSpace = truncated.lastIndexOf(' ')
  return lastSpace > 0 ? truncated.substring(0, lastSpace) + '...' : truncated + '...'
}

/**
 * Parse a single RSS feed and create news articles
 */
export async function parseRssFeed(feedId: string): Promise<{
  success: boolean
  processed: number
  created: number
  skipped: number
  errors: string[]
}> {
  const errors: string[] = []
  let processed = 0
  let created = 0
  let skipped = 0

  try {
    await dbConnect()

    // Get feed from database
    const feed = await RssFeed.findById(feedId)
    if (!feed) {
      throw new Error(`RSS feed with ID ${feedId} not found`)
    }

    if (!feed.isActive) {
      return {
        success: true,
        processed: 0,
        created: 0,
        skipped: 0,
        errors: ['Feed is inactive']
      }
    }

    // Parse RSS feed
    let parsedFeed
    try {
      parsedFeed = await parser.parseURL(feed.url)
    } catch (parseError: unknown) {
      const errorMessage = parseError instanceof Error ? parseError.message : 'Failed to parse RSS feed'
      // Update feed with error
      feed.lastError = errorMessage
      feed.errorCount += 1
      feed.lastFetchedAt = new Date()
      await feed.save()

      throw new Error(`Failed to parse RSS feed: ${errorMessage}`)
    }

    if (!parsedFeed.items || parsedFeed.items.length === 0) {
      feed.lastError = 'No items found in RSS feed'
      feed.errorCount += 1
      feed.lastFetchedAt = new Date()
      await feed.save()

      return {
        success: true,
        processed: 0,
        created: 0,
        skipped: 0,
        errors: ['No items found in RSS feed']
      }
    }

    // Get system admin for RSS feed articles
    let systemAdmin = await Admin.findOne({ email: 'system@apnajourney.com' })
    if (!systemAdmin) {
      // Create system admin if doesn't exist
      systemAdmin = await Admin.create({
        name: 'Apna Journey',
        email: 'system@apnajourney.com',
        password: 'system-password-' + Date.now(), // This won't be used for login
        role: 'super-admin',
        permissions: ['manage-news']
      })
    } else if (systemAdmin.name !== 'Apna Journey') {
      // Update existing system admin name if it's still "System"
      systemAdmin.name = 'Apna Journey'
      await systemAdmin.save()
    }

    // Process each feed item
    for (const item of parsedFeed.items) {
      processed++

      try {
        const parsedItem = item as ParsedFeedItem

        // Skip if no title or link
        if (!parsedItem.title || !parsedItem.link) {
          skipped++
          continue
        }

        // Check if article already exists (by link)
        const existingNews = await News.findOne({
          $or: [
            { slug: parsedItem.link.split('/').pop()?.split('?')[0] || '' },
            { content: { $regex: parsedItem.link, $options: 'i' } }
          ]
        })

        if (existingNews) {
          skipped++
          continue
        }

        // Extract data
        const title = parsedItem.title.trim()

        // Upload image to Cloudinary instead of using external URL
        let imageUrl = getDefaultImageUrl()
        const extractedImageUrl = extractImageUrl(parsedItem, feed.url)

        if (extractedImageUrl) {
          const validatedImageUrl = validateImageUrl(extractedImageUrl)
          if (validatedImageUrl) {
            try {
              console.log(`Uploading RSS image to Cloudinary: ${validatedImageUrl}`)

              // Upload to Cloudinary with retry logic
              const uploadResult = await cloudinaryService.uploadFromUrl(
                validatedImageUrl,
                'apna-journey/rss-feeds'
              )

              if (uploadResult.success && uploadResult.url) {
                imageUrl = uploadResult.url
                console.log(`Successfully uploaded RSS image to Cloudinary: ${imageUrl}`)
              } else {
                console.warn(`Failed to upload RSS image to Cloudinary: ${uploadResult.error}`)
                // Fallback to default image
                imageUrl = getDefaultImageUrl()
              }
            } catch (error) {
              console.error('Error uploading RSS image to Cloudinary:', error)
              // Fallback to default image on error
              imageUrl = getDefaultImageUrl()
            }
          }
        }

        const excerpt = generateExcerpt(parsedItem, 300)
        const content = parsedItem.contentEncoded ||
          parsedItem.content ||
          parsedItem.description ||
          excerpt

        // Generate tags from categories
        const tags: string[] = []
        if (parsedItem.categories && Array.isArray(parsedItem.categories)) {
          tags.push(...parsedItem.categories.slice(0, 5).map(cat => {
            if (typeof cat === 'string') {
              return cat
            }
            if (typeof cat === 'object' && cat !== null && 'toString' in cat) {
              return String(cat)
            }
            return String(cat)
          }))
        }

        // Create news article
        const newsData = {
          title,
          excerpt: excerpt || title.substring(0, 200),
          content: cleanHtmlContent(content, 10000) || excerpt || title,
          featuredImage: imageUrl,
          category: feed.category,
          tags: tags.length > 0 ? tags : [],
          language: feed.language,
          author: systemAdmin._id,
          authorModel: 'Admin' as const,
          status: 'pending' as const, // RSS articles need approval
          isFeatured: false,
          views: 0,
          seoTitle: title.substring(0, 60),
          seoDescription: excerpt.substring(0, 160)
        }

        await News.create(newsData)
        created++

      } catch (itemError: unknown) {
        const errorMessage = itemError instanceof Error ? itemError.message : 'Unknown error'
        errors.push(`Item ${processed}: ${errorMessage}`)
        skipped++
      }
    }

    // Update feed statistics
    feed.lastFetchedAt = new Date()
    feed.fetchCount += 1
    feed.successCount += created > 0 ? 1 : 0
    feed.errorCount += errors.length > 0 ? 1 : 0
    feed.lastError = errors.length > 0 ? errors[0] : null
    await feed.save()

    return {
      success: true,
      processed,
      created,
      skipped,
      errors
    }

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error(`Error parsing RSS feed ${feedId}:`, error)

    // Update feed with error
    try {
      await dbConnect()
      const feed = await RssFeed.findById(feedId)
      if (feed) {
        feed.lastError = errorMessage
        feed.errorCount += 1
        feed.lastFetchedAt = new Date()
        await feed.save()
      }
    } catch (updateError) {
      console.error('Error updating feed:', updateError)
    }

    return {
      success: false,
      processed,
      created,
      skipped,
      errors: [errorMessage]
    }
  }
}

/**
 * Parse all active RSS feeds
 */
export async function parseAllActiveFeeds(): Promise<{
  totalFeeds: number
  processedFeeds: number
  totalCreated: number
  totalSkipped: number
  errors: string[]
}> {
  try {
    await dbConnect()

    const activeFeeds = await RssFeed.find({ isActive: true })
    const results = {
      totalFeeds: activeFeeds.length,
      processedFeeds: 0,
      totalCreated: 0,
      totalSkipped: 0,
      errors: [] as string[]
    }

    for (const feed of activeFeeds) {
      try {
        const result = await parseRssFeed(feed._id.toString())
        results.processedFeeds++
        results.totalCreated += result.created
        results.totalSkipped += result.skipped
        if (result.errors.length > 0) {
          results.errors.push(`Feed "${feed.name}": ${result.errors.join(', ')}`)
        }
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        results.errors.push(`Feed "${feed.name}": ${errorMessage}`)
      }
    }

    return results
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error parsing all RSS feeds:', error)
    return {
      totalFeeds: 0,
      processedFeeds: 0,
      totalCreated: 0,
      totalSkipped: 0,
      errors: [errorMessage]
    }
  }
}
