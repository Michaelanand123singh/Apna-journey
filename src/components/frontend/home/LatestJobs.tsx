'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Briefcase, MapPin, Clock, Building, ArrowRight, Calendar, Users } from 'lucide-react'
import { Job } from '@/types'
import AdSenseRectangle from '../ads/AdSenseRectangle'

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
    <section className="py-16 bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Main Content - 8 columns */}
          <div className="lg:col-span-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Latest Job Opportunities</h2>
                <p className="text-gray-600">Discover your next career opportunity in Bihar</p>
              </div>
              <Link
                href="/jobs"
                className="group bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
              >
                <span>View All Jobs</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            {jobs.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-lg">
                <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Jobs Available</h3>
                <p className="text-gray-600">Check back later for new job opportunities.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {jobs.map((job) => (
                  <div key={job._id} className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:-translate-y-1">
                    <div className="p-6">
                      {/* Job Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                            {job.title}
                          </h3>
                          <div className="flex items-center text-gray-600 mb-2">
                            <Building className="w-4 h-4 mr-2 text-gray-400" />
                            <span className="text-sm">{job.company}</span>
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
                            {job.jobType.replace('-', ' ')}
                          </span>
                        </div>
                      </div>

                      {/* Job Details */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-gray-600">
                          <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="text-sm">{job.location}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Clock className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="text-sm">Posted {formatDate(job.createdAt)}</span>
                        </div>
                        {job.salary && (
                          <div className="flex items-center text-gray-600">
                            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                            <span className="text-sm font-medium text-green-600">{job.salary}</span>
                          </div>
                        )}
                      </div>

                      {/* Job Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span className="text-xs text-gray-500">Apply now</span>
                        </div>
                        <Link
                          href={`/jobs/${job.slug}`}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium group-hover:underline"
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

          {/* Sidebar - 4 columns */}
          <div className="lg:col-span-4 space-y-6">
            {/* AdSense Rectangle */}
            <AdSenseRectangle 
              slot="1234567893" 
              className="w-full h-64"
              placeholder="Jobs Sidebar Ad"
            />

            {/* Job Categories */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Job Categories</h3>
              <div className="space-y-3">
                {[
                  { name: 'Government Jobs', count: '150+', color: 'bg-blue-100 text-blue-600' },
                  { name: 'Private Jobs', count: '200+', color: 'bg-green-100 text-green-600' },
                  { name: 'Banking Jobs', count: '75+', color: 'bg-purple-100 text-purple-600' },
                  { name: 'Teaching Jobs', count: '100+', color: 'bg-orange-100 text-orange-600' },
                  { name: 'Healthcare Jobs', count: '50+', color: 'bg-red-100 text-red-600' }
                ].map((category, index) => (
                  <Link
                    key={index}
                    href={`/jobs?category=${category.name.toLowerCase().replace(' ', '-')}`}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-sm text-gray-700">{category.name}</span>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${category.color}`}>
                      {category.count}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick Apply */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Quick Apply</h3>
              <p className="text-sm text-gray-600 mb-4">
                Upload your resume and get matched with relevant job opportunities.
              </p>
              <button className="w-full bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors">
                Upload Resume
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
