'use client'

import { MessageCircle, TrendingUp, Zap } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useCtaLink } from '@/components/hooks/useCtaLink'

export function CallToAction() {
  const primaryLink = useCtaLink('primary', '#')
  return (
    <section className="py-12 px-4 bg-gradient-to-b from-primary/10 to-accent/10">
      <div className="max-w-md mx-auto">
        <Card className="border-2 border-primary/20 p-0 shadow-2xl overflow-hidden">
          <CardContent className="p-0">
            <div className="bg-gradient-to-r from-primary to-accent p-6 text-white text-center">
              <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 text-sm font-bold mb-4">
                <Zap className="h-4 w-4" />
                <span>今だけ限定</span>
              </div>
              <h2 className="text-3xl font-black tracking-tight mb-3 leading-tight">
                友達追加で
                <span className="block text-4xl mt-1">株価急騰のチャンス！</span>
              </h2>
              <p className="text-white/90 text-base leading-relaxed">毎日厳選された日本株情報を無料配信</p>
            </div>

            <div className="p-6 bg-white">

              <Button
                asChild
                size="lg"
                className="w-full bg-gradient-to-r from-accent to-accent/90 hover:from-accent/90 hover:to-accent text-white text-xl font-bold py-7 shadow-xl mb-4"
              >
                <Link href={primaryLink}>
                  <MessageCircle className="mr-2 h-6 w-6" />
                  今すぐ友達追加
                </Link>
              </Button>

              <div className="grid grid-cols-3 gap-2 mt-6">
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-xl font-bold text-primary">無料</div>
                  <div className="text-xs text-muted-foreground">完全</div>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-xl font-bold text-primary">毎日</div>
                  <div className="text-xs text-muted-foreground">更新</div>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-center gap-1">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-xs text-muted-foreground">急騰</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
