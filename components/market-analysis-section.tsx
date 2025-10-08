import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const marketData = [
  {
    name: '日経平均株価',
    value: '38,450.50',
    change: '+245.30',
    percentage: '+0.64%',
    trend: 'up',
  },
  {
    name: 'TOPIX',
    value: '2,678.90',
    change: '+18.75',
    percentage: '+0.70%',
    trend: 'up',
  },
  {
    name: 'マザーズ指数',
    value: '745.20',
    change: '-5.40',
    percentage: '-0.72%',
    trend: 'down',
  },
]

const analyses = [
  {
    title: '今週の市場展望',
    date: '2025年1月6日',
    summary: '米国の雇用統計発表を控え、日本市場は慎重な動きが予想されます。半導体関連株に注目が集まっています。',
    tags: ['市場全体', '週間展望'],
  },
  {
    title: 'テクノロジーセクター分析',
    date: '2025年1月5日',
    summary: 'AI関連企業の業績好調が続いており、今後も成長が期待されます。特に国内半導体製造装置メーカーに注目。',
    tags: ['セクター分析', 'テクノロジー'],
  },
  {
    title: '注目銘柄レポート',
    date: '2025年1月4日',
    summary: '自動車関連銘柄の中で、EV部品メーカーの業績が堅調です。中長期的な投資対象として検討価値があります。',
    tags: ['個別銘柄', '自動車'],
  },
]

export function MarketAnalysisSection() {
  return (
    <section className="py-20 md:py-28 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black mb-4 text-balance">市場分析</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
            最新の市場動向とプロフェッショナルな分析をお届けします
          </p>
        </div>

        {/* Market Indices */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {marketData.map((market, index) => (
            <Card key={index}>
              <CardHeader className="pb-3">
                <CardDescription className="text-xs">{market.name}</CardDescription>
                <CardTitle className="text-3xl font-black">{market.value}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  {market.trend === 'up'
                    ? (
                        <ArrowUpRight className="h-5 w-5 text-green-600" />
                      )
                    : market.trend === 'down'
                      ? (
                          <ArrowDownRight className="h-5 w-5 text-red-600" />
                        )
                      : (
                          <Minus className="h-5 w-5 text-gray-600" />
                        )}
                  <span
                    className={`text-sm font-bold ${
                      market.trend === 'up'
                        ? 'text-green-600'
                        : market.trend === 'down'
                          ? 'text-red-600'
                          : 'text-gray-600'
                    }`}
                  >
                    {market.change}
                    {' '}
                    (
                    {market.percentage}
                    )
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Analysis Articles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {analyses.map((analysis, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex flex-wrap gap-2 mb-3">
                  {analysis.tags.map((tag, tagIndex) => (
                    <Badge key={tagIndex} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <CardTitle className="text-xl font-bold text-balance">{analysis.title}</CardTitle>
                <CardDescription className="text-xs">{analysis.date}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-muted-foreground">{analysis.summary}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
