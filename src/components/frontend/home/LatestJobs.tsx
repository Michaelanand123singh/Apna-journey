'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Briefcase, MapPin, Clock, Building } from 'lucide-react'
import { Job } from '@/types'

export default function LatestJobs() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLatestJobs()
  }, [])

  const fetchLatestJobs = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/jobs?limit=6&status=active')
      const data = await response.json()
      
      if (data.success) {
        setJobs(data.data)
      }
    } catch (error) {
      console.error('Error fetching latest jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Latest Job Opportunities</h2>
          <Link
            href="/jobs"
            className="text-primary-500 hover:text-primary-600 font-medium flex items-center"
          >
            View All Jobs
            <Briefcase className="ml-2 w-4 h-4" />
          </Link>
        </div>
        
        {jobs.length === 0 ? (
          <div className="text-center py-12">
            <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No Jobs Available</h3>
            <p className="text-gray-600">Check back later for new job opportunities.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <div key={job._id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {job.title}
                    </h3>
                    <div className="flex items-center text-gray-600 mb-2">
                      <Building className="w-4 h-4 mr-2" />
                      <span className="text-sm">{job.company}</span>
                    </div>
                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span className="text-sm">{job.location}</span>
                    </div>
                    <div className="flex items-center text-gray-600 mb-4">
                      <Clock className="w-4 h-4 mr-2" />
                      <span className="text-sm">{formatDate(job.createdAt)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2 py-1 rounded-full">
                      {job.jobType}
                    </span>
                    <span className="text-sm text-gray-600">{job.salary}</span>
                  </div>
                  <Link
                    href={`/jobs/${job.slug}`}
                    className="text-primary-500 hover:text-primary-600 text-sm font-medium"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
