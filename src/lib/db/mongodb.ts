const MONGODB_URI = process.env.MONGODB_URI!

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local')
}

type MongooseConn = any
let cached = (global as any).mongoose as { conn: MongooseConn | null; promise: Promise<MongooseConn> | null } | undefined

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function dbConnect() {
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
