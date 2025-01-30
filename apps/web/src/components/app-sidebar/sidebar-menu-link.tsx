'use client'

import { SidebarMenuButton, SidebarMenuButtonProps } from '@rememr/ui'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { PropsWithChildren } from 'react'

export function SidebarMenuLink({
  href,
  children,
  ...props
}: PropsWithChildren<{ href: string } & SidebarMenuButtonProps>) {
  const pathname = usePathname()

  return (
    <SidebarMenuButton isActive={pathname === href} {...props} asChild>
      <Link href={href as any}>{children}</Link>
    </SidebarMenuButton>
  )
}
