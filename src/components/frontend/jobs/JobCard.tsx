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
  Briefcase
} from 'lucide-react'
import { useState } from 'react'

interface JobCardProps {
  job: Job
}

export default function JobCard({ job }: JobCardProps) {
  const [isSaved, setIsSaved] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getJobTypeColor = (jobType: string) => {
    const colors = {
      'full-time': 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
      'part-time': 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
      'contract': 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300',
      'internship': 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300'
    }
    return colors[jobType as keyof typeof colors] || 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300'
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      'government': 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
      'private': 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
      'part-time': 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
      'internship': 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300',
      'work-from-home': 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300',
      'freelance': 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
      'education': 'bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-300',
      'healthcare': 'bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-300',
      'banking': 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300',
      'it': 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-800 dark:text-cyan-300',
      'marketing': 'bg-rose-100 dark:bg-rose-900/30 text-rose-800 dark:text-rose-300',
      'other': 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300'
    }
    return colors[category as keyof typeof colors] || 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300'
  }

  const getUrgencyColor = (expiresAt: string | Date) => {
    const daysLeft = Math.ceil((new Date(expiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    if (daysLeft <= 3) return 'text-red-600 dark:text-red-400'
    if (daysLeft <= 7) return 'text-orange-600 dark:text-orange-400'
    return 'text-gray-600 dark:text-gray-400'
  }

  return (
    <div 
      className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-soft hover:shadow-medium transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:-translate-y-1 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-secondary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Save Button */}
      <button
        onClick={() => setIsSaved(!isSaved)}
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200"
      >
        {isSaved ? (
          <BookmarkCheck className="w-5 h-5 text-primary-600" />
        ) : (
          <Bookmark className="w-5 h-5 text-gray-400 hover:text-primary-600" />
        )}
      </button>

      <div className="p-6 relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1 pr-4">
            <Link 
              href={`/jobs/${job.slug}`}
              className="text-xl font-bold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors line-clamp-2 group-hover:underline"
            >
              {job.title}
            </Link>
            
            <div className="flex items-center mt-2 space-x-4">
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Building className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">{job.company}</span>
              </div>
              
              {job.views > 100 && (
                <div className="flex items-center text-gray-500 dark:text-gray-500">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span className="text-xs">Trending</span>
                </div>
              )}
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-col items-end space-y-2">
            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getJobTypeColor(job.jobType)}`}>
              {job.jobType.replace('-', ' ').toUpperCase()}
            </span>
            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getCategoryColor(job.category)}`}>
              {job.category.replace('-', ' ').toUpperCase()}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-6 line-clamp-3 leading-relaxed">
          {job.description}
        </p>

        {/* Meta Information */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <MapPin className="w-4 h-4 mr-2 text-primary-600" />
            <span className="font-medium">{job.location.replace('-', ' ').toUpperCase()}</span>
          </div>
          
          {job.salary && (
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <DollarSign className="w-4 h-4 mr-2 text-green-600" />
              <span className="font-medium">{job.salary}</span>
            </div>
          )}
          
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Calendar className="w-4 h-4 mr-2 text-orange-600" />
            <span className={`font-medium ${getUrgencyColor(job.expiresAt)}`}>
              Expires: {formatDate(job.expiresAt)}
            </span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Eye className="w-4 h-4 mr-2 text-blue-600" />
            <span className="font-medium">{job.views} views</span>
          </div>
        </div>

        {/* Requirements */}
        {job.requirements && job.requirements.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
              <Briefcase className="w-4 h-4 mr-2 text-primary-600" />
              Key Requirements
            </h4>
            <div className="flex flex-wrap gap-2">
              {job.requirements.slice(0, 4).map((req, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full font-medium"
                >
                  {req}
                </span>
              ))}
              {job.requirements.length > 4 && (
                <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs rounded-full font-medium">
                  +{job.requirements.length - 4} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
            <span>Posted {formatDate(job.createdAt)}</span>
            <div className="flex items-center space-x-1">
              <Users className="w-3 h-3" />
              <span>50+ applicants</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Link
              href={`/jobs/${job.slug}`}
              className="group/btn bg-primary-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-700 hover:shadow-glow transition-all duration-200 inline-flex items-center space-x-2"
            >
              <span>View Details</span>
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Hover Effect Border */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-primary-200 dark:group-hover:border-primary-800 transition-colors duration-300 pointer-events-none"></div>
    </div>
  )
}
