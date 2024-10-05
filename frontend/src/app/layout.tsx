// add fontawesome CSS so that the icons are don't cause layout shift
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false

import { Toaster } from '../components/ui/sonner'
import './globals.css'
import { Providers } from './providers'

export const metadata = {
  title: 'rememr',
  description: 'A stream of bookmarks',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
