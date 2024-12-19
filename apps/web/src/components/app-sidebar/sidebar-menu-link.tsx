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
    <Link href={href as any} passHref>
      <SidebarMenuButton isActive={pathname === href} {...props}>
        {children}
      </SidebarMenuButton>
    </Link>
  )
}
