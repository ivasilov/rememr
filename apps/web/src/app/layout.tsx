import { Toaster, cn } from '@rememr/ui'
import { ReactNode } from 'react'
import { Providers } from './providers'

import './globals.css'

export const metadata = {
  title: 'rememr',
  description: 'A stream of bookmarks',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <body className={cn('font-sans antialiased')}>
        <Providers>
          {children}
          <Toaster position="top-right" />
        </Providers>
      </body>
    </html>
  )
}
