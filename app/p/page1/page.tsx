import { CallToAction } from '@/components/call-to-action'
import { Footer } from '@/components/footer'
import { HeroSection } from '@/components/hero-section'
import { StockShowcase } from '@/components/stock-showcase'
import { ValueProposition } from '@/components/value-proposition'

export default function Page1() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <ValueProposition />
      <StockShowcase />
      <CallToAction />
      <Footer />
    </main>
  )
}
