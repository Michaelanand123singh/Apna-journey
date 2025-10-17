import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import JobDetails from '@/components/frontend/jobs/JobDetails'
import { ArrowLeft, Share2 } from 'lucide-react'
import Link from 'next/link'

type JobPageParams = { slug: string }

async function getJob(slug: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/jobs/${slug}`, {
      cache: 'no-store'
    })
    
    if (!response.ok) {
      return null
    }
    
    const data = await response.json()
    return data.success ? data.data : null
  } catch (error) {
    console.error('Error fetching job:', error)
    return null
  }
}

export default async function JobPage({ params }: { params: Promise<JobPageParams> }) {
  const { slug } = await params
  const job = await getJob(slug)

  if (!job) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/jobs"
              className="flex items-center text-gray-600 hover:text-primary-500 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Jobs
            </Link>
            <button className="flex items-center text-gray-600 hover:text-primary-500 transition-colors">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </button>
          </div>
        </div>
      </div>

      {/* Job Details */}
      <div className="container mx-auto px-4 py-8">
        <Suspense fallback={
          <div className="bg-white rounded-lg shadow-sm p-8 animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-6"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        }>
          <JobDetails job={job} />
        </Suspense>
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: { params: Promise<JobPageParams> }) {
  const { slug } = await params
  const job = await getJob(slug)

  if (!job) {
    return {
      title: 'Job Not Found',
      description: 'The requested job could not be found.'
    }
  }

  return {
    title: `${job.title} at ${job.company} - Apna Journey`,
    description: job.description.substring(0, 160),
    keywords: `jobs in Gaya, ${job.title}, ${job.company}, ${job.category}, ${job.jobType}`,
    openGraph: {
      title: `${job.title} at ${job.company}`,
      description: job.description.substring(0, 160),
      type: 'article',
      publishedTime: job.createdAt,
    },
  }
}
