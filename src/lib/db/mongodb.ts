const MONGODB_URI = process.env.MONGODB_URI

// Only throw error if we're not in build mode and MONGODB_URI is missing
if (!MONGODB_URI && process.env.NODE_ENV !== 'production' && !process.env.NEXT_PHASE) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local')
}

type MongooseConn = any
let cached = (global as any).mongoose as { conn: MongooseConn | null; promise: Promise<MongooseConn> | null } | undefined

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function dbConnect() {
  // Skip connection during build time or if MONGODB_URI is not available
  if (!MONGODB_URI || process.env.NEXT_PHASE === 'phase-production-build') {
    console.warn('⚠️ MONGODB_URI not available or in build phase, skipping database connection')
    return null
  }

  if (!cached) {
    cached = { conn: null, promise: null }
    ;(global as any).mongoose = cached as any
  }
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }

    cached.promise = (async () => {
      const mongoose = (await import('mongoose')).default
      return mongoose.connect(MONGODB_URI, opts)
    })()
    .then((mongoose) => {
      console.log('✅ Connected to MongoDB')
      return mongoose
    })
    .catch((error) => {
      console.error('❌ MongoDB connection error:', error)
      throw error
    })
  }
  
  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}

export default dbConnect

// Global type declaration for mongoose cache
declare global {
  var mongoose: {
    conn: typeof mongoose | null
    promise: Promise<typeof mongoose> | null
  } | undefined
}
