'use client'

import React, { createContext, useContext } from 'react'
import type { ResolvedUrlConfig } from '@/lib/url-config'

const Ctx = createContext<ResolvedUrlConfig | null>(null)

export function useConfig(): ResolvedUrlConfig | null {
  return useContext(Ctx)
}

export default function ConfigProvider({ config, children }: { config: ResolvedUrlConfig; children: React.ReactNode }) {
  return <Ctx.Provider value={config}>{children}</Ctx.Provider>
}


