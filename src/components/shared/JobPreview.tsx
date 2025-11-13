'use client'

import { useMemo } from 'react'
import { 
  MapPin, 
  Clock, 
  Building, 
  Calendar, 
  Mail, 
  Phone, 
  Users,
  CheckCircle,
  DollarSign,
  Eye,
  Briefcase
} from 'lucide-react'

interface JobPreviewData {
  title: string
  company: string
  description: string
  category: string
  jobType: 'full-time' | 'part-time' | 'contract' | 'internship'
  location: string
  salary?: string
  requirements: string[]
  contactEmail?: string
  contactPhone?: string
  expiresAt: string
  allowApplication: boolean
  allowDirectMail: boolean
}

interface JobPreviewProps {
  jobData: JobPreviewData
}

// Color constants for better maintainability
const JOB_TYPE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'full-time': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  'part-time': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  'contract': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  'internship': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' }
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'government': { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  'private': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  'part-time': { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  'internship': { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' },
  'work-from-home': { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
  'freelance': { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
  'education': { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200' },
  'healthcare': { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' },
  'banking': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  'it': { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200' },
  'marketing': { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
  'other': { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' }
}

export default function JobPreview({ jobData }: JobPreviewProps) {
  const formatDate = useMemo(() => (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }, [])

  const formattedDates = useMemo(() => {
    const postedDate = new Date().toISOString() // Current date for preview
    const expiresDate = jobData.expiresAt ? new Date(jobData.expiresAt) : new Date()
    return {
      posted: formatDate(postedDate),
      expires: formatDate(expiresDate)
    }
  }, [jobData.expiresAt, formatDate])

  const jobTypeStyle = useMemo(() => {
    return JOB_TYPE_COLORS[jobData.jobType] || JOB_TYPE_COLORS['full-time']
  }, [jobData.jobType])

  const categoryStyle = useMemo(() => {
    return CATEGORY_COLORS[jobData.category] || CATEGORY_COLORS['other']
  }, [jobData.category])

  const isExpired = useMemo(() => {
    if (!jobData.expiresAt) return false
    return new Date(jobData.expiresAt) < new Date()
  }, [jobData.expiresAt])

  const getUrgencyBadge = () => {
    if (!jobData.expiresAt) return null
    const daysLeft = Math.ceil((new Date(jobData.expiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    if (daysLeft <= 3) return { text: 'Urgent', color: 'bg-red-100 text-red-700 border-red-200' }
    if (daysLeft <= 7) return { text: 'Closing Soon', color: 'bg-orange-100 text-orange-700 border-orange-200' }
    return null
  }

  const urgencyBadge = getUrgencyBadge()

  // Filter out empty requirements
  const validRequirements = jobData.requirements.filter(req => req.trim())

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-6">
        {/* Hero Header Card */}
        <div className="bg-gradient-to-br from-white via-white to-slate-50 rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="p-6 sm:p-8 lg:p-10">
            {/* Title and Company Section */}
            <div className="mb-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-3 leading-tight">
                    {jobData.title || 'Job Title'}
                  </h1>
                  <div className="flex items-center text-slate-700 mb-3">
                    <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg mr-3 shadow-sm">
                      <Building className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <span className="text-lg sm:text-xl font-semibold">{jobData.company || 'Company Name'}</span>
                  </div>
                  <div className="flex items-center text-slate-500 text-sm">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>Posted on {formattedDates.posted}</span>
                  </div>
                </div>
              </div>

              {/* Badges Row */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                {jobData.jobType && (
                  <span className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold border ${jobTypeStyle.bg} ${jobTypeStyle.text} ${jobTypeStyle.border}`}>
                    <Briefcase className="w-4 h-4 mr-2" />
                    {jobData.jobType.replace('-', ' ').charAt(0).toUpperCase() + jobData.jobType.replace('-', ' ').slice(1)}
                  </span>
                )}
                {jobData.category && (
                  <span className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold border ${categoryStyle.bg} ${categoryStyle.text} ${categoryStyle.border}`}>
                    {jobData.category.replace('-', ' ').charAt(0).toUpperCase() + jobData.category.replace('-', ' ').slice(1)}
                  </span>
                )}
                {urgencyBadge && (
                  <span className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold border ${urgencyBadge.color}`}>
                    <Clock className="w-4 h-4 mr-2" />
                    {urgencyBadge.text}
                  </span>
                )}
              </div>

              {/* Key Information Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center mb-2">
                    <div className="p-2 bg-blue-100 rounded-lg mr-3">
                      <MapPin className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Location</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-900 ml-11">
                    {jobData.location || 'Not specified'}
                  </p>
                </div>

                {jobData.salary && (
                  <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-2">
                      <div className="p-2 bg-emerald-100 rounded-lg mr-3">
                        <DollarSign className="w-4 h-4 text-emerald-600" />
                      </div>
                      <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Salary</span>
                    </div>
                    <p className="text-sm font-semibold text-slate-900 ml-11">{jobData.salary}</p>
                  </div>
                )}

                <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center mb-2">
                    <div className="p-2 bg-orange-100 rounded-lg mr-3">
                      <Calendar className="w-4 h-4 text-orange-600" />
                    </div>
                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Expires</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-900 ml-11">
                    {jobData.expiresAt ? formattedDates.expires : 'Not set'}
                  </p>
                </div>

                <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center mb-2">
                    <div className="p-2 bg-purple-100 rounded-lg mr-3">
                      <Users className="w-4 h-4 text-purple-600" />
                    </div>
                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Applications</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-900 ml-11">0</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Job Description Card */}
        {jobData.description && (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="p-6 sm:p-8 lg:p-10">
              <div className="flex items-center mb-6 pb-4 border-b border-slate-200">
                <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg mr-3">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Job Description</h2>
              </div>
              <div 
                className="prose prose-slate prose-sm sm:prose-base max-w-none text-slate-700 leading-relaxed prose-headings:text-slate-900 prose-headings:font-bold prose-a:text-green-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-slate-900 prose-ul:text-slate-700 prose-ol:text-slate-700"
                dangerouslySetInnerHTML={{ __html: jobData.description }}
              />
            </div>
          </div>
        )}

        {/* Requirements Card */}
        {validRequirements.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="p-6 sm:p-8 lg:p-10">
              <div className="flex items-center mb-6 pb-4 border-b border-slate-200">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg mr-3">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Requirements</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {validRequirements.map((req, index) => (
                  <div 
                    key={index} 
                    className="flex items-start p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-green-300 hover:bg-green-50/50 transition-all group"
                  >
                    <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                    <span className="text-slate-700 text-sm sm:text-base leading-relaxed">{req}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Contact Information Card - Only show if contact info exists */}
        {(jobData.contactEmail || jobData.contactPhone) && (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="p-6 sm:p-8 lg:p-10">
              <div className="flex items-center mb-6 pb-4 border-b border-slate-200">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg mr-3">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Contact Information</h2>
              </div>
              <div className={`grid gap-4 ${jobData.contactEmail && jobData.contactPhone ? 'sm:grid-cols-2' : 'sm:grid-cols-1'}`}>
                {jobData.contactEmail && (
                  <div className="flex items-center p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="p-2 bg-blue-100 rounded-lg mr-4">
                      <Mail className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Email</p>
                      <p className="text-sm font-semibold text-slate-900 break-all">
                        {jobData.contactEmail}
                      </p>
                    </div>
                  </div>
                )}
                {jobData.contactPhone && (
                  <div className="flex items-center p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="p-2 bg-green-100 rounded-lg mr-4">
                      <Phone className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Phone</p>
                      <p className="text-sm font-semibold text-slate-900">
                        {jobData.contactPhone}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sidebar */}
      <div className="lg:col-span-1">
        <div className="lg:sticky lg:top-6 space-y-6">
          {/* Application Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="p-6">
              {/* Only show application section if at least one option is enabled */}
              {(jobData.allowApplication || jobData.allowDirectMail) ? (
                <>
                  <div className="flex items-center mb-6 pb-4 border-b border-slate-200">
                    <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg mr-3">
                      <Briefcase className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">Apply for this job</h3>
                  </div>
                  
                  {isExpired ? (
                    <div className="text-center py-6">
                      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Clock className="w-8 h-8 text-red-600" />
                      </div>
                      <p className="text-red-600 font-semibold text-base mb-2">Application deadline has passed</p>
                      <p className="text-slate-500 text-sm">
                        This job posting expired on {formattedDates.expires}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Show "Apply Now" button only if allowApplication is enabled */}
                      {jobData.allowApplication && (
                        <div>
                          <div className="flex items-center justify-center mb-4 p-3 bg-slate-50 rounded-xl">
                            <Users className="w-4 h-4 text-slate-600 mr-2" />
                            <span className="text-sm text-slate-600">
                              <span className="font-semibold text-slate-900">0</span> applicants
                            </span>
                          </div>
                          <button
                            disabled
                            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-4 rounded-xl font-semibold opacity-75 cursor-not-allowed text-base"
                          >
                            Apply Now
                          </button>
                          <p className="text-xs text-slate-500 text-center mt-2">Preview mode - Application form will appear here</p>
                        </div>
                      )}
                      
                      {/* Show "Send Email" option only if allowDirectMail is enabled and contactEmail exists */}
                      {jobData.allowDirectMail && jobData.contactEmail && (
                        <div className="text-center">
                          {jobData.allowApplication && (
                            <div className="flex items-center my-4">
                              <div className="flex-1 border-t border-slate-200"></div>
                              <span className="px-4 text-xs font-medium text-slate-500 uppercase">Or</span>
                              <div className="flex-1 border-t border-slate-200"></div>
                            </div>
                          )}
                          <div className="inline-flex items-center justify-center w-full px-6 py-3 bg-white border-2 border-green-600 text-green-600 rounded-xl font-semibold opacity-75 cursor-not-allowed text-base">
                            <Mail className="w-5 h-5 mr-2" />
                            Send Email
                          </div>
                          <p className="text-xs text-slate-500 text-center mt-2">Preview mode - Email link will be active when published</p>
                        </div>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-slate-700 font-semibold text-base mb-2">Application Options Not Available</p>
                  <p className="text-slate-500 text-sm">
                    Please contact the employer directly using the contact information provided.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Job Statistics Card */}
          <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center mb-6 pb-4 border-b border-slate-200">
                <div className="p-2 bg-gradient-to-br from-slate-600 to-slate-700 rounded-lg mr-3">
                  <Eye className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-lg font-bold text-slate-900">Job Statistics</h4>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200">
                  <div className="flex items-center">
                    <Eye className="w-4 h-4 text-slate-500 mr-3" />
                    <span className="text-sm font-medium text-slate-600">Views</span>
                  </div>
                  <span className="text-sm font-bold text-slate-900">0</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 text-slate-500 mr-3" />
                    <span className="text-sm font-medium text-slate-600">Applications</span>
                  </div>
                  <span className="text-sm font-bold text-slate-900">0</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 text-slate-500 mr-3" />
                    <span className="text-sm font-medium text-slate-600">Posted</span>
                  </div>
                  <span className="text-sm font-bold text-slate-900">{formattedDates.posted.split(',')[0]}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

