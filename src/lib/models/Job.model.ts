import mongoose, { Document, Schema } from 'mongoose'

export interface IJob extends Document {
  title: string
  slug: string
  company: string
  description: string
  category: string
  jobType: 'full-time' | 'part-time' | 'contract' | 'internship'
  location: string
  salary?: string
  requirements: string[]
  contactEmail?: string
  contactPhone?: string
  postedBy: mongoose.Types.ObjectId
  status: 'pending' | 'approved' | 'rejected'
  views: number
  applicationCount: number
  expiresAt?: Date
  allowApplication: boolean
  allowDirectMail: boolean
  createdAt: Date
  updatedAt: Date
}

const JobSchema = new Schema<IJob>({
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true,
    minlength: [5, 'Title must be at least 5 characters'],
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  slug: {
    type: String,
    required: false,
    lowercase: true
  },
  company: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
    maxlength: [50, 'Company name cannot exceed 50 characters']
  },
  description: {
    type: String,
    required: [true, 'Job description is required'],
    minlength: [50, 'Description must be at least 50 characters'],
    maxlength: [20000, 'Description cannot exceed 20000 characters']
  },
  category: {
    type: String,
    required: [true, 'Job category is required'],
    enum: ['government', 'private', 'part-time', 'internship', 'work-from-home', 'freelance', 'education', 'healthcare', 'banking', 'it', 'marketing', 'other']
  },
  jobType: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'internship'],
    required: [true, 'Job type is required']
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
    minlength: [2, 'Location must be at least 2 characters'],
    maxlength: [100, 'Location cannot exceed 100 characters']
  },
  salary: {
    type: String,
    maxlength: [50, 'Salary cannot exceed 50 characters']
  },
  requirements: [{
    type: String,
    maxlength: [200, 'Each requirement cannot exceed 200 characters']
  }],
  contactEmail: {
    type: String,
    required: false,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
    default: null
  },
  contactPhone: {
    type: String,
    required: false,
    match: [/^[6-9]\d{9}$/, 'Please enter a valid 10-digit phone number'],
    default: null
  },
  postedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  views: {
    type: Number,
    default: 0,
    min: [0, 'Views cannot be negative']
  },
  applicationCount: {
    type: Number,
    default: 0,
    min: [0, 'Application count cannot be negative']
  },
  expiresAt: {
    type: Date,
    required: false,
    validate: {
      validator: function (value: Date | null | undefined) {
        if (!value) return true // Optional field
        return value > new Date()
      },
      message: 'Expiry date must be in the future'
    }
  },
  allowApplication: {
    type: Boolean,
    default: false
  },
  allowDirectMail: {
    type: Boolean,
    default: false
  },
}, {
  timestamps: true
})

// Create slug from title before saving
JobSchema.pre('save', async function (next) {
  if (this.isModified('title') || !this.slug) {
    let baseSlug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    // Ensure slug is not empty
    if (!baseSlug) {
      baseSlug = 'job-' + Date.now()
    }

    // Use timestamp + random suffix to ensure uniqueness without database queries
    const uniqueSuffix = Date.now().toString(36) + Math.random().toString(36).substr(2, 5)
    this.slug = `${baseSlug}-${uniqueSuffix}`
  }
  next()
})

// Indexes for better query performance
JobSchema.index({ slug: 1 }, { unique: true })
JobSchema.index({ status: 1 })
JobSchema.index({ category: 1 })
JobSchema.index({ jobType: 1 })
JobSchema.index({ location: 1 })
JobSchema.index({ postedBy: 1 })
JobSchema.index({ expiresAt: 1 })
JobSchema.index({ createdAt: -1 })

// Text search index
JobSchema.index({
  title: 'text',
  description: 'text',
  company: 'text'
})

export default mongoose.models.Job || mongoose.model<IJob>('Job', JobSchema)
