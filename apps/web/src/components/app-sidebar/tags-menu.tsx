import { SidebarMenuBadge, SidebarMenuItem } from '@rememr/ui'
import type { User } from '@supabase/supabase-js'
import { count, eq } from '@tanstack/react-db'
import { Tag } from 'lucide-react'
import { Loading } from '@/components/loading'
import { bookmarkTags, tags as tagCollection } from '@/lib/database'
import { SidebarMenuLink } from './sidebar-menu-link'
import { useQueryOnce } from './use-query-once'

export const TagsMenu = ({ user }: { user: User }) => {
  const { data: tags = [], isLoading } = useQueryOnce(
    (query) =>
      query
        .from({ tag: tagCollection })
        .where(({ tag }) => eq(tag.user_id, user.id))
        .orderBy(({ tag }) => tag.name)
        .leftJoin({ bookmarkTag: bookmarkTags }, ({ tag, bookmarkTag }) =>
          eq(tag.id, bookmarkTag.tag_id)
        )
        .groupBy(({ tag }) => [tag.id])
        .select(({ tag, bookmarkTag }) => ({
          count: count(bookmarkTag.bookmark_id),
          id: tag.id,
          name: tag.name,
        })),
    [user.id]
  )
  // https://ygwqnbxleufbvsnulzwp.supabase.co/rest/v1/tags?select=*,bookmarks_tags!tag_id(*)&user_id=eq.8999b3f3-6465-4135-9b4f-42c750b90ffb&order=name.asc
  // https://ygwqnbxleufbvsnulzwp.supabase.co/rest/v1/tags?select=*,bookmarks_tags!tag_id(*)&user_id=eq.8999b3f3-6465-4135-9b4f-42c750b90ffb&order=name.asc

  if (isLoading) {
    return <Loading size={18} />
  }

  if (tags.length === 0) {
    return (
      <div className="mx-2 flex items-center justify-center rounded-md border border-border border-dashed py-4 text-muted-foreground text-sm">
        No tags saved yet.
      </div>
    )
  }

  return tags.map((t) => (
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
