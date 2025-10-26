'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import JobCard from './JobCard'
import { Job } from '@/types'
import { ListLoader } from '@/components/shared/PageLoader'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import LoadingButton from '@/components/shared/LoadingButton'

function JobListContent() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 15,
    total: 0,
    pages: 0
  })

  const searchParams = useSearchParams()

  useEffect(() => {
    fetchJobs()
  }, [searchParams])

  const fetchJobs = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      searchParams.forEach((value, key) => {
        params.append(key, value)
      })

      const response = await fetch(`/api/jobs?${params.toString()}`)
      const data = await response.json()

      if (data.success) {
        setJobs(data.data)
        setPagination(data.pagination)
      } else {
        setError(data.message || 'Failed to fetch jobs')
      }
    } catch (err) {
      setError('Failed to fetch jobs')
      console.error('Error fetching jobs:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <ListLoader items={6} />
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <div className="text-red-500 mb-4">
          <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Error Loading Jobs</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <LoadingButton
          onClick={fetchJobs}
          loading={loading}
          loadingText="Retrying..."
        >
          Try Again
        </LoadingButton>
      </div>
    )
  }

  if (jobs.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <div className="text-gray-400 mb-4">
          <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">No Jobs Found</h3>
        <p className="text-gray-600 mb-4">
          We couldn't find any jobs matching your criteria. Try adjusting your filters.
        </p>
        <button
          onClick={() => window.location.href = '/jobs'}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          View All Jobs
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
        <p className="text-sm sm:text-base text-gray-600">
          Showing {jobs.length} of {pagination.total} jobs
        </p>
        <div className="text-xs sm:text-sm text-gray-500">
          Page {pagination.page} of {pagination.pages}
        </div>
      </div>

      <div className="space-y-4">
        {jobs.map((job) => (
          <JobCard key={job._id} job={job} />
        ))}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="mt-6 sm:mt-8 flex justify-center">
          <div className="flex flex-wrap justify-center gap-2">
            {pagination.page > 1 && (
              <button
                onClick={() => {
                  const params = new URLSearchParams(searchParams)
                  params.set('page', (pagination.page - 1).toString())
                  window.location.href = `/jobs?${params.toString()}`
                }}
                className="px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Previous
              </button>
            )}
            
            {[...Array(pagination.pages)].map((_, i) => {
              const page = i + 1
              const isCurrentPage = page === pagination.page
              
              return (
                <button
                  key={page}
                  onClick={() => {
                    const params = new URLSearchParams(searchParams)
                    params.set('page', page.toString())
                    window.location.href = `/jobs?${params.toString()}`
                  }}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    isCurrentPage
                      ? 'bg-green-600 text-white'
                      : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              )
            })}
            
            {pagination.page < pagination.pages && (
              <button
                onClick={() => {
                  const params = new URLSearchParams(searchParams)
                  params.set('page', (pagination.page + 1).toString())
                  window.location.href = `/jobs?${params.toString()}`
                }}
                className="px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Next
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default function JobList() {
  return (
    <Suspense fallback={
      <div className="space-y-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    }>
      <JobListContent />
    </Suspense>
  )
}
