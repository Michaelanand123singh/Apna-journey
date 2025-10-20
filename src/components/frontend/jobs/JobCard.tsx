'use client'

import Link from 'next/link'
import { Job } from '@/types'
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Building, 
  Calendar, 
  Eye, 
  Bookmark,
  BookmarkCheck,
  ArrowRight,
  Star,
  TrendingUp,
  Users,
  Briefcase,
  CheckCircle
} from 'lucide-react'
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
      'part-time': 'bg-blue-50 text-blue-700 border-blue-200',
      'contract': 'bg-amber-50 text-amber-700 border-amber-200',
      'internship': 'bg-purple-50 text-purple-700 border-purple-200'
    }
    return colors[jobType as keyof typeof colors] || 'bg-slate-50 text-slate-700 border-slate-200'
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      'government': 'bg-red-50 text-red-700 border-red-200',
      'private': 'bg-blue-50 text-blue-700 border-blue-200',
      'part-time': 'bg-green-50 text-green-700 border-green-200',
      'internship': 'bg-purple-50 text-purple-700 border-purple-200',
      'work-from-home': 'bg-indigo-50 text-indigo-700 border-indigo-200',
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
    <div className="group bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-300 overflow-hidden">
      {/* Save Button */}
      <button
        onClick={() => setIsSaved(!isSaved)}
        className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-white/90 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200 border border-slate-200"
      >
        {isSaved ? (
          <BookmarkCheck className="w-4 h-4 text-blue-600" />
        ) : (
          <Bookmark className="w-4 h-4 text-slate-400 hover:text-blue-600" />
        )}
      </button>

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 pr-3">
            <div className="flex items-start space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
                <Building className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <Link 
                  href={`/jobs/${job.slug}`}
                  className="text-lg font-semibold text-slate-900 hover:text-blue-600 transition-colors line-clamp-2"
                >
                  {job.title}
                </Link>
                
                <div className="flex items-center mt-2 text-sm text-slate-600">
                  <Building className="w-4 h-4 mr-2" />
                  <span className="font-medium">{job.company}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-col items-end space-y-2">
            <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getJobTypeColor(job.jobType)}`}>
              {job.jobType.replace('-', ' ')}
            </span>
            <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getCategoryColor(job.category)}`}>
              {job.category.replace('-', ' ')}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-slate-600 text-sm mb-4 line-clamp-2 leading-relaxed">
          {job.description}
        </p>

        {/* Meta Information */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center text-sm text-slate-600">
            <div className="p-1.5 bg-slate-100 rounded-lg mr-3">
              <MapPin className="w-3.5 h-3.5 text-slate-600" />
            </div>
            <span className="truncate">{job.location.replace('-', ' ')}</span>
          </div>
          
          {job.salary && (
            <div className="flex items-center text-sm text-slate-600">
              <div className="p-1.5 bg-green-100 rounded-lg mr-3">
                <DollarSign className="w-3.5 h-3.5 text-green-600" />
              </div>
              <span className="truncate">{job.salary}</span>
            </div>
          )}
          
          <div className="flex items-center text-sm">
            <div className="p-1.5 bg-orange-100 rounded-lg mr-3">
              <Calendar className="w-3.5 h-3.5 text-orange-600" />
            </div>
            <span className={`truncate ${getUrgencyColor(job.expiresAt)} px-2 py-1 rounded-md text-xs`}>
              Exp: {formatDate(job.expiresAt)}
            </span>
          </div>
          
          <div className="flex items-center text-sm text-slate-600">
            <div className="p-1.5 bg-blue-100 rounded-lg mr-3">
              <Eye className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <span>{job.views} views</span>
          </div>
        </div>

        {/* Requirements */}
        {job.requirements && job.requirements.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {job.requirements.slice(0, 3).map((req, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 bg-slate-50 text-slate-700 text-xs rounded-lg font-medium border border-slate-200"
                >
                  <CheckCircle className="w-3 h-3 mr-1.5 text-green-500" />
                  {req}
                </span>
              ))}
              {job.requirements.length > 3 && (
                <span className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-lg font-medium border border-blue-200">
                  +{job.requirements.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div className="flex items-center space-x-4 text-xs text-slate-500">
            <span>{formatDate(job.createdAt)}</span>
            <div className="flex items-center space-x-1">
              <Users className="w-3 h-3" />
              <span>50+ applicants</span>
            </div>
          </div>
          
          <Link
            href={`/jobs/${job.slug}`}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 inline-flex items-center space-x-2 shadow-sm hover:shadow-md"
          >
            <span>View Details</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
