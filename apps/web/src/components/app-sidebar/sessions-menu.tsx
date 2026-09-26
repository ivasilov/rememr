import { SidebarMenuBadge, SidebarMenuItem } from '@rememr/ui'
import type { User } from '@supabase/supabase-js'
import { count, eq } from '@tanstack/react-db'
import { FileStack } from 'lucide-react'
import { Loading } from '@/components/loading'
import { bookmarkSessions, sessions as sessionCollection } from '@/lib/database'
import { SidebarMenuLink } from './sidebar-menu-link'
import { useQueryOnce } from './use-query-once'

export const SessionsMenu = ({ user }: { user: User }) => {
  const { data: sessions, isLoading } = useQueryOnce(
    (query) =>
      query
        .from({ session: sessionCollection })
        .leftJoin(
          { bookmarkSession: bookmarkSessions },
          ({ session, bookmarkSession }) =>
            eq(session.id, bookmarkSession.session_id)
        )
        .where(({ session }) => eq(session.user_id, user.id))
        .groupBy(({ session }) => [
          session.created_at,
          session.id,
          session.name,
        ])
        .select(({ session, bookmarkSession }) => ({
          count: count(bookmarkSession.bookmark_id),
          createdAt: session.created_at,
          id: session.id,
          name: session.name,
        }))
        .orderBy(({ $selected }) => $selected.createdAt, 'desc'),
    [user.id]
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
