export interface Job {
  _id: string
  title: string
  slug: string
  company: string
  description: string
  category: string
  jobType: 'full-time' | 'part-time' | 'contract' | 'internship'
  location: string
  salary?: string
  requirements: string[]
  contactEmail: string
  contactPhone: string
  postedBy: string
  status: 'pending' | 'approved' | 'rejected'
  views: number
  applicationCount: number
  expiresAt: Date
  createdAt: Date
  updatedAt: Date
}

export interface CreateJobData {
  title: string
  company: string
  description: string
  category: string
  jobType: 'full-time' | 'part-time' | 'contract' | 'internship'
  location: string
  salary?: string
  requirements: string[]
  contactEmail: string
  contactPhone: string
  expiresAt: Date
}

export interface JobFilters {
  category?: string
  jobType?: string
  location?: string
  search?: string
  page?: number
  limit?: number
}

export interface JobApplication {
  _id: string
  jobId: string
  userId: string
  applicantName: string
  email: string
  phone: string
  resumeUrl: string
  coverLetter: string
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected'
  appliedAt: Date
}

export interface CreateApplicationData {
  jobId: string
  applicantName: string
  email: string
  phone: string
  resumeUrl: string
  coverLetter: string
}
