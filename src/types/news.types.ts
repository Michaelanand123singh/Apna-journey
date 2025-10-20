export interface News {
  _id: string
  title: string
  slug: string
  excerpt: string
  content: string
  featuredImage: string
  category: string
  tags: string[]
  language: 'english' | 'hindi'
  author: {
    _id: string
    name: string
    email: string
  }
  status: 'draft' | 'published'
  isFeatured: boolean
  views: number
  publishedAt: Date
  seoTitle: string
  seoDescription: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateNewsData {
  title: string
  excerpt: string
  content: string
  featuredImage: string
  category: string
  tags: string[]
  language: 'english' | 'hindi'
  isFeatured: boolean
  seoTitle: string
  seoDescription: string
}

export interface NewsFilters {
  category?: string
  language?: string
  search?: string
  page?: number
  limit?: number
  featured?: boolean
}

export interface NewsCategory {
  name: string
  slug: string
  description: string
  count: number
}
