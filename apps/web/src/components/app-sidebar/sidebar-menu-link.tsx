'use client'

import { SidebarMenuButton } from '@rememr/ui'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ComponentProps, PropsWithChildren } from 'react'

type SidebarMenuLinkProps = PropsWithChildren<{ href: string }> & ComponentProps<typeof SidebarMenuButton>

export function SidebarMenuLink({ href, children, ...props }: SidebarMenuLinkProps) {
  const pathname = usePathname()

  return (
    <SidebarMenuButton isActive={pathname === href} {...props} asChild>
      <Link href={href as any}>{children}</Link>
    </SidebarMenuButton>
  )
}
