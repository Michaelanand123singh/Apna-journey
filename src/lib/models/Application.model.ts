import mongoose, { Document, Schema } from 'mongoose'

export interface IApplication extends Document {
  jobId: mongoose.Types.ObjectId
  userId: mongoose.Types.ObjectId
  applicantName: string
  email: string
  phone: string
  resumeUrl: string
  coverLetter: string
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected'
  appliedAt: Date
}

const ApplicationSchema = new Schema<IApplication>({
  jobId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Job', 
    required: [true, 'Job ID is required'] 
  },
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, 'User ID is required'] 
  },
  applicantName: { 
    type: String, 
    required: [true, 'Applicant name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'],
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: { 
    type: String, 
    required: [true, 'Phone number is required'],
    match: [/^[6-9]\d{9}$/, 'Please enter a valid 10-digit phone number']
  },
  resumeUrl: { 
    type: String, 
    required: [true, 'Resume is required'],
    match: [/^https?:\/\/.+/, 'Please enter a valid resume URL']
  },
  coverLetter: { 
    type: String,
    maxlength: [1000, 'Cover letter cannot exceed 1000 characters']
  },
  status: { 
    type: String, 
    enum: ['pending', 'reviewed', 'shortlisted', 'rejected'], 
    default: 'pending' 
  },
  appliedAt: { 
    type: Date, 
    default: Date.now 
  },
}, {
  timestamps: true
})

// Prevent duplicate applications from same user for same job
ApplicationSchema.index({ jobId: 1, userId: 1 }, { unique: true })

// Indexes for better query performance
ApplicationSchema.index({ jobId: 1 })
ApplicationSchema.index({ userId: 1 })
ApplicationSchema.index({ status: 1 })
ApplicationSchema.index({ appliedAt: -1 })

export default mongoose.models.Application || mongoose.model<IApplication>('Application', ApplicationSchema)
