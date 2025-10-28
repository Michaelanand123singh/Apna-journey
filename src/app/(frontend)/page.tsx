import { Metadata } from 'next'
import Script from 'next/script'
import HeroSection from '@/components/frontend/home/HeroSection'
import LatestJobs from '@/components/frontend/home/LatestJobs'
import GovernmentJobs from '@/components/frontend/home/GovernmentJobs'
import LatestNews from '@/components/frontend/home/LatestNews'
import InternshipJobs from '@/components/frontend/home/InternshipJobs'
import PrivateSectorJobs from '@/components/frontend/home/PrivateSectorJobs'
import ITSoftwareJobs from '@/components/frontend/home/ITSoftwareJobs'
import MarketingSalesJobs from '@/components/frontend/home/MarketingSalesJobs'

// Force dynamic rendering to avoid build issues
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Apna Journey - Bihar Ki Awaaz | Jobs & News in Bihar',
  description: 'Find local jobs and stay updated with Bihar news. Your one-stop platform for opportunities and information across Bihar.',
  openGraph: {
    title: 'Apna Journey - Bihar Ki Awaaz | Jobs & News in Bihar',
    description: 'Find local jobs and stay updated with Bihar news. Your one-stop platform for opportunities and information across Bihar.',
    url: 'https://apnajourney.com',
    siteName: 'Apna Journey - Bihar Ki Awaaz',
    type: 'website',
    locale: 'en_IN',
  },
}

const schemaData = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Apna Journey - Bihar Ki Awaaz',
  url: 'https://apnajourney.com',
  description: 'Find local jobs and stay updated with Bihar news',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://apnajourney.com/search?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
}

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Apna Journey',
  url: 'https://apnajourney.com',
  logo: 'https://apnajourney.com/images/logo.png',
  sameAs: [
    'https://facebook.com/apnajourney',
    'https://twitter.com/apnajourney',
    'https://instagram.com/apnajourney',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'Customer Service',
    email: 'info@apnajourney.com',
    areaServed: 'IN-BR',
    availableLanguage: ['English', 'Hindi'],
  },
}

export default function HomePage() {
  return (
    <>
      <Script
        id="website-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <div className="min-h-screen">
        {/* Hero Section */}
        <HeroSection />

        {/* Latest Jobs and Government Jobs */}
        <section className="py-12 sm:py-16 bg-gradient-to-br from-slate-50 to-green-50/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-4 lg:gap-6">
              {/* Latest Jobs */}
              <div className="bg-white rounded-lg shadow-sm p-4 lg:p-5">
                <LatestJobs />
              </div>
              
              {/* Government Jobs */}
              <div className="bg-white rounded-lg shadow-sm p-4 lg:p-5">
                <GovernmentJobs />
              </div>
            </div>
          </div>
        </section>

        {/* New Sections: Internship + Private Sector */}
        <section className="py-12 sm:py-16 bg-gradient-to-br from-slate-50 to-green-50/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-4 lg:gap-6">
              <div className="bg-white rounded-lg shadow-sm p-4 lg:p-5">
                <InternshipJobs />
              </div>
              <div className="bg-white rounded-lg shadow-sm p-4 lg:p-5">
                <PrivateSectorJobs />
              </div>
            </div>
          </div>
        </section>

        {/* New Sections: IT & Software + Marketing & Sales */}
        <section className="py-12 sm:py-16 bg-gradient-to-br from-slate-50 to-green-50/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-4 lg:gap-6">
              <div className="bg-white rounded-lg shadow-sm p-4 lg:p-5">
                <ITSoftwareJobs />
              </div>
              <div className="bg-white rounded-lg shadow-sm p-4 lg:p-5">
                <MarketingSalesJobs />
              </div>
            </div>
          </div>
        </section>

        {/* Latest News */}
        <LatestNews />
      </div>
    </>
  )
}
