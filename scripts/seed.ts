import dbConnect from '../src/lib/db/mongodb'
import User from '../src/lib/models/User.model'
import Admin from '../src/lib/models/Admin.model'
import Job from '../src/lib/models/Job.model'
import News from '../src/lib/models/News.model'
import Application from '../src/lib/models/Application.model'
import bcrypt from 'bcryptjs'

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...')
    
    await dbConnect()
    console.log('✅ Connected to MongoDB')

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Admin.deleteMany({}),
      Job.deleteMany({}),
      News.deleteMany({}),
      Application.deleteMany({})
    ])
    console.log('🧹 Cleared existing data')

    // Create admin user
    const hashedAdminPassword = await bcrypt.hash('admin123', 12)
    const admin = await Admin.create({
      name: 'Admin User',
      email: 'admin@apnajourney.com',
      password: hashedAdminPassword,
      role: 'super-admin'
    })
    console.log('👤 Created admin user')

    // Create sample users
    const hashedPassword = await bcrypt.hash('password123', 12)
    const users = await User.create([
      {
        name: 'Rajesh Kumar',
        email: 'rajesh@example.com',
        password: hashedPassword,
        phone: '9876543210',
        role: 'user',
        status: 'active'
      },
      {
        name: 'Priya Sharma',
        email: 'priya@example.com',
        password: hashedPassword,
        phone: '9876543211',
        role: 'user',
        status: 'active'
      },
      {
        name: 'Amit Singh',
        email: 'amit@example.com',
        password: hashedPassword,
        phone: '9876543212',
        role: 'user',
        status: 'active'
      }
    ])
    console.log('👥 Created sample users')

    // Create sample jobs
    const jobs = await Job.create([
      {
        title: 'Software Developer - React/Node.js',
        company: 'Tech Solutions Pvt Ltd',
        location: 'Gaya, Bihar',
        jobType: 'full-time',
        salary: '₹4,00,000 - ₹6,00,000 per year',
        description: 'We are looking for an experienced software developer with expertise in React and Node.js to join our growing team in Gaya.',
        requirements: [
          'Bachelor\'s degree in Computer Science or related field',
          '2+ years of experience with React and Node.js',
          'Experience with MongoDB and Express.js',
          'Good communication skills in Hindi and English'
        ],
        responsibilities: [
          'Develop and maintain web applications using React and Node.js',
          'Collaborate with cross-functional teams',
          'Write clean, maintainable code',
          'Participate in code reviews'
        ],
        postedBy: users[0]._id,
        status: 'active',
        applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
      },
      {
        title: 'Marketing Executive',
        company: 'Local Business Hub',
        location: 'Gaya, Bihar',
        jobType: 'full-time',
        salary: '₹2,50,000 - ₹3,50,000 per year',
        description: 'Join our marketing team to promote local businesses and help them grow in the Gaya market.',
        requirements: [
          'Bachelor\'s degree in Marketing or related field',
          '1+ years of marketing experience',
          'Good knowledge of digital marketing',
          'Fluent in Hindi and English'
        ],
        responsibilities: [
          'Develop marketing strategies for local businesses',
          'Manage social media accounts',
          'Organize promotional events',
          'Build relationships with clients'
        ],
        postedBy: users[1]._id,
        status: 'active',
        applicationDeadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000) // 25 days from now
      },
      {
        title: 'English Teacher',
        company: 'Gaya Public School',
        location: 'Gaya, Bihar',
        jobType: 'part-time',
        salary: '₹15,000 - ₹20,000 per month',
        description: 'We need an experienced English teacher to teach students from classes 6-10.',
        requirements: [
          'Bachelor\'s degree in English or Education',
          'B.Ed. degree preferred',
          '2+ years of teaching experience',
          'Good communication skills'
        ],
        responsibilities: [
          'Teach English to students of classes 6-10',
          'Prepare lesson plans and assessments',
          'Maintain student records',
          'Participate in school activities'
        ],
        postedBy: users[2]._id,
        status: 'pending',
        applicationDeadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000) // 20 days from now
      }
    ])
    console.log('💼 Created sample jobs')

    // Create sample news articles
    const newsArticles = await News.create([
      {
        title: 'New IT Park Inaugurated in Gaya',
        excerpt: 'A new IT park has been inaugurated in Gaya, promising to bring hundreds of job opportunities for local youth.',
        content: 'The new IT park in Gaya was inaugurated today by the Chief Minister of Bihar. This state-of-the-art facility is expected to create over 500 direct jobs and 1000+ indirect employment opportunities. The park will house various IT companies and startups, focusing on software development, digital marketing, and IT services. Local officials are optimistic that this will boost the economy of Gaya and surrounding areas.',
        featuredImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=400&fit=crop',
        category: 'development',
        tags: ['IT', 'Jobs', 'Development', 'Gaya'],
        language: 'english',
        author: admin._id,
        status: 'published',
        isFeatured: true,
        publishedAt: new Date(),
        views: 150,
        seoTitle: 'New IT Park Inaugurated in Gaya - Job Opportunities',
        seoDescription: 'New IT park in Gaya inaugurated, creating 500+ job opportunities for local youth in software development and IT services.'
      },
      {
        title: 'गया में नई सड़क परियोजना शुरू',
        excerpt: 'गया शहर में नई सड़क परियोजना की शुरुआत हुई है जो यातायात की समस्या को कम करेगी।',
        content: 'गया शहर में आज एक नई सड़क परियोजना की शुरुआत हुई है। इस परियोजना के तहत शहर के मुख्य मार्गों को चौड़ा किया जाएगा और नई सड़कें बनाई जाएंगी। यह परियोजना 6 महीने में पूरी होने की उम्मीद है और इससे यातायात की समस्या में काफी सुधार होगा। स्थानीय निवासी इस परियोजना का स्वागत कर रहे हैं।',
        featuredImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop',
        category: 'development',
        tags: ['सड़क', 'विकास', 'गया', 'यातायात'],
        language: 'hindi',
        author: admin._id,
        status: 'published',
        isFeatured: false,
        publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        views: 89,
        seoTitle: 'गया में नई सड़क परियोजना शुरू - यातायात सुधार',
        seoDescription: 'गया शहर में नई सड़क परियोजना शुरू, 6 महीने में पूरी होगी और यातायात की समस्या को कम करेगी।'
      },
      {
        title: 'Local Business Expo 2024 in Gaya',
        excerpt: 'The annual business expo in Gaya will showcase local products and services, promoting entrepreneurship in the region.',
        content: 'Gaya is gearing up for its annual business expo scheduled for next month. This year\'s expo will feature over 100 local businesses showcasing their products and services. The event aims to promote entrepreneurship and provide a platform for local businesses to connect with customers and investors. Special sessions on digital marketing and e-commerce will also be conducted for participating businesses.',
        featuredImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop',
        category: 'business',
        tags: ['Business', 'Expo', 'Entrepreneurship', 'Gaya'],
        language: 'english',
        author: admin._id,
        status: 'published',
        isFeatured: false,
        publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        views: 67,
        seoTitle: 'Local Business Expo 2024 in Gaya - Entrepreneurship',
        seoDescription: 'Annual business expo in Gaya featuring 100+ local businesses, promoting entrepreneurship and digital marketing.'
      }
    ])
    console.log('📰 Created sample news articles')

    // Create sample job applications
    const applications = await Application.create([
      {
        jobId: jobs[0]._id,
        userId: users[1]._id,
        coverLetter: 'I am very interested in this software developer position. I have 2 years of experience with React and Node.js and I am excited to contribute to your team.',
        resumeUrl: 'https://example.com/resume1.pdf',
        status: 'pending'
      },
      {
        jobId: jobs[1]._id,
        userId: users[2]._id,
        coverLetter: 'I have a strong background in marketing and I am passionate about helping local businesses grow. I would love to be part of your marketing team.',
        resumeUrl: 'https://example.com/resume2.pdf',
        status: 'pending'
      }
    ])
    console.log('📝 Created sample job applications')

    console.log('🎉 Database seeding completed successfully!')
    console.log('\n📊 Summary:')
    console.log(`- Admin users: 1`)
    console.log(`- Regular users: ${users.length}`)
    console.log(`- Jobs: ${jobs.length}`)
    console.log(`- News articles: ${newsArticles.length}`)
    console.log(`- Job applications: ${applications.length}`)
    console.log('\n🔑 Login credentials:')
    console.log('Admin: admin@apnajourney.com / admin123')
    console.log('User: rajesh@example.com / password123')

  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  }
}

// Run the seed function
seedDatabase()
  .then(() => {
    console.log('✅ Seeding process completed')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Seeding process failed:', error)
    process.exit(1)
  })