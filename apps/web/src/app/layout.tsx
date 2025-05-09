import { Toaster, cn } from '@rememr/ui'
import { Lora, Plus_Jakarta_Sans, Roboto_Mono } from 'next/font/google'
import { ReactNode } from 'react'
import { Providers } from './providers'

import './globals.css'

export const metadata = {
  title: 'rememr',
  description: 'A stream of bookmarks',
}

const jakarta = Plus_Jakarta_Sans({
  variable: '--font-jakarta',
})
const lora = Lora({
  variable: '--font-lora',
})
const roboto = Roboto_Mono({
  variable: '--font-roboto',
})

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <body className={cn(jakarta.variable, lora.variable, roboto.variable, 'antialiased')}>
        <Providers>
          {children}
          <Toaster position="top-right" />
        </Providers>
      </body>
    </html>
  )
}
