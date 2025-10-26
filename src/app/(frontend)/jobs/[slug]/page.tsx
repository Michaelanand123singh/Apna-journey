import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import Script from 'next/script'
import JobDetails from '@/components/frontend/jobs/JobDetails'
import { ArrowLeft, Share2 } from 'lucide-react'
import Link from 'next/link'
import { getApiUrl } from '@/lib/utils/api'

type JobPageParams = { slug: string }

async function getJob(slug: string) {
  try {
    const apiUrl = getApiUrl(`/jobs/${slug}`)
    
    const response = await fetch(apiUrl, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    
    if (!response.ok) {
      console.error(`Failed to fetch job: ${response.status} ${response.statusText}`)
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

  // Job Posting Schema
  const jobSchema = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: job.description,
    identifier: {
      '@type': 'PropertyValue',
      name: 'Apna Journey',
      value: job._id,
    },
    datePosted: job.createdAt,
    validThrough: job.deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    employmentType: job.jobType,
    hiringOrganization: {
      '@type': 'Organization',
      name: job.company,
      sameAs: job.website || 'https://apnajourney.com',
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: job.location,
        addressRegion: 'Bihar',
        addressCountry: 'IN',
      },
    },
    baseSalary: {
      '@type': 'MonetaryAmount',
      currency: 'INR',
      value: {
        '@type': 'QuantitativeValue',
        value: job.salary || 0,
        unitText: 'MONTH',
      },
    },
  }

  return (
    <>
      <Script
        id="job-posting-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobSchema) }}
      />
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/jobs"
              className="flex items-center text-gray-600 hover:text-primary-500 transition-colors text-sm sm:text-base"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Jobs
            </Link>
            <button className="flex items-center text-gray-600 hover:text-primary-500 transition-colors text-sm sm:text-base">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </button>
          </div>
          </div>
        </div>

        {/* Job Details */}
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 lg:py-8">
          <Suspense fallback={
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8 animate-pulse">
              <div className="h-6 sm:h-8 bg-gray-200 rounded w-3/4 mb-3 sm:mb-4"></div>
              <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/2 mb-4 sm:mb-6"></div>
              <div className="h-3 sm:h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-3 sm:h-4 bg-gray-200 rounded w-2/3 mb-4 sm:mb-6"></div>
              <div className="h-24 sm:h-32 bg-gray-200 rounded"></div>
            </div>
          }>
            <JobDetails job={job} />
          </Suspense>
        </div>
      </div>
    </>
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

  const cleanDescription = job.description?.replace(/<[^>]*>/g, '').substring(0, 160) || 'Job opportunity in Bihar'

  return {
    title: `${job.title} at ${job.company} - Apna Journey`,
    description: cleanDescription,
    keywords: `jobs in Bihar, ${job.title}, ${job.company}, ${job.category}, ${job.jobType}, Bihar employment, ${job.location} jobs`,
    openGraph: {
      title: `${job.title} at ${job.company}`,
      description: cleanDescription,
      type: 'article',
      publishedTime: job.createdAt,
      images: job.featuredImage ? [job.featuredImage] : [],
      url: `https://apnajourney.com/jobs/${job.slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${job.title} at ${job.company}`,
      description: cleanDescription,
    },
    alternates: {
      canonical: `https://apnajourney.com/jobs/${job.slug}`,
    },
  }
}
