import { cn, Toaster } from '@rememr/ui'
import { Geist_Mono } from 'next/font/google'
import type { ReactNode } from 'react'
import { Providers } from './providers'

import './globals.css'

export const metadata = {
  title: 'rememr',
  description: 'A stream of bookmarks',
}

const geistSans = Geist_Mono({
  variable: '--font-sans',
  display: 'swap',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-mono',
  display: 'swap',
  subsets: ['latin'],
})

const geistSerif = Geist_Mono({
  variable: '--font-serif',
  display: 'swap',
  subsets: ['latin'],
})

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta content="rememr" name="apple-mobile-web-app-title" />
      </head>
      <body
        className={cn(
          geistSans.variable,
          geistMono.variable,
          geistSerif.variable,
          'antialiased'
        )}
      >
        <Providers>
          {children}
          <Toaster closeButton={true} position="top-right" />
        </Providers>
      </body>
    </html>
  )
}
