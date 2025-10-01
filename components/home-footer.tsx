export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-lg mb-4">株式投資アカデミー</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              信頼できる株式投資の教育と市場分析を提供するプラットフォーム
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4">教育コンテンツ</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="hover:text-primary transition-colors cursor-pointer">株式投資の基礎</li>
              <li className="hover:text-primary transition-colors cursor-pointer">テクニカル分析</li>
              <li className="hover:text-primary transition-colors cursor-pointer">ファンダメンタル分析</li>
              <li className="hover:text-primary transition-colors cursor-pointer">投資戦略</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">市場分析</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="hover:text-primary transition-colors cursor-pointer">週間市場展望</li>
              <li className="hover:text-primary transition-colors cursor-pointer">セクター分析</li>
              <li className="hover:text-primary transition-colors cursor-pointer">注目銘柄</li>
              <li className="hover:text-primary transition-colors cursor-pointer">経済指標</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">サポート</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="hover:text-primary transition-colors cursor-pointer">よくある質問</li>
              <li className="hover:text-primary transition-colors cursor-pointer">お問い合わせ</li>
              <li className="hover:text-primary transition-colors cursor-pointer">利用規約</li>
              <li className="hover:text-primary transition-colors cursor-pointer">プライバシーポリシー</li>
            </ul>
          </div>
        </div>

        <div className="border-t pt-8 text-center text-sm text-muted-foreground">
          <p>© 2025 株式投資アカデミー. All rights reserved.</p>
          <p className="mt-2 text-xs">投資にはリスクが伴います。投資判断は自己責任でお願いいたします。</p>
        </div>
      </div>
    </footer>
  )
}
