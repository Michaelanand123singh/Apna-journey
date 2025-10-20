import mongoose, { Document, Schema } from 'mongoose'

export interface IInquiry extends Document {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  type: 'general' | 'job' | 'news' | 'technical' | 'partnership' | 'other'
  status: 'new' | 'in-progress' | 'resolved' | 'closed'
  priority: 'low' | 'medium' | 'high'
  adminNotes?: string
  resolvedAt?: Date
  createdAt: Date
  updatedAt: Date
}

const InquirySchema = new Schema<IInquiry>({
  name: { 
    type: String, 
    required: [true, 'Name is required'], 
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'], 
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: { 
    type: String, 
    trim: true,
    match: [/^[6-9]\d{9}$/, 'Please enter a valid 10-digit phone number']
  },
  subject: { 
    type: String, 
    required: [true, 'Subject is required'],
    trim: true,
    minlength: [5, 'Subject must be at least 5 characters'],
    maxlength: [100, 'Subject cannot exceed 100 characters']
  },
  message: { 
    type: String, 
    required: [true, 'Message is required'],
    trim: true,
    minlength: [10, 'Message must be at least 10 characters'],
    maxlength: [1000, 'Message cannot exceed 1000 characters']
  },
  type: { 
    type: String, 
    enum: ['general', 'job', 'news', 'technical', 'partnership', 'other'], 
    required: [true, 'Inquiry type is required'],
    default: 'general'
  },
  status: { 
    type: String, 
    enum: ['new', 'in-progress', 'resolved', 'closed'], 
    default: 'new' 
  },
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high'], 
    default: 'medium' 
  },
  adminNotes: { 
    type: String,
    maxlength: [500, 'Admin notes cannot exceed 500 characters']
  },
  resolvedAt: { 
    type: Date 
  },
}, {
  timestamps: true
})

// Indexes for better query performance
InquirySchema.index({ status: 1 })
InquirySchema.index({ type: 1 })
InquirySchema.index({ priority: 1 })
InquirySchema.index({ createdAt: -1 })
InquirySchema.index({ email: 1 })

// Auto-update resolvedAt when status changes to resolved
InquirySchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'resolved' && !this.resolvedAt) {
    this.resolvedAt = new Date()
  }
  next()
})

export default mongoose.models.Inquiry || mongoose.model<IInquiry>('Inquiry', InquirySchema)
