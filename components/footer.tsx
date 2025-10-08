import { TrendingUp } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gradient-to-b from-primary to-primary/90 text-primary-foreground py-8 px-4">
      <div className="max-w-md mx-auto">
        <div className="space-y-6">
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-2">
              <TrendingUp className="h-6 w-6" />
              <span className="text-xl font-bold">日本株式推奨</span>
            </div>
            <p className="text-sm text-primary-foreground/80 leading-relaxed">
              プロによる日本株の分析と推奨サービス。毎日更新、完全無料。
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-white/10 rounded-lg p-4">
              <h3 className="font-semibold mb-2 text-sm">サービス</h3>
              <ul className="space-y-1 text-xs text-primary-foreground/80">
                <li>株式推奨</li>
                <li>市場分析</li>
                <li>投資アドバイス</li>
                <li>毎日更新</li>
              </ul>
            </div>

            <div className="bg-white/10 rounded-lg p-4">
              <h3 className="font-semibold mb-2 text-sm">情報</h3>
              <ul className="space-y-1 text-xs text-primary-foreground/80">
                <li>会社概要</li>
                <li>お問い合わせ</li>
                <li>プライバシー</li>
                <li>利用規約</li>
              </ul>
            </div>
          </div>

          <div className="text-center bg-white/10 rounded-lg p-4">
            <h3 className="font-semibold mb-2 text-sm">お問い合わせ</h3>
            <p className="text-xs text-primary-foreground/80 leading-relaxed">
              友達追加で毎日の株式推奨と市場分析を受け取れます。
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-primary-foreground/20 text-center space-y-2">
          <p className="text-xs text-primary-foreground/60">© 2025 日本株式推奨. All rights reserved.</p>
          <p className="text-xs text-primary-foreground/60 leading-relaxed">
            投資にはリスクが伴います。本サービスは参考情報であり、投資助言ではありません。
          </p>
        </div>
      </div>
    </footer>
  )
}
