'use client'
import { ThemeProvider } from 'next-themes'
import type { PropsWithChildren } from 'react'

export const Providers = ({ children }: PropsWithChildren<object>) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      storageKey="rememr-theme-key"
      themes={['light', 'dark']}
    >
      {children}
    </ThemeProvider>
  )
}
