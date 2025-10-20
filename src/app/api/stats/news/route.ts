import { NextResponse } from 'next/server'
import dbConnect from '@/lib/db/mongodb'
import News from '@/lib/models/News.model'

export async function GET() {
  try {
    await dbConnect()

    // Get news statistics
    const [
      totalArticles,
      publishedArticles,
      totalLanguages,
      totalCategories,
      recentArticles,
      totalViews
    ] = await Promise.all([
      // Total articles count
      News.countDocuments(),
      
      // Published articles count
      News.countDocuments({ status: 'published' }),
      
      // Unique languages count
      News.distinct('language').then(languages => languages.length),
      
      // Unique categories count
      News.distinct('category').then(categories => categories.length),
      
      // Articles published in last 24 hours
      News.countDocuments({
        publishedAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
      }),
      
      // Total views across all articles
      News.aggregate([
        { $group: { _id: null, totalViews: { $sum: '$views' } } }
      ]).then(result => result[0]?.totalViews || 0)
    ])

    // Calculate readers (estimate based on views)
    const estimatedReaders = Math.floor(totalViews * 0.3) // Estimate 30% unique readers

    // Calculate update frequency
    const updateFrequency = recentArticles > 0 ? '24/7' : 'Daily'

    return NextResponse.json({
      success: true,
      data: {
        totalArticles,
        publishedArticles,
        totalLanguages,
        totalCategories,
        recentArticles,
        totalViews,
        estimatedReaders,
        updateFrequency
      }
    })

  } catch (error) {
    console.error('Error fetching news statistics:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch news statistics' },
      { status: 500 }
    )
  }
}
