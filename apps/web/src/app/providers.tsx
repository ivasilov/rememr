'use client'
import { SidebarProvider } from '@rememr/ui'
import { QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'next-themes'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { PropsWithChildren } from 'react'
import { getQueryClient } from '../lib/react-query-client'

export const Providers = ({ children }: PropsWithChildren<{}>) => {
  const queryClient = getQueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        enableSystem
        themes={['light', 'dark']}
        defaultTheme="light"
        storageKey="rememr-theme-key"
      >
        <NuqsAdapter>
          <SidebarProvider>{children}</SidebarProvider>
        </NuqsAdapter>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
