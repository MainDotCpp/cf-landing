"use client"

import { useConfig } from '@/components/ConfigProvider'

export function useCtaLink(key: 'primary' | 'secondary', fallback?: string): string {
  const cfg = useConfig()
  const url = cfg?.ctas?.[key]
  return url ?? (fallback ?? '#')
}


