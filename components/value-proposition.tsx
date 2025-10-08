import { Gift, RefreshCw, Rocket } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const features = [
  {
    icon: Gift,
    title: '完全無料',
    description: '費用は一切不要。すべての株式推奨と分析を無料で提供します。',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: RefreshCw,
    title: '毎日更新',
    description: 'プロチームが毎日市場を分析し、最も有望な日本株を厳選します。',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: Rocket,
    title: '株価急騰のチャンス',
    description: '友達追加するだけで、株価急騰の可能性がある銘柄情報をゲット！',
    color: 'from-orange-500 to-red-500',
  },
]

export function ValueProposition() {
  return (
    <section className="py-12 px-4 bg-muted/30">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8 space-y-3">
          <h2 className="text-3xl font-bold tracking-tight text-balance">なぜ選ばれるのか？</h2>
          <p className="text-base text-muted-foreground text-pretty">投資家に最高の日本株分析サービスを提供</p>
        </div>

        <div className="space-y-4">
          {features.map((feature, index) => (
            <Card key={index} className="border-2 hover:border-primary transition-all hover:shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div
                    className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center flex-shrink-0 shadow-lg`}
                  >
                    <feature.icon className="h-7 w-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
