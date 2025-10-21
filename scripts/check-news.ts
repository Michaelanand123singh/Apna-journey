import dbConnect from '../src/lib/db/mongodb'
import News from '../src/lib/models/News.model'
import Admin from '../src/lib/models/Admin.model'

async function checkNews() {
  try {
    console.log('🔍 Checking news in database...')
    
    await dbConnect()
    console.log('✅ Connected to MongoDB')

    // Check all news
    const allNews = await News.find({}).lean()
    console.log('📰 Total news articles:', allNews.length)
    
    if (allNews.length > 0) {
      console.log('📄 Sample news article:')
      console.log(JSON.stringify(allNews[0], null, 2))
    }

    // Check published news
    const publishedNews = await News.find({ status: 'published' }).lean()
    console.log('📰 Published news articles:', publishedNews.length)

    // Check admin users
    const admins = await Admin.find({}).lean()
    console.log('👤 Admin users:', admins.length)
    
    if (admins.length > 0) {
      console.log('👤 Sample admin:')
      console.log(JSON.stringify(admins[0], null, 2))
    }
    
  } catch (error) {
    console.error('❌ Error checking news:', error)
  } finally {
    process.exit(0)
  }
}

checkNews()
