import { Sparkles, TrendingUp, Zap } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import StockImage from '@/images/japanese-stock-market-chart-with-rising-trend-and-.jpg'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-primary/5 py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-accent to-accent/80 px-4 py-2 text-sm font-bold text-white shadow-lg mb-6 animate-pulse">
          <Sparkles className="h-4 w-4" />
          <span>完全無料で毎日更新</span>
        </div>

        <h1 className="text-4xl font-black tracking-tight text-balance mb-4 leading-tight">
          友達追加で
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary mt-2 text-5xl">
            株価急騰！
          </span>
        </h1>

        <p className="text-lg text-muted-foreground text-pretty leading-relaxed mb-8">
          プロが厳選した日本の優良株を毎日配信。友達追加するだけで、あなたの投資が変わります。
        </p>

        <Button
          size="lg"
          className="w-full bg-gradient-to-r from-accent to-accent/90 hover:from-accent/90 hover:to-accent text-white text-xl font-bold py-7 shadow-xl mb-6"
        >
          <Zap className="mr-2 h-6 w-6" />
          今すぐ友達追加
        </Button>

        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="bg-card rounded-xl p-4 text-center border-2 border-primary/20">
            <div className="text-xl font-bold text-primary">毎日</div>
            <div className="text-xs text-muted-foreground mt-1">更新</div>
          </div>
          <div className="bg-card rounded-xl p-4 text-center border-2 border-primary/20">
            <div className="text-xl font-bold text-primary">10,000+</div>
            <div className="text-xs text-muted-foreground mt-1">ユーザー</div>
          </div>
          <div className="bg-card rounded-xl p-4 text-center border-2 border-primary/20">
            <div className="text-xl font-bold text-primary">無料</div>
            <div className="text-xs text-muted-foreground mt-1">完全</div>
          </div>
        </div>

        <div className="relative rounded-2xl overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/30 mix-blend-overlay"></div>
          <Image
            src={StockImage}
            alt="日本株式市場の上昇トレンド"
            className="w-full h-64 object-cover"
          />
          <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur rounded-xl shadow-lg p-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">本日のおすすめ</p>
                <p className="text-lg font-bold text-foreground">5銘柄を配信中</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
