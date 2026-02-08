import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db/mongodb'
import News from '@/lib/models/News.model'
import cloudinaryService from '@/lib/services/cloudinary'
import { getDefaultNewsImageUrl } from '@/lib/utils/imageUtils'

/**
 * Migrate existing RSS article images to Cloudinary
 * POST /api/admin/rss-feeds/migrate-images
 */
export async function POST(request: NextRequest) {
    try {
        await dbConnect()

        // Find all news articles with external images (not from Cloudinary)
        const newsArticles = await News.find({
            featuredImage: {
                $exists: true,
                $ne: null,
                $not: /res\.cloudinary\.com/
            }
        }).limit(100) // Process in batches of 100

        let migrated = 0
        let failed = 0
        let skipped = 0
        const errors: string[] = []

        console.log(`Found ${newsArticles.length} articles with external images to migrate`)

        for (const article of newsArticles) {
            try {
                const currentImage = article.featuredImage

                // Skip if already default image
                if (!currentImage || currentImage.includes('demo/image/upload')) {
                    skipped++
                    continue
                }

                console.log(`Migrating image for article: ${article.title}`)

                // Upload to Cloudinary
                const uploadResult = await cloudinaryService.uploadFromUrl(
                    currentImage,
                    'apna-journey/rss-feeds'
                )

                if (uploadResult.success && uploadResult.url) {
                    article.featuredImage = uploadResult.url
                    await article.save()
                    migrated++
                    console.log(`✅ Migrated: ${article.title}`)
                } else {
                    failed++
                    const errorMsg = `${article.title}: ${uploadResult.error}`
                    errors.push(errorMsg)
                    console.error(`❌ Failed: ${errorMsg}`)

                    // Set to default image if upload fails
                    article.featuredImage = getDefaultNewsImageUrl()
                    await article.save()
                }
            } catch (error) {
                failed++
                const errorMsg = `${article.title}: ${error instanceof Error ? error.message : 'Unknown error'}`
                errors.push(errorMsg)
                console.error(`❌ Error: ${errorMsg}`)

                // Set to default image on error
                try {
                    article.featuredImage = getDefaultNewsImageUrl()
                    await article.save()
                } catch (saveError) {
                    console.error('Failed to save default image:', saveError)
                }
            }

            // Add small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 500))
        }

        return NextResponse.json({
            success: true,
            message: 'Migration completed',
            stats: {
                total: newsArticles.length,
                migrated,
                failed,
                skipped,
            },
            errors: errors.slice(0, 10), // Return first 10 errors
        })
    } catch (error) {
        console.error('Migration error:', error)
        return NextResponse.json(
            {
                success: false,
                message: error instanceof Error ? error.message : 'Migration failed'
            },
            { status: 500 }
        )
    }
}

/**
 * Get migration status
 * GET /api/admin/rss-feeds/migrate-images
 */
export async function GET() {
    try {
        await dbConnect()

        const [totalArticles, externalImages, cloudinaryImages] = await Promise.all([
            News.countDocuments(),
            News.countDocuments({
                featuredImage: {
                    $exists: true,
                    $ne: null,
                    $not: /res\.cloudinary\.com/
                }
            }),
            News.countDocuments({
                featuredImage: {
                    $regex: /res\.cloudinary\.com/
                }
            })
        ])

        const migrationProgress = totalArticles > 0
            ? Math.round((cloudinaryImages / totalArticles) * 100)
            : 0

        return NextResponse.json({
            success: true,
            stats: {
                totalArticles,
                externalImages,
                cloudinaryImages,
                migrationProgress: `${migrationProgress}%`,
                needsMigration: externalImages > 0
            }
        })
    } catch (error) {
        console.error('Error getting migration status:', error)
        return NextResponse.json(
            { success: false, message: 'Failed to get migration status' },
            { status: 500 }
        )
    }
}
