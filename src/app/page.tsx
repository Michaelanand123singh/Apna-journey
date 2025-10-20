import HeroSection from '@/components/frontend/home/HeroSection'
import LatestJobs from '@/components/frontend/home/LatestJobs'
import LatestNews from '@/components/frontend/home/LatestNews'
import CTASection from '@/components/frontend/home/CTASection'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <LatestJobs />
      <LatestNews />
      <CTASection />
    </div>
  )
}
