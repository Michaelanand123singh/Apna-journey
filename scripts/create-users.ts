import { config } from 'dotenv'
import path from 'path'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

// Load environment variables from .env.local
config({ path: path.resolve(process.cwd(), '.env.local') })

// Set the MongoDB URI directly
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://nextinvisiontest_db_user:kxtQ6PttofmYe1ma@cluster0.mibjeq0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'

// Define schemas directly
const UserSchema = new mongoose.Schema({
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

const AdminSchema = new mongoose.Schema({
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
    unique: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: { 
    type: String, 
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters']
  },
  role: { 
    type: String, 
    enum: ['admin', 'super-admin'], 
    default: 'admin' 
  },
  status: { 
    type: String, 
    enum: ['active', 'inactive'], 
    default: 'active' 
  },
}, {
  timestamps: true
})

// Create models
const User = mongoose.models.User || mongoose.model('User', UserSchema)
const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema)

async function createUsers() {
  try {
    console.log('🔐 Creating specific user credentials...')
    
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    // Check if users already exist
    const existingAdmin = await Admin.findOne({ email: 'admin@apnajourney.com' })
    const existingUser = await User.findOne({ email: 'theaanndsingh76@gmail.com' })

    // Create/Update Admin User
    if (existingAdmin) {
      console.log('🔄 Updating existing admin user...')
      const hashedAdminPassword = await bcrypt.hash('admin123', 12)
      await Admin.findByIdAndUpdate(existingAdmin._id, {
        password: hashedAdminPassword,
        name: 'Admin User'
      })
      console.log('✅ Admin user updated')
    } else {
      console.log('👤 Creating admin user...')
      const hashedAdminPassword = await bcrypt.hash('admin123', 12)
      await Admin.create({
        name: 'Admin User',
        email: 'admin@apnajourney.com',
        password: hashedAdminPassword,
        role: 'super-admin'
      })
      console.log('✅ Admin user created')
    }

    // Create/Update Regular User
    if (existingUser) {
      console.log('🔄 Updating existing regular user...')
      const hashedUserPassword = await bcrypt.hash('Anand@#123', 12)
      await User.findByIdAndUpdate(existingUser._id, {
        password: hashedUserPassword,
        name: 'Anand Singh',
        phone: '9876543210',
        role: 'user',
        status: 'active'
      })
      console.log('✅ Regular user updated')
    } else {
      console.log('👤 Creating regular user...')
      const hashedUserPassword = await bcrypt.hash('Anand@#123', 12)
      await User.create({
        name: 'Anand Singh',
        email: 'theaanndsingh76@gmail.com',
        password: hashedUserPassword,
        phone: '9876543210',
        role: 'user',
        status: 'active'
      })
      console.log('✅ Regular user created')
    }

    console.log('\n🎉 User credentials created successfully!')
    console.log('\n🔑 Login credentials:')
    console.log('Admin: admin@apnajourney.com / admin123')
    console.log('User: theaanndsingh76@gmail.com / Anand@#123')

  } catch (error) {
    console.error('❌ Error creating users:', error)
    process.exit(1)
  } finally {
    await mongoose.disconnect()
    console.log('🔌 Disconnected from MongoDB')
  }
}

// Run the function
createUsers()
  .then(() => {
    console.log('✅ User creation process completed')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ User creation process failed:', error)
    process.exit(1)
  })
