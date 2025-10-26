'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Briefcase, MapPin, Clock, Building, ArrowRight, Calendar, Users } from 'lucide-react'
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
      const response = await fetch('/api/jobs?limit=6&status=approved')
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
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-6 sm:h-8 bg-gray-200 rounded w-1/3 sm:w-1/4 mb-8"></div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white p-4 sm:p-6 rounded-lg shadow">
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
    <section className="py-12 sm:py-16 bg-gradient-to-br from-slate-50 to-green-50/30 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <div className="flex-1">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Latest Job Opportunities</h2>
            <p className="text-sm sm:text-base text-gray-600">Discover your next career opportunity in Bihar</p>
          </div>
          <Link
            href="/jobs"
            className="group bg-green-600 text-white px-4 py-2.5 sm:px-6 sm:py-3 rounded-lg font-medium hover:bg-green-700 transition-colors inline-flex items-center justify-center space-x-2 text-sm sm:text-base"
          >
            <span>View All Jobs</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        
        {jobs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-lg">
            <Briefcase className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">No Jobs Available</h3>
            <p className="text-sm sm:text-base text-gray-600">Check back later for new job opportunities.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {jobs.map((job) => (
              <div key={job._id} className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:-translate-y-1">
                <div className="p-4 sm:p-6">
                  {/* Job Header */}
                  <div className="flex items-start justify-between mb-3 sm:mb-4 gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
                        {job.title}
                      </h3>
                      <div className="flex items-center text-gray-600 mb-2">
                        <Building className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 text-gray-400 flex-shrink-0" />
                        <span className="text-xs sm:text-sm truncate">{job.company}</span>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <span className="bg-green-100 text-green-800 text-[10px] sm:text-xs font-medium px-2 sm:px-3 py-1 rounded-full whitespace-nowrap">
                        {job.jobType.replace('-', ' ')}
                      </span>
                    </div>
                  </div>

                  {/* Job Details */}
                  <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 text-gray-400 flex-shrink-0" />
                      <span className="text-xs sm:text-sm truncate">{job.location}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 text-gray-400 flex-shrink-0" />
                      <span className="text-xs sm:text-sm">Posted {formatDate(job.createdAt)}</span>
                    </div>
                    {job.salary && (
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 text-gray-400 flex-shrink-0" />
                        <span className="text-xs sm:text-sm font-medium text-green-600">{job.salary}</span>
                      </div>
                    )}
                  </div>

                  {/* Job Footer */}
                  <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-1.5 sm:space-x-2">
                      <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
                      <span className="text-[10px] sm:text-xs text-gray-500">Apply now</span>
                    </div>
                    <Link
                      href={`/jobs/${job.slug}`}
                      className="text-green-600 hover:text-green-700 text-xs sm:text-sm font-medium group-hover:underline"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
