import { Shield, Clock, Users, Award } from "lucide-react"

const features = [
  {
    icon: Shield,
    title: "信頼性の高い情報",
    description: "経験豊富なアナリストによる正確な市場分析と投資情報を提供します。",
  },
  {
    icon: Clock,
    title: "毎日更新",
    description: "市場の動きに合わせて、最新の分析レポートを毎日お届けします。",
  },
  {
    icon: Users,
    title: "初心者にも優しい",
    description: "基礎から丁寧に解説し、誰でも理解できる教育コンテンツを用意しています。",
  },
  {
    icon: Award,
    title: "プロの知見",
    description: "実績のある投資家やアナリストの知識と経験を学ぶことができます。",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black mb-4 text-balance">選ばれる理由</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
            株式投資アカデミーが提供する価値
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
