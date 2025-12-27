import { NextRequest, NextResponse } from 'next/server'
import { unstable_cache } from 'next/cache'
import dbConnect from '@/lib/db/mongodb'
import Job from '@/lib/models/Job.model'
import News from '@/lib/models/News.model'

// Cache homepage data for 5 minutes
const getHomepageData = unstable_cache(
    async () => {
        await dbConnect()

        const [
            stats,
            latestJobs,
            governmentJobs,
            internshipJobs,
            privateSectorJobs,
            itSoftwareJobs,
            marketingSalesJobs,
            latestNews
        ] = await Promise.all([
            // Stats
            Promise.all([
                Job.countDocuments({ status: 'approved' }),
                News.countDocuments({ status: 'published' })
            ]).then(([activeJobs, publishedNews]) => ({
                activeJobs,
                publishedNews
            })),

            // Latest Jobs (limit 10)
            Job.find({ status: 'approved' })
                .select('title slug company category jobType location salary createdAt')
                .sort({ createdAt: -1 })
                .limit(10)
                .lean(),

            // Government Jobs (limit 10)
            Job.find({ status: 'approved', category: 'government' })
                .select('title slug company category jobType location salary createdAt')
                .sort({ createdAt: -1 })
                .limit(10)
                .lean(),

            // Internship Jobs (limit 10)
            Job.find({ status: 'approved', category: 'internship' })
                .select('title slug company category jobType location salary createdAt')
                .sort({ createdAt: -1 })
                .limit(10)
                .lean(),

            // Private Sector Jobs (limit 10)
            Job.find({ status: 'approved', category: 'private' })
                .select('title slug company category jobType location salary createdAt')
                .sort({ createdAt: -1 })
                .limit(10)
                .lean(),

            // IT & Software Jobs (limit 10)
            Job.find({ status: 'approved', category: 'it' })
                .select('title slug company category jobType location salary createdAt')
                .sort({ createdAt: -1 })
                .limit(10)
                .lean(),

            // Marketing & Sales Jobs (limit 10)
            Job.find({ status: 'approved', category: 'marketing' })
                .select('title slug company category jobType location salary createdAt')
                .sort({ createdAt: -1 })
                .limit(10)
                .lean(),

            // Latest News (limit 9)
            News.find({ status: 'published' })
                .select('title slug excerpt featuredImage category isFeatured views publishedAt createdAt')
                .sort({ publishedAt: -1, createdAt: -1 })
                .limit(9)
                .lean()
        ])

        return {
            stats,
            jobs: {
                latest: latestJobs,
                government: governmentJobs,
                internship: internshipJobs,
                privateSector: privateSectorJobs,
                itSoftware: itSoftwareJobs,
                marketingSales: marketingSalesJobs
            },
            news: latestNews
        }
    },
    ['homepage-data'],
    {
        revalidate: 300, // 5 minutes
        tags: ['homepage']
    }
)

export async function GET(request: NextRequest) {
    try {
        const data = await getHomepageData()

        return NextResponse.json({
            success: true,
            data
        })
    } catch (error) {
        console.error('Homepage API error:', error)
        return NextResponse.json(
            { success: false, message: 'Failed to fetch homepage data' },
            { status: 500 }
        )
    }
}
