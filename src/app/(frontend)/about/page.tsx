import { 
  Target, 
  Heart, 
  Shield, 
  Lightbulb,
  CheckCircle,
  ArrowRight,
  MapPin,
  Mail,
  Building2,
  TrendingUp,
  Newspaper
} from 'lucide-react'
import Link from 'next/link'
import StructuredData from '@/components/shared/StructuredData'
import dbConnect from '@/lib/db/mongodb'
import mongoose from 'mongoose'
import Job from '@/lib/models/Job.model'
import News from '@/lib/models/News.model'

// Force dynamic rendering to ensure fresh data
export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'About Us | Apna Journey',
  description:
    'Apna Journey connects India\'s talent with verified jobs and news. Learn about our mission, vision, and the values guiding our platform.',
}

async function getStats() {
  try {
    await dbConnect()

    // Ensure models are registered
    if (!mongoose.models.Job) {
      mongoose.model('Job', Job.schema)
    }
    if (!mongoose.models.News) {
      mongoose.model('News', News.schema)
    }
    
    const [activeJobs, publishedNews] = await Promise.all([
      Job.countDocuments({ status: 'approved' }),
      News.countDocuments({ status: 'published' })
    ])

    return {
      activeJobs,
      publishedNews
    }
  } catch (error) {
    console.error('Error fetching stats in About page:', error)
    // Return fallback values on error
    return {
      activeJobs: 0,
      publishedNews: 0
    }
  }
}

function formatStatValue(value: number): string {
  if (value >= 1000) {
    const thousands = (value / 1000).toFixed(1)
    return thousands.endsWith('.0') ? `${Math.floor(value / 1000)}K+` : `${thousands}K+`
  }
  return `${value}+`
}

export default async function AboutPage() {
  const statsData = await getStats()
  
  const stats = [
    { 
      label: 'Active Jobs', 
      value: formatStatValue(statsData.activeJobs), 
      icon: Target,
      rawValue: statsData.activeJobs
    },
    { 
      label: 'News Articles', 
      value: formatStatValue(statsData.publishedNews), 
      icon: Newspaper,
      rawValue: statsData.publishedNews
    }
  ]

  const values = [
    {
      icon: Heart,
      title: 'Community First',
      description: 'We prioritize meaningful opportunities for all Indians and local impact.'
    },
    {
      icon: Shield,
      title: 'Trust & Transparency',
      description: 'Verified listings and accountable processes to earn and keep trust.'
    },
    {
      icon: Lightbulb,
      title: 'Practical Innovation',
      description: 'We evolve the product to improve matches, speed, and reliability.'
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      <StructuredData
        data={{
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'Apna Journey',
          url: 'https://apnajourney.com',
          logo: 'https://apnajourney.com/logo1.png',
          sameAs: [
            'https://www.facebook.com/',
            'https://www.linkedin.com/',
            'https://twitter.com/',
          ],
          foundingLocation: {
            '@type': 'Place',
            name: 'New Delhi, India',
          },
          contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'customer support',
            email: 'info@apnajourney.com',
            areaServed: 'IN',
            availableLanguage: ['en', 'hi'],
          },
        }}
      />
      {/* Hero */}
      <section className="py-20 bg-gradient-to-b from-emerald-50 to-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl">
            <div className="inline-flex items-center px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-full text-xs font-medium mb-5">
              <Building2 className="w-4 h-4 mr-2" />
              About Apna Journey
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              Opportunities that move India forward
            </h1>
            <p className="mt-5 text-slate-600 text-lg max-w-2xl">
              We connect people across India with verified jobs and relevant news—reliably, simply, and at speed.
            </p>
          </div>
        </div>
      </section>

      {/* Light stats */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 gap-6 max-w-3xl">
            {stats.map((stat, i) => {
              const Icon = stat.icon
              return (
                <div key={i} className="rounded-xl border border-slate-200 p-6 bg-white">
                  <div className="flex items-center mb-2 text-slate-500">
                    <Icon className="w-4 h-4 mr-2 text-emerald-600" />
                    <span className="text-sm">{stat.label}</span>
                  </div>
                  <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* What we do + Mission */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-start max-w-6xl">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">What we do</h2>
              <p className="text-slate-600 leading-relaxed">
                We surface quality opportunities and local updates with clear categorization, powerful search, and fair curation. Listings are reviewed and news is sourced to minimize noise.
              </p>
              <div className="mt-6 space-y-3">
                {[
                  'Verified listings and editorial checks',
                  'Smart search and category filters',
                  'Simple application flows',
                ].map((item, i) => (
                  <div key={i} className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-emerald-600 mr-3" />
                    <span className="text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">Our mission</h2>
              <p className="text-slate-600 leading-relaxed">
                Make opportunity access equitable across India by reducing friction between talent, employers, and information.
              </p>
              <div className="mt-6 rounded-xl border border-emerald-100 bg-emerald-50 p-5">
                <div className="flex items-center text-emerald-800 font-medium">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Better matches. Faster decisions. Higher trust.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">Principles we work by</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl">
            {values.map((value, index) => {
              const IconComponent = value.icon
              return (
                <div key={index} className="rounded-xl border border-slate-200 bg-white p-6 hover:shadow-sm transition-shadow">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">{value.title}</h3>
                  <p className="mt-2 text-slate-600 text-sm leading-relaxed">{value.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto rounded-2xl border border-emerald-200 bg-emerald-50 p-10 text-slate-900">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h3 className="text-2xl font-bold">Ready to explore opportunities?</h3>
                <p className="mt-2 text-slate-700">Browse jobs or reach out—our team typically responds within 24 hours.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/jobs" className="inline-flex items-center justify-center px-5 py-3 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors">
                  Browse Jobs
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                <Link href="/contact" className="inline-flex items-center justify-center px-5 py-3 rounded-lg border border-emerald-600 text-emerald-700 font-semibold hover:bg-emerald-100 transition-colors">
                  Contact Us
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info (minimal) */}
      <section className="pb-24">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
            <div className="rounded-xl border border-slate-200 p-6 bg-white">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="text-sm text-slate-500">Address</div>
              <div className="mt-1 font-semibold text-slate-900">New Delhi, India</div>
            </div>
            <div className="rounded-xl border border-slate-200 p-6 bg-white">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
                <Mail className="w-5 h-5" />
              </div>
              <div className="text-sm text-slate-500">Email</div>
              <div className="mt-1 font-semibold text-slate-900">info@apnajourney.com</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
