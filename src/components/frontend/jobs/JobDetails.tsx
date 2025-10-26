'use client'

import { useState } from 'react'
import { Job } from '@/types'
import { 
  MapPin, 
  Clock, 
  Building, 
  Calendar, 
  Mail, 
  Phone, 
  Users,
  CheckCircle,
  ExternalLink
} from 'lucide-react'
import ApplicationForm from './ApplicationForm'

interface JobDetailsProps {
  job: Job
}

export default function JobDetails({ job }: JobDetailsProps) {
  const [showApplicationForm, setShowApplicationForm] = useState(false)

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getJobTypeColor = (jobType: string) => {
    const colors = {
      'full-time': 'bg-green-100 text-green-800',
      'part-time': 'bg-blue-100 text-blue-800',
      'contract': 'bg-orange-100 text-orange-800',
      'internship': 'bg-purple-100 text-purple-800'
    }
    return colors[jobType as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      'government': 'bg-red-100 text-red-800',
      'private': 'bg-blue-100 text-blue-800',
      'part-time': 'bg-green-100 text-green-800',
      'internship': 'bg-purple-100 text-purple-800',
      'work-from-home': 'bg-indigo-100 text-indigo-800',
      'freelance': 'bg-yellow-100 text-yellow-800',
      'education': 'bg-pink-100 text-pink-800',
      'healthcare': 'bg-teal-100 text-teal-800',
      'banking': 'bg-emerald-100 text-emerald-800',
      'it': 'bg-cyan-100 text-cyan-800',
      'marketing': 'bg-rose-100 text-rose-800',
      'other': 'bg-gray-100 text-gray-800'
    }
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const isExpired = new Date(job.expiresAt) < new Date()

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
      {/* Main Content */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-2">{job.title}</h1>
                <div className="flex items-center text-gray-600 mb-2">
                  <Building className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  <span className="text-base sm:text-lg">{job.company}</span>
                </div>
                <div className="flex items-center text-gray-500 text-sm sm:text-base">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  <span>Posted {formatDate(job.createdAt)}</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row lg:flex-col space-y-2 sm:space-y-0 sm:space-x-2 lg:space-x-0 lg:space-y-2 mt-2 sm:mt-0">
                <span className={`px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium rounded-full ${getJobTypeColor(job.jobType)}`}>
                  {job.jobType.replace('-', ' ').toUpperCase()}
                </span>
                <span className={`px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium rounded-full ${getCategoryColor(job.category)}`}>
                  {job.category.replace('-', ' ').toUpperCase()}
                </span>
              </div>
            </div>

            {/* Job Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="flex items-center text-gray-600 text-sm sm:text-base">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
                <span className="truncate">{job.location.replace('-', ' ').toUpperCase()}</span>
              </div>
              {job.salary && (
                <div className="flex items-center text-gray-600 text-sm sm:text-base">
                  <span className="text-green-600 font-bold mr-2">₹</span>
                  <span>{job.salary}</span>
                </div>
              )}
              <div className="flex items-center text-gray-600 text-sm sm:text-base">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
                <span>Expires: {formatDate(job.expiresAt)}</span>
              </div>
              <div className="flex items-center text-gray-600 text-sm sm:text-base">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
                <span>{job.applicationCount} applications</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Job Description</h2>
            <div className="prose max-w-none text-gray-700 whitespace-pre-wrap text-sm sm:text-base leading-relaxed">
              {job.description}
            </div>
          </div>

          {/* Requirements */}
          {job.requirements && job.requirements.length > 0 && (
            <div className="mb-6 sm:mb-8">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Requirements</h2>
              <ul className="space-y-2">
                {job.requirements.map((req, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm sm:text-base">{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Contact Information */}
          <div className="border-t pt-4 sm:pt-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Contact Information</h2>
            <div className="space-y-2">
              <div className="flex items-center text-gray-600 text-sm sm:text-base">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
                <a 
                  href={`mailto:${job.contactEmail}`}
                  className="hover:text-primary-500 transition-colors break-all"
                >
                  {job.contactEmail}
                </a>
              </div>
              <div className="flex items-center text-gray-600 text-sm sm:text-base">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
                <a 
                  href={`tel:${job.contactPhone}`}
                  className="hover:text-primary-500 transition-colors"
                >
                  {job.contactPhone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:sticky lg:top-24">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Apply for this job</h3>
          
          {isExpired ? (
            <div className="text-center py-4">
              <div className="text-red-500 mb-2">
                <Clock className="w-6 h-6 sm:w-8 sm:h-8 mx-auto" />
              </div>
              <p className="text-red-600 font-medium text-sm sm:text-base">Application deadline has passed</p>
              <p className="text-gray-500 text-xs sm:text-sm mt-1">
                This job posting expired on {formatDate(job.expiresAt)}
              </p>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              <div className="text-center">
                <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
                  {job.applicationCount} people have already applied for this position
                </p>
                <button
                  onClick={() => setShowApplicationForm(true)}
                  className="w-full bg-primary-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors text-sm sm:text-base"
                >
                  Apply Now
                </button>
              </div>
              
              <div className="text-center">
                <p className="text-gray-500 text-xs sm:text-sm mb-2">Or apply directly</p>
                <a
                  href={`mailto:${job.contactEmail}?subject=Application for ${job.title}`}
                  className="inline-flex items-center text-primary-500 hover:text-primary-600 transition-colors text-sm sm:text-base"
                >
                  <Mail className="w-4 h-4 mr-1" />
                  Send Email
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </div>
            </div>
          )}

          {/* Job Stats */}
          <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t">
            <h4 className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">Job Statistics</h4>
            <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Views:</span>
                <span>{job.views}</span>
              </div>
              <div className="flex justify-between">
                <span>Applications:</span>
                <span>{job.applicationCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Posted:</span>
                <span>{formatDate(job.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Application Form Modal */}
      {showApplicationForm && (
        <ApplicationForm
          job={job}
          onClose={() => setShowApplicationForm(false)}
        />
      )}
    </div>
  )
}
