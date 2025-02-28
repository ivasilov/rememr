import { createClient } from '@/src/utils/supabase/server'
import { SidebarMenuBadge, SidebarMenuItem } from '@rememr/ui'
import { User } from '@supabase/supabase-js'
import { FileStack } from 'lucide-react'
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
      <div className="text-muted-foreground border-border mx-2 flex items-center justify-center rounded-md border border-dashed py-4 text-sm">
        No sessions saved yet.
      </div>
    )
  }

  return sessions?.map(t => (
    <SidebarMenuItem key={t.id}>
      <SidebarMenuLink href={`/sessions/${t.id}`} className="align-center flex items-center">
        <FileStack />
        <span className="w-40 truncate">{t.name}</span>
      </SidebarMenuLink>
      <SidebarMenuBadge>{t.count}</SidebarMenuBadge>
    </SidebarMenuItem>
  ))
}
