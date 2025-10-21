import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db/mongodb'
import News from '@/lib/models/News.model'

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    
    // Simple query without any filters
    const allNews = await News.find({}).lean()
    console.log('All news count:', allNews.length)
    
    // Simple published query
    const publishedNews = await News.find({ status: 'published' }).lean()
    console.log('Published news count:', publishedNews.length)
    
    // Return first few articles
    const sampleNews = publishedNews.slice(0, 3).map(article => ({
      _id: article._id,
      title: article.title,
      status: article.status,
      createdAt: article.createdAt
    }))

    return NextResponse.json({
      success: true,
      data: {
        allNewsCount: allNews.length,
        publishedNewsCount: publishedNews.length,
        sampleNews
      }
    })
    
  } catch (error: any) {
    console.error('Simple news error:', error)
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}
