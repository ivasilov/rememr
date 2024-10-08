'use client'

import { cn } from '@/src/lib/utils'
import { RouteType } from 'next/dist/lib/load-custom-routes'
import Link, { LinkProps } from 'next/link'
import { usePathname } from 'next/navigation'
import { PropsWithChildren } from 'react'

type LinkHref = LinkProps<RouteType>['href']

export const SideLink = ({ href, children }: PropsWithChildren<{ href: LinkHref }>) => {
  const pathname = usePathname()

  return (
    <Link
      href={href}
      className={cn(
        'text-muted-foreground hover:text-primary flex items-center gap-3 rounded-lg px-3 py-2 transition-all',
        pathname === href && 'bg-muted text-primary',
      )}
    >
      {children}
    </Link>
  )
}

export const SheetSideLink = ({ href, children }: PropsWithChildren<{ href: LinkHref }>) => {
  const pathname = usePathname()

  return (
    <Link
      href={href}
      className={cn(
        'text-muted-foreground hover:text-foreground mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2',
        pathname === href && 'bg-muted text-foreground',
      )}
    >
      {children}
    </Link>
  )
}
