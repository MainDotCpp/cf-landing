import { TrendingUp } from "lucide-react"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <TrendingUp className="h-6 w-6 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold leading-none">株式投資アカデミー</span>
            <span className="text-xs text-muted-foreground">Stock Academy</span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <span className="text-sm font-medium hover:text-primary transition-colors cursor-pointer">ホーム</span>
          <span className="text-sm font-medium hover:text-primary transition-colors cursor-pointer">
            教育コンテンツ
          </span>
          <span className="text-sm font-medium hover:text-primary transition-colors cursor-pointer">市場分析</span>
          <span className="text-sm font-medium hover:text-primary transition-colors cursor-pointer">お問い合わせ</span>
        </nav>
      </div>
    </header>
  )
}
