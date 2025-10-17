export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export interface SearchParams {
  page?: string
  limit?: string
  search?: string
  category?: string
  location?: string
  jobType?: string
  language?: string
  featured?: string
}

export interface DashboardStats {
  totalJobs: number
  activeJobs: number
  pendingJobs: number
  totalNews: number
  publishedNews: number
  draftNews: number
  totalUsers: number
  totalApplications: number
  pageViews: {
    today: number
    thisWeek: number
    thisMonth: number
  }
}
