import { SidebarMenuBadge, SidebarMenuItem } from '@rememr/ui'
import type { User } from '@supabase/supabase-js'
import { Tag } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { SidebarMenuLink } from './sidebar-menu-link'

export const TagsMenu = async ({ user }: { user: User }) => {
  const supabase = await createClient()

  const { data: tags } = await supabase
    .from('bookmarks_tags')
    .select('...tags(id,name), bookmark_id.count()')
    .eq('tags.user_id', user.id)
    .throwOnError()

  if (tags?.length === 0) {
    return (
      <div className="mx-2 flex items-center justify-center rounded-md border border-border border-dashed py-4 text-muted-foreground text-sm">
        No tags saved yet.
      </div>
    )
  }

  const sorted = (tags || []).sort((a, b) => a.name.localeCompare(b.name))

  return sorted?.map((t) => (
    <SidebarMenuItem key={t.id}>
      <SidebarMenuLink
        className="flex items-center align-center"
        href={`/tags/${t.id}`}
      >
        <Tag />
        <span className="w-40 truncate">{t.name}</span>
      </SidebarMenuLink>
      <SidebarMenuBadge>{t.count}</SidebarMenuBadge>
    </SidebarMenuItem>
  ))
}
