import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { EducationSection } from "@/components/education-section"
import { MarketAnalysisSection } from "@/components/market-analysis-section"
import { FeaturesSection } from "@/components/features-section"
import { Footer } from "@/components/footer"

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
