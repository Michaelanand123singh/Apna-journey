import mongoose, { Document, Schema } from 'mongoose'

export interface IRssFeed extends Document {
  name: string
  url: string
  category: string
  language: 'en' | 'hi'
  isActive: boolean
  lastFetchedAt: Date | null
  lastError: string | null
  fetchCount: number
  successCount: number
  errorCount: number
  createdAt: Date
  updatedAt: Date
  createdBy: mongoose.Types.ObjectId
}

const RssFeedSchema = new Schema<IRssFeed>({
  name: { 
    type: String, 
    required: [true, 'Feed name is required'], 
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  url: { 
    type: String, 
    required: [true, 'RSS feed URL is required'],
    trim: true,
    validate: {
      validator: function(v: string) {
        try {
          const url = new URL(v)
          return url.protocol === 'http:' || url.protocol === 'https:'
        } catch {
          return false
        }
      },
      message: 'Please enter a valid RSS feed URL'
    }
  },
  category: { 
    type: String, 
    required: [true, 'Category is required'],
    enum: ['politics', 'education', 'crime', 'sports', 'business', 'local-events', 'development', 'health', 'entertainment', 'technology', 'environment', 'other'],
    default: 'other'
  },
  language: { 
    type: String, 
    enum: ['en', 'hi'], 
    required: [true, 'Language is required'],
    default: 'en'
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  lastFetchedAt: { 
    type: Date,
    default: null
  },
  lastError: { 
    type: String,
    default: null
  },
  fetchCount: { 
    type: Number,
    default: 0,
    min: [0, 'Fetch count cannot be negative']
  },
  successCount: { 
    type: Number,
    default: 0,
    min: [0, 'Success count cannot be negative']
  },
  errorCount: { 
    type: Number,
    default: 0,
    min: [0, 'Error count cannot be negative']
  },
  createdBy: { 
    type: Schema.Types.ObjectId, 
    ref: 'Admin', 
    required: true 
  },
}, {
  timestamps: true
})

// Indexes for better query performance
RssFeedSchema.index({ url: 1 }, { unique: true })
RssFeedSchema.index({ isActive: 1 })
RssFeedSchema.index({ category: 1 })
RssFeedSchema.index({ language: 1 })
RssFeedSchema.index({ createdBy: 1 })
RssFeedSchema.index({ lastFetchedAt: -1 })

export default mongoose.models.RssFeed || mongoose.model<IRssFeed>('RssFeed', RssFeedSchema)

