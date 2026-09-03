import { SidebarMenuBadge, SidebarMenuItem } from '@rememr/ui'
import type { User } from '@supabase/supabase-js'
import { useQuery } from '@tanstack/react-query'
import { FileStack } from 'lucide-react'
import { Loading } from '@/components/loading'
import { sidebarSessionsQueryOptions } from './queries'
import { SidebarMenuLink } from './sidebar-menu-link'

export const SessionsMenu = ({ user }: { user: User }) => {
  const { data: sessions, isLoading } = useQuery(
    sidebarSessionsQueryOptions(user.id)
  )

  if (isLoading) {
    return <Loading size={18} />
  }

  if (sessions?.length === 0) {
    return (
      <div className="mx-2 flex items-center justify-center rounded-md border border-border border-dashed py-4 text-muted-foreground text-sm">
        No sessions saved yet.
      </div>
    )
  }

  return sessions?.map((t) => (
    <SidebarMenuItem key={t.id}>
      <SidebarMenuLink
        className="flex items-center align-center"
        params={{ id: t.id }}
        to="/sessions/$id"
      >
        <FileStack />
        <span className="w-40 truncate">{t.name}</span>
      </SidebarMenuLink>
      <SidebarMenuBadge>{t.count}</SidebarMenuBadge>
    </SidebarMenuItem>
  ))
}
