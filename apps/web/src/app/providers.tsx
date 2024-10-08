'use client'
import { ThemeProvider } from 'next-themes'
import { PropsWithChildren } from 'react'

export const Providers = ({ children }: PropsWithChildren<{}>) => {
  return (
    <ThemeProvider
      attribute="class"
      enableSystem
      themes={['light', 'dark']}
      defaultTheme="light"
      storageKey="rememr-theme-key"
    >
      {children}
    </ThemeProvider>
  )
}
