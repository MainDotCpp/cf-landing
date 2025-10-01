import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, BarChart3, LineChart, TrendingUp } from "lucide-react"

const courses = [
  {
    icon: BookOpen,
    title: "株式投資の基礎",
    description: "株式市場の仕組み、注文方法、リスク管理など、投資の基本を丁寧に解説します。",
    level: "初級",
  },
  {
    icon: BarChart3,
    title: "テクニカル分析入門",
    description: "チャートの読み方、移動平均線、RSI、MACDなどの指標を使った分析手法を学びます。",
    level: "中級",
  },
  {
    icon: LineChart,
    title: "ファンダメンタル分析",
    description: "財務諸表の読み方、企業価値の評価方法、業界分析の基礎を習得します。",
    level: "中級",
  },
  {
    icon: TrendingUp,
    title: "投資戦略と実践",
    description: "ポートフォリオ構築、リスク管理、長期投資と短期投資の戦略を実践的に学びます。",
    level: "上級",
  },
]

export function EducationSection() {
  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black mb-4 text-balance">教育コンテンツ</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
            体系的なカリキュラムで、株式投資の知識を段階的に習得できます
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((course, index) => {
            const Icon = course.icon
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-accent/20 text-accent-foreground">
                      {course.level}
                    </span>
                  </div>
                  <CardTitle className="text-xl font-bold">{course.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">{course.description}</CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
