import { createClient } from '@/lib/supabase/server'
import { SidebarMenuBadge, SidebarMenuItem } from '@rememr/ui'
import { User } from '@supabase/supabase-js'
import { Tag } from 'lucide-react'
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
      <div className="text-muted-foreground border-border mx-2 flex items-center justify-center rounded-md border border-dashed py-4 text-sm">
        No tags saved yet.
      </div>
    )
  }

  const sorted = (tags || []).sort((a, b) => a.name.localeCompare(b.name))

  return sorted?.map(t => (
    <SidebarMenuItem key={t.id}>
      <SidebarMenuLink href={`/tags/${t.id}`} className="align-center flex items-center">
        <Tag />
        <span className="w-40 truncate">{t.name}</span>
      </SidebarMenuLink>
      <SidebarMenuBadge>{t.count}</SidebarMenuBadge>
    </SidebarMenuItem>
  ))
}
