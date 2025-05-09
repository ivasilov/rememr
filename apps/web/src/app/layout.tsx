import { Toaster, cn } from '@rememr/ui'
import { Geist_Mono } from 'next/font/google'
import { ReactNode } from 'react'
import { Providers } from './providers'

import './globals.css'

export const metadata = {
  title: 'rememr',
  description: 'A stream of bookmarks',
}

const geistSans = Geist_Mono({
  variable: '--font-sans',
})

const geistMono = Geist_Mono({
  variable: '--font-mono',
})

const geistSerif = Geist_Mono({
  variable: '--font-serif',
})

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <body className={cn('antialiased')}>
        <Providers>
          {children}
          <Toaster position="top-right" />
        </Providers>
      </body>
    </html>
  )
}
