import HeroSection from '@/components/frontend/home/HeroSection'
import FeaturesSection from '@/components/frontend/home/FeaturesSection'
import StatsSection from '@/components/frontend/home/StatsSection'
import LatestJobs from '@/components/frontend/home/LatestJobs'
import LatestNews from '@/components/frontend/home/LatestNews'
import CTASection from '@/components/frontend/home/CTASection'

// Force dynamic rendering to avoid build issues
export const dynamic = 'force-dynamic'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Hero Section with enhanced spacing */}
      <section className="relative overflow-hidden">
        <HeroSection />
      </section>

      {/* Features Section with better spacing */}
      <section className="py-20 bg-white">
        <FeaturesSection />
      </section>

      {/* Stats Section with professional styling */}
      <section className="py-16 bg-gradient-to-r from-slate-50 to-blue-50/50">
        <StatsSection />
      </section>

      {/* Latest Jobs with enhanced layout */}
      <section className="py-20 bg-white">
        <LatestJobs />
      </section>

      {/* Latest News with professional styling */}
      <section className="py-20 bg-gradient-to-r from-indigo-50/50 to-purple-50/50">
        <LatestNews />
      </section>

      {/* CTA Section with enhanced design */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <CTASection />
      </section>
    </div>
  )
}
