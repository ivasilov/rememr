import { SidebarMenuBadge, SidebarMenuItem } from '@rememr/ui'
import type { User } from '@supabase/supabase-js'
import { useQuery } from '@tanstack/react-query'
import { Tag } from 'lucide-react'
import { Loading } from '@/components/loading'
import { sidebarTagsQueryOptions } from './queries'
import { SidebarMenuLink } from './sidebar-menu-link'

export const TagsMenu = ({ user }: { user: User }) => {
  const { data: tags, isLoading } = useQuery(sidebarTagsQueryOptions(user.id))

  if (isLoading) {
    return <Loading size={18} />
  }

  if (tags?.length === 0) {
    return (
      <div className="mx-2 flex items-center justify-center rounded-md border border-border border-dashed py-4 text-muted-foreground text-sm">
        No tags saved yet.
      </div>
    )
  }

  return tags?.map((t) => (
    <SidebarMenuItem key={t.id}>
      <SidebarMenuLink
        className="flex items-center align-center"
        params={{ id: t.id }}
        to="/tags/$id"
      >
        <Tag />
        <span className="w-40 truncate">{t.name}</span>
      </SidebarMenuLink>
      <SidebarMenuBadge>{t.count}</SidebarMenuBadge>
    </SidebarMenuItem>
  ))
}
