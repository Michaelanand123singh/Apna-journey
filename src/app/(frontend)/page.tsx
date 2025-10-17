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
    <div className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <LatestJobs />
      <LatestNews />
      <StatsSection />
      <CTASection />
    </div>
  )
}
