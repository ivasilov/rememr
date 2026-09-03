import { SidebarMenuButton } from '@rememr/ui'
import { Link, type LinkProps, useMatchRoute } from '@tanstack/react-router'
import type { ComponentProps, ReactNode } from 'react'

type SidebarMenuLinkProps = LinkProps &
  Omit<ComponentProps<typeof SidebarMenuButton>, 'children'> & {
    children: ReactNode
  }

export function SidebarMenuLink({
  to,
  params,
  children,
  ...props
}: SidebarMenuLinkProps) {
  const matchRoute = useMatchRoute()
  const isActive = Boolean(matchRoute({ to, params, fuzzy: false }))

  return (
    <SidebarMenuButton isActive={isActive} {...props} asChild>
      <Link params={params} to={to}>
        {children}
      </Link>
    </SidebarMenuButton>
  )
}
