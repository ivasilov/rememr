import { Toaster } from '@rememr/ui'
import { type QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
} from '@tanstack/react-router'
import { ThemeProvider } from 'next-themes'
import type { ReactNode } from 'react'
import { AuthCacheSync } from '@/components/auth-cache-sync'
import appCss from '../styles.css?url'

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      { title: 'rememr' },
      { name: 'description', content: 'A stream of bookmarks' },
      { name: 'apple-mobile-web-app-title', content: 'rememr' },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'manifest', href: `${import.meta.env.BASE_URL}manifest.json` },
      {
        rel: 'icon',
        href: `${import.meta.env.BASE_URL}favicon/web-app-manifest-192x192.png`,
      },
      {
        rel: 'apple-touch-icon',
        href: `${import.meta.env.BASE_URL}favicon/web-app-manifest-192x192.png`,
      },
    ],
  }),
  component: RootComponent,
  errorComponent: ({ error }) => (
    <main className="flex min-h-svh items-center justify-center p-6">
      <div className="max-w-lg text-center">
        <h1 className="font-semibold text-2xl">Something went wrong</h1>
        <p className="mt-2 text-muted-foreground text-sm">{error.message}</p>
      </div>
    </main>
  ),
  notFoundComponent: () => (
    <main className="flex min-h-svh items-center justify-center p-6">
      <h1 className="font-semibold text-2xl">Page not found</h1>
    </main>
  ),
  shellComponent: RootDocument,
})

function RootComponent() {
  const { queryClient } = Route.useRouteContext()

  return (
    <QueryClientProvider client={queryClient}>
      <AuthCacheSync />
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        storageKey="rememr-theme-key"
        themes={['light', 'dark']}
      >
        <Outlet />
        <Toaster closeButton={true} position="top-right" />
      </ThemeProvider>
    </QueryClientProvider>
  )
}

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* biome-ignore lint/style/noHeadElement: TanStack Start owns this document shell. */}
      <head>
        <HeadContent />
      </head>
      <body className="antialiased">
        {children}
        <Scripts />
      </body>
    </html>
  )
}
