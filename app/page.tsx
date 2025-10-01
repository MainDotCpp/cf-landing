import { EducationSection } from '@/components/education-section'
import { FeaturesSection } from '@/components/features-section'
import { Header } from '@/components/header'
import { Footer } from '@/components/home-footer'
import { HeroSection } from '@/components/home-hero-section'
import { MarketAnalysisSection } from '@/components/market-analysis-section'

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <EducationSection />
        <MarketAnalysisSection />
        <FeaturesSection />
      </main>
      <Footer />
    </div>
  )
}
