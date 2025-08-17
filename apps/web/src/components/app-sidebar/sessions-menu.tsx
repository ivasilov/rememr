import { SidebarMenuBadge, SidebarMenuItem } from '@rememr/ui'
import type { User } from '@supabase/supabase-js'
import { FileStack } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { SidebarMenuLink } from './sidebar-menu-link'

export const SessionsMenu = async ({ user }: { user: User }) => {
  const supabase = await createClient()

  const { data: sessions } = await supabase
    .from('bookmarks_sessions')
    .select('...sessions(id,name), bookmark_id.count()')
    .eq('sessions.user_id', user.id)
    .order('created_at', { ascending: false, referencedTable: 'sessions' })

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
        href={`/sessions/${t.id}`}
      >
        <FileStack />
        <span className="w-40 truncate">{t.name}</span>
      </SidebarMenuLink>
      <SidebarMenuBadge>{t.count}</SidebarMenuBadge>
    </SidebarMenuItem>
  ))
}
