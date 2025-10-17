import mongoose, { Document, Schema } from 'mongoose'

export interface INews extends Document {
  title: string
  slug: string
  excerpt: string
  content: string
  featuredImage: string
  category: string
  tags: string[]
  language: 'english' | 'hindi'
  author: mongoose.Types.ObjectId
  status: 'draft' | 'published'
  isFeatured: boolean
  views: number
  publishedAt: Date
  seoTitle: string
  seoDescription: string
  createdAt: Date
  updatedAt: Date
}

const NewsSchema = new Schema<INews>({
  title: { 
    type: String, 
    required: [true, 'News title is required'], 
    trim: true,
    minlength: [10, 'Title must be at least 10 characters'],
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  slug: { 
    type: String, 
    required: true, 
    lowercase: true
  },
  excerpt: { 
    type: String, 
    required: [true, 'Excerpt is required'],
    minlength: [50, 'Excerpt must be at least 50 characters'],
    maxlength: [500, 'Excerpt cannot exceed 500 characters']
  },
  content: { 
    type: String, 
    required: [true, 'Content is required'],
    minlength: [100, 'Content must be at least 100 characters']
  },
  featuredImage: { 
    type: String, 
    required: [true, 'Featured image is required'],
    match: [/^https?:\/\/.+/, 'Please enter a valid image URL']
  },
  category: { 
    type: String, 
    required: [true, 'Category is required'],
    enum: ['politics', 'education', 'crime', 'sports', 'business', 'local-events', 'development', 'health', 'entertainment', 'technology', 'environment', 'other']
  },
  tags: [{ 
    type: String,
    trim: true,
    maxlength: [30, 'Each tag cannot exceed 30 characters']
  }],
  language: { 
    type: String, 
    enum: ['english', 'hindi'], 
    required: [true, 'Language is required'],
    default: 'english'
  },
  author: { 
    type: Schema.Types.ObjectId, 
    ref: 'Admin', 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['draft', 'published'], 
    default: 'draft' 
  },
  isFeatured: { 
    type: Boolean, 
    default: false 
  },
  views: { 
    type: Number, 
    default: 0,
    min: [0, 'Views cannot be negative']
  },
  publishedAt: { 
    type: Date,
    default: null
  },
  seoTitle: { 
    type: String,
    maxlength: [60, 'SEO title should not exceed 60 characters']
  },
  seoDescription: { 
    type: String,
    maxlength: [160, 'SEO description should not exceed 160 characters']
  },
}, {
  timestamps: true
})

// Create slug from title before saving
NewsSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }
  
  // Set publishedAt when status changes to published
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date()
  }
  
  next()
})

// Indexes for better query performance
NewsSchema.index({ slug: 1 }, { unique: true })
NewsSchema.index({ status: 1 })
NewsSchema.index({ category: 1 })
NewsSchema.index({ language: 1 })
NewsSchema.index({ author: 1 })
NewsSchema.index({ isFeatured: 1 })
NewsSchema.index({ publishedAt: -1 })
NewsSchema.index({ createdAt: -1 })

// Text search index
NewsSchema.index({ 
  title: 'text', 
  excerpt: 'text', 
  content: 'text',
  tags: 'text'
})

export default mongoose.models.News || mongoose.model<INews>('News', NewsSchema)
