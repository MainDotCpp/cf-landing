import { trackCtaClick } from '@/lib/analytics'
import { Button } from '@/components/ui/button'
import type { ButtonProps } from '@/components/ui/button'

interface CtaButtonProps extends Omit<ButtonProps, 'onClick'> {
  href: string
  ctaType?: 'primary' | 'secondary'
  label?: string
  openInNewTab?: boolean
  onClick?: () => void
}

/**
 * CTA 按钮组件 - 集成跳转和谷歌跟踪
 */
export function CtaButton({
  href,
  ctaType = 'primary',
  label,
  openInNewTab = false,
  onClick,
  children,
  ...buttonProps
}: CtaButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // 上报谷歌分析
    trackCtaClick(ctaType, href, label || children?.toString())

    // 执行自定义回调
    onClick?.()

    // 如果是 # 或空，阻止默认行为
    if (!href || href === '#') {
      e.preventDefault()
      return
    }

    // 执行跳转
    if (openInNewTab) {
      window.open(href, '_blank', 'noopener,noreferrer')
    }
    else {
      window.location.href = href
    }
  }

  return (
    <Button
      onClick={handleClick}
      {...buttonProps}
    >
      {children}
    </Button>
  )
}

