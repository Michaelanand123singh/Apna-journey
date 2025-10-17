import mongoose, { Document, Schema } from 'mongoose'

export interface IAdmin extends Document {
  name: string
  email: string
  password: string
  role: 'super-admin' | 'editor'
  permissions: string[]
  lastLogin: Date
  createdAt: Date
  updatedAt: Date
}

const AdminSchema = new Schema<IAdmin>({
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
  password: { 
    type: String, 
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters']
  },
  role: { 
    type: String, 
    enum: ['super-admin', 'editor'], 
    required: [true, 'Role is required'],
    default: 'editor'
  },
  permissions: [{ 
    type: String,
    enum: [
      'manage-users',
      'manage-jobs',
      'manage-news',
      'manage-applications',
      'view-analytics',
      'manage-settings',
      'manage-admins'
    ]
  }],
  lastLogin: { 
    type: Date,
    default: null
  },
}, {
  timestamps: true
})

// Index for better query performance
AdminSchema.index({ email: 1 }, { unique: true })
AdminSchema.index({ role: 1 })

// Set permissions based on role
AdminSchema.pre('save', function(next) {
  if (this.isModified('role')) {
    if (this.role === 'super-admin') {
      this.permissions = [
        'manage-users',
        'manage-jobs',
        'manage-news',
        'manage-applications',
        'view-analytics',
        'manage-settings',
        'manage-admins'
      ]
    } else if (this.role === 'editor') {
      this.permissions = [
        'manage-jobs',
        'manage-news',
        'manage-applications',
        'view-analytics'
      ]
    }
  }
  next()
})

export default mongoose.models.Admin || mongoose.model<IAdmin>('Admin', AdminSchema)
