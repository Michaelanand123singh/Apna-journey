'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Building, MapPin, Clock, ArrowRight, Award } from 'lucide-react'
import { Job } from '@/types'

export default function GovernmentJobs() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchGovernmentJobs()
  }, [])

  const fetchGovernmentJobs = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/jobs?category=government&limit=100&status=approved')
      const data = await response.json()
      
      if (data.success) {
        setJobs(data.data)
      }
    } catch (error) {
      console.error('Error fetching government jobs:', error)
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
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-8"></div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg">
              <Award className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Government Jobs</h2>
          </div>
          <p className="text-sm sm:text-base text-gray-600 pl-12">Sarkari naukri in Bihar</p>
        </div>
        <Link
          href="/jobs?category=government"
          className="group bg-green-600 text-white px-4 py-2.5 sm:px-6 sm:py-3 rounded-lg font-medium hover:bg-green-700 transition-colors inline-flex items-center justify-center space-x-2 text-sm sm:text-base"
        >
          <span>View All</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
      
      {jobs.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <Award className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">No Government Jobs</h3>
          <p className="text-sm sm:text-base text-gray-600">Check back later for new opportunities.</p>
        </div>
      ) : (
        <div className="space-y-2">
            {jobs.map((job) => (
              <Link 
                key={job._id} 
                href={`/jobs/${job.slug}`}
                className="group block bg-gray-50 rounded-lg border border-gray-200 hover:border-green-300 hover:shadow-md transition-all duration-200"
              >
                <div className="p-3">
                  <div className="flex items-start justify-between gap-3">
                    {/* Left Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900 line-clamp-1 group-hover:text-green-600 transition-colors mb-1">
                        {job.title}
                      </h3>
                      <div className="flex items-center text-xs text-gray-600 mb-1.5">
                        <Building className="w-3 h-3 mr-1 flex-shrink-0" />
                        <span className="truncate">{job.company}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <div className="flex items-center">
                          <MapPin className="w-3 h-3 mr-0.5" />
                          <span className="truncate">{job.location}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 mr-0.5" />
                          <span>{formatDate(job.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Right Badges */}
                    <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                      <span className="bg-gradient-to-r from-green-600 to-emerald-600 text-white text-[9px] font-medium px-2 py-0.5 rounded whitespace-nowrap">
                        Govt.
                      </span>
                      {job.salary && (
                        <span className="text-[9px] font-medium text-green-600">{job.salary}</span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
        </div>
      )}
    </div>
  )
}
