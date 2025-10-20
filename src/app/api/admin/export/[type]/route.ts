import { NextRequest, NextResponse } from 'next/server'
import mongoose from 'mongoose'
import dbConnect from '@/lib/db/mongodb'
import { verifyAdminTokenFromRequest } from '@/lib/middleware/adminAuth'
import User from '@/lib/models/User.model'
import Job from '@/lib/models/Job.model'
import News from '@/lib/models/News.model'
import Inquiry from '@/lib/models/Inquiry.model'
import Application from '@/lib/models/Application.model'

// GET - Export data as CSV
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  try {
    // Verify admin authentication
    const admin = await verifyAdminTokenFromRequest(request)
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()

    // Ensure User model is registered
    if (!mongoose.models.User) {
      mongoose.model('User', User.schema)
    }

    const { type } = await params

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let data: any[] = []
    let filename = ''

    switch (type) {
      case 'users':
        data = await User.find({}).select('-password').lean()
        filename = 'users'
        break
      case 'jobs':
        data = await Job.find({}).populate('postedBy', 'name email').lean()
        filename = 'jobs'
        break
      case 'news':
        data = await News.find({}).lean()
        filename = 'news'
        break
      case 'inquiries':
        data = await Inquiry.find({}).lean()
        filename = 'inquiries'
        break
      case 'applications':
        data = await Application.find({}).populate('job', 'title company').populate('applicant', 'name email').lean()
        filename = 'applications'
        break
      case 'all':
        // Export all data
        const [users, jobs, news, inquiries, applications] = await Promise.all([
          User.find({}).select('-password').lean(),
          Job.find({}).populate('postedBy', 'name email').lean(),
          News.find({}).lean(),
          Inquiry.find({}).lean(),
          Application.find({}).populate('job', 'title company').populate('applicant', 'name email').lean()
        ])
        
        // Combine all data
        data = [
          ...users.map(item => ({ ...item, _type: 'user' })),
          ...jobs.map(item => ({ ...item, _type: 'job' })),
          ...news.map(item => ({ ...item, _type: 'news' })),
          ...inquiries.map(item => ({ ...item, _type: 'inquiry' })),
          ...applications.map(item => ({ ...item, _type: 'application' }))
        ]
        filename = 'all-data'
        break
      default:
        return NextResponse.json(
          { success: false, message: 'Invalid export type' },
          { status: 400 }
        )
    }

    // Convert to CSV
    const csv = convertToCSV(data)

    // Return CSV file
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}-${new Date().toISOString().split('T')[0]}.csv"`
      }
    })

  } catch (error) {
    console.error('Error exporting data:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to export data' },
      { status: 500 }
    )
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function convertToCSV(data: any[]): string {
  if (data.length === 0) return ''

  // Get all unique keys from all objects
  const allKeys = new Set<string>()
  data.forEach(item => {
    Object.keys(item).forEach(key => {
      if (key !== '_id' && key !== '__v') {
        allKeys.add(key)
      }
    })
  })

  const headers = Array.from(allKeys)
  
  // Create CSV header
  const csvHeader = headers.join(',')
  
  // Create CSV rows
  const csvRows = data.map(item => {
    return headers.map(header => {
      const value = item[header]
      if (value === null || value === undefined) return ''
      
      // Handle nested objects
      if (typeof value === 'object') {
        return `"${JSON.stringify(value).replace(/"/g, '""')}"`
      }
      
      // Handle arrays
      if (Array.isArray(value)) {
        return `"${value.join('; ')}"`
      }
      
      // Handle strings with commas or quotes
      if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
        return `"${value.replace(/"/g, '""')}"`
      }
      
      return value
    }).join(',')
  })

  return [csvHeader, ...csvRows].join('\n')
}
