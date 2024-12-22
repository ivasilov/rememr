import { Toaster } from '@rememr/ui'
import { ReactNode } from 'react'
import { Providers } from './providers'

import '@rememr/ui/globals.css'
import './globals.css'

export const metadata = {
  title: 'rememr',
  description: 'A stream of bookmarks',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <body className="font-sans">
        <Providers>
          {children}
          <Toaster position="top-right" />
        </Providers>
      </body>
    </html>
  )
}
