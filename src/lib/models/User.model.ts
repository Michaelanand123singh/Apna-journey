import mongoose, { Document, Schema } from 'mongoose'

export interface IUser extends Document {
  name: string
  email: string
  password: string
  phone?: string
  role: 'user' | 'admin'
  status: 'active' | 'banned'
  resumeUrl?: string
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>({
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
  phone: { 
    type: String, 
    trim: true,
    match: [/^[6-9]\d{9}$/, 'Please enter a valid 10-digit phone number']
  },
  role: { 
    type: String, 
    enum: ['user', 'admin'], 
    default: 'user' 
  },
  status: { 
    type: String, 
    enum: ['active', 'banned'], 
    default: 'active' 
  },
  resumeUrl: { 
    type: String,
    match: [/^https?:\/\/.+/, 'Please enter a valid URL']
  },
}, {
  timestamps: true
})

// Index for better query performance
UserSchema.index({ email: 1 }, { unique: true })
UserSchema.index({ role: 1 })
UserSchema.index({ status: 1 })

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema)
