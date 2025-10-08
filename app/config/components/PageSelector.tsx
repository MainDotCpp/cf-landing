import { Input } from '@/components/ui/input'
import type { PageInfo } from '@/types/config'

interface PageSelectorProps {
  value: string
  onChange: (value: string) => void
  pages: PageInfo[]
}

export function PageSelector({ value, onChange, pages }: PageSelectorProps) {
  return (
    <div className="space-y-2">
      <Input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="/contact"
        className="focus:ring-2 focus:ring-blue-500"
      />
      {pages.length > 0 && (
        <div>
          <p className="text-xs text-slate-600 mb-2 font-medium">可用页面：</p>
          <div className="flex flex-wrap gap-2">
            {pages.map(page => (
              <button
                key={page.path}
                type="button"
                onClick={() => onChange(page.path)}
                className="group px-3 py-1.5 text-xs bg-slate-100 hover:bg-blue-100 border border-slate-200 hover:border-blue-300 rounded-md transition-all"
                title={page.location}
              >
                <span className="font-medium">{page.name}</span>
                <span className="text-slate-400 group-hover:text-blue-600 ml-1">
                  (
                  {page.path}
                  )
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
      <p className="text-xs text-slate-500">
        点击上方按钮快速选择，或手动输入任何有效的页面路径
      </p>
    </div>
  )
}

