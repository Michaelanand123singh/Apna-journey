'use client'

import Link from 'next/link'
import { Job } from '@/types'
import { 
  MapPin, 
  Building, 
  Calendar, 
  Eye, 
  Bookmark, 
  BookmarkCheck, 
  ArrowRight, 
  Users, 
  CheckCircle 
} from 'lucide-react'
import ShareButton from '@/components/shared/ShareButton'
import { useState } from 'react'

interface JobCardProps {
  job: Job
}

export default function JobCard({ job }: JobCardProps) {
  const [isSaved, setIsSaved] = useState(false)

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric'
    })
  }

  const getJobTypeColor = (jobType: string) => {
    const colors = {
      'full-time': 'bg-emerald-50 text-emerald-700 border-emerald-200',
      'part-time': 'bg-emerald-50 text-emerald-700 border-emerald-200',
      'contract': 'bg-amber-50 text-amber-700 border-amber-200',
      'internship': 'bg-purple-50 text-purple-700 border-purple-200'
    }
    return colors[jobType as keyof typeof colors] || 'bg-slate-50 text-slate-700 border-slate-200'
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      'government': 'bg-red-50 text-red-700 border-red-200',
      'private': 'bg-emerald-50 text-emerald-700 border-emerald-200',
      'part-time': 'bg-green-50 text-green-700 border-green-200',
      'internship': 'bg-teal-50 text-teal-700 border-teal-200',
      'work-from-home': 'bg-green-50 text-green-700 border-green-200',
      'freelance': 'bg-yellow-50 text-yellow-700 border-yellow-200',
      'education': 'bg-pink-50 text-pink-700 border-pink-200',
      'healthcare': 'bg-teal-50 text-teal-700 border-teal-200',
      'banking': 'bg-emerald-50 text-emerald-700 border-emerald-200',
      'it': 'bg-cyan-50 text-cyan-700 border-cyan-200',
      'marketing': 'bg-rose-50 text-rose-700 border-rose-200',
      'other': 'bg-slate-50 text-slate-700 border-slate-200'
    }
    return colors[category as keyof typeof colors] || 'bg-slate-50 text-slate-700 border-slate-200'
  }

  const getUrgencyColor = (expiresAt: string | Date) => {
    const daysLeft = Math.ceil((new Date(expiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    if (daysLeft <= 3) return 'text-red-600 bg-red-50'
    if (daysLeft <= 7) return 'text-orange-600 bg-orange-50'
    return 'text-slate-600 bg-slate-50'
  }

  return (
    <div className="group relative bg-white rounded-lg sm:rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-300 overflow-hidden">
      {/* Save Button */}
      <button
        onClick={() => setIsSaved(!isSaved)}
        className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10 p-1 sm:p-1.5 rounded-md bg-white/90 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200 border border-slate-200"
      >
        {isSaved ? (
          <BookmarkCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600" />
        ) : (
          <Bookmark className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 hover:text-green-600" />
        )}
      </button>

      <div className="p-3 sm:p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-2.5 sm:mb-3">
          <div className="flex-1 pr-2 sm:pr-3 min-w-0">
            <div className="flex items-start space-x-2 sm:space-x-3">
              <div className="w-8 h-8 sm:w-12 sm:h-12 flex-shrink-0 bg-gradient-to-br from-green-600 to-emerald-600 rounded-md sm:rounded-lg flex items-center justify-center shadow-sm">
                <Building className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <Link 
                  href={`/jobs/${job.slug}`}
                  className="text-sm sm:text-lg font-semibold text-slate-900 hover:text-green-600 transition-colors line-clamp-1 sm:line-clamp-2"
                >
                  {job.title}
                </Link>
                
                <div className="hidden sm:flex items-center mt-1 sm:mt-2 text-xs sm:text-sm text-slate-600">
                  <Building className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" />
                  <span className="font-medium truncate">{job.company}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-col items-end space-y-1 sm:space-y-2 flex-shrink-0 ml-2">
            <span className={`px-1.5 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-medium rounded-full border whitespace-nowrap ${getJobTypeColor(job.jobType)}`}>
              <span className="hidden sm:inline">{job.jobType.replace('-', ' ')}</span>
              <span className="sm:hidden">{job.jobType.replace('-', ' ').split(' ')[0]}</span>
            </span>
            <span className={`px-1.5 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-medium rounded-full border whitespace-nowrap ${getCategoryColor(job.category)}`}>
              {job.category.replace('-', ' ').split(' ')[0]}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="hidden sm:block text-slate-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2 leading-relaxed">
          {job.description}
        </p>

        {/* Meta Information */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-2.5 sm:mb-3">
          <div className="flex items-center text-[11px] sm:text-sm text-slate-600">
            <div className="p-1 sm:p-1.5 bg-slate-100 rounded-md sm:rounded-lg mr-2 sm:mr-3 flex-shrink-0">
              <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-600" />
            </div>
            <span className="truncate text-[11px] sm:text-sm">{job.location.replace('-', ' ')}</span>
          </div>
          
          {job.salary && (
            <div className="flex items-center text-[11px] sm:text-sm text-slate-600">
              <div className="p-1 sm:p-1.5 bg-green-100 rounded-md sm:rounded-lg mr-2 sm:mr-3 flex-shrink-0">
                <span className="text-green-600 font-bold text-[11px] sm:text-sm">₹</span>
              </div>
              <span className="truncate text-[11px] sm:text-sm">{job.salary}</span>
            </div>
          )}
          
          <div className="hidden sm:flex items-center text-sm">
            <div className="p-1.5 bg-orange-100 rounded-lg mr-3 flex-shrink-0">
              <Calendar className="w-3.5 h-3.5 text-orange-600" />
            </div>
            <span className={`truncate text-xs ${getUrgencyColor(job.expiresAt)} px-2 py-1 rounded-md`}>
              Exp: {formatDate(job.expiresAt)}
            </span>
          </div>
          
          <div className="hidden sm:flex items-center text-sm text-slate-600">
            <div className="p-1.5 bg-green-100 rounded-lg mr-3 flex-shrink-0">
              <Eye className="w-3.5 h-3.5 text-green-600" />
            </div>
            <span className="text-sm">{job.views} views</span>
          </div>
        </div>

        {/* Requirements */}
        {job.requirements && job.requirements.length > 0 && (
          <div className="hidden sm:block mb-4">
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {job.requirements.slice(0, 2).map((req, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 sm:px-3 py-0.5 sm:py-1 bg-slate-50 text-slate-700 text-xs rounded-lg font-medium border border-slate-200"
                >
                  <CheckCircle className="w-3 h-3 mr-1 sm:mr-1.5 text-green-500 flex-shrink-0" />
                  <span className="truncate max-w-[120px] sm:max-w-none">{req}</span>
                </span>
              ))}
              {job.requirements.length > 2 && (
                <span className="inline-flex items-center px-2 sm:px-3 py-0.5 sm:py-1 bg-green-50 text-green-700 text-xs rounded-lg font-medium border border-green-200">
                  +{job.requirements.length - 2} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-2.5 sm:pt-3 border-t border-slate-100 gap-2 sm:gap-3">
          <div className="flex items-center space-x-2 sm:space-x-4 text-[11px] sm:text-xs text-slate-500">
            <span>{formatDate(job.createdAt)}</span>
            <div className="hidden sm:flex items-center space-x-1">
              <Users className="w-3 h-3" />
              <span>50+ applicants</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <ShareButton
              url={`https://apnajourney.com/jobs/${job.slug}`}
              title={`${job.title} at ${job.company}`}
              description={job.description?.replace(/<[^>]*>/g, '').substring(0, 100) || 'Bihar-first platform with India-wide job opportunities'}
              type="job"
              showText={false}
              className="hidden sm:inline-flex px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors text-sm"
            />
            <Link
              href={`/jobs/${job.slug}`}
              className="flex-1 sm:flex-none bg-gradient-to-r from-green-600 to-emerald-600 text-white px-3 sm:px-5 py-2 sm:py-2.5 rounded-md sm:rounded-lg text-sm font-medium hover:from-green-700 hover:to-emerald-700 transition-all duration-200 inline-flex items-center justify-center space-x-2 shadow-sm hover:shadow-md"
            >
              <span>View Details</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
