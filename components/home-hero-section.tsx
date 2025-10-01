import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-secondary/30 to-background py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-black tracking-tight text-balance md:text-6xl lg:text-7xl mb-6">
            株式投資の知識を
            <span className="text-primary block mt-2">プロから学ぶ</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground text-pretty leading-relaxed mb-8 max-w-2xl mx-auto">
            初心者から上級者まで、実践的な株式投資の教育コンテンツと最新の市場分析を提供します。確かな知識で、あなたの投資をサポートします。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-base font-bold">
              学習を始める
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-base font-bold bg-transparent">
              市場分析を見る
            </Button>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
    </section>
  )
}
