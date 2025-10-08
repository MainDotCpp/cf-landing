import { ArrowUpRight, Lock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

const sampleStocks = [
  {
    name: 'トヨタ自動車',
    code: '7203',
    sector: '自動車製造',
    trend: '+5.2%',
    rating: '強力推奨',
    color: 'bg-green-500',
  },
  {
    name: 'ソニーグループ',
    code: '6758',
    sector: '電子技術',
    trend: '+3.8%',
    rating: '推奨',
    color: 'bg-blue-500',
  },
  {
    name: 'ソフトバンクグループ',
    code: '9984',
    sector: '投資持株',
    trend: '+4.1%',
    rating: '推奨',
    color: 'bg-purple-500',
  },
]

export function StockShowcase() {
  return (
    <section className="py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8 space-y-3">
          <Badge variant="outline" className="text-sm px-4 py-2 bg-accent/10 text-accent border-accent">
            本日の厳選銘柄
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight text-balance">最新株式推奨</h2>
          <p className="text-base text-muted-foreground text-pretty">本日厳選した優良日本株</p>
        </div>

        <div className="space-y-4 mb-8">
          {sampleStocks.map((stock, index) => (
            <Card key={index} className="hover:shadow-xl transition-all border-2 hover:border-primary">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-1">{stock.name}</h3>
                    <p className="text-sm text-muted-foreground">{stock.code}</p>
                  </div>
                  <Badge className={`${stock.color} text-white border-0 font-bold`}>{stock.rating}</Badge>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-muted-foreground">{stock.sector}</span>
                  <div className="flex items-center gap-1 text-green-600 font-bold text-lg">
                    <ArrowUpRight className="h-5 w-5" />
                    <span>{stock.trend}</span>
                  </div>
                </div>

                <div className="pt-4 border-t bg-muted/30 -mx-5 -mb-5 px-5 py-3 rounded-b-lg">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Lock className="h-4 w-4" />
                    <span className="font-medium">詳細分析は友達追加で確認</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center bg-accent/10 rounded-xl p-4 border-2 border-accent/20">
          <p className="text-sm font-medium text-accent">
            ※ 上記はサンプルデータです。実際の推奨は友達追加で取得できます
          </p>
        </div>
      </div>
    </section>
  )
}
