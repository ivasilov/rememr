import { count, eq, useLiveQuery } from '@tanstack/react-db'
import { bookmarkSessions, bookmarkTags, sessions, tags } from '@/lib/database'

export const useSidebarTags = (userId: string) => {
  return useLiveQuery(
    (query) =>
      query
        .from({ tag: tags })
        .leftJoin({ bookmarkTag: bookmarkTags }, ({ tag, bookmarkTag }) =>
          eq(tag.id, bookmarkTag.tag_id)
        )
        .where(({ tag }) => eq(tag.user_id, userId))
        .groupBy(({ tag }) => [tag.id, tag.name])
        .select(({ tag, bookmarkTag }) => ({
          count: count(bookmarkTag.bookmark_id),
          id: tag.id,
          name: tag.name,
        }))
        .orderBy(({ $selected }) => $selected.name),
    [userId]
  )
}

export const useSidebarSessions = (userId: string) => {
  return useLiveQuery(
    (query) =>
      query
        .from({ session: sessions })
        .leftJoin(
          { bookmarkSession: bookmarkSessions },
          ({ session, bookmarkSession }) =>
            eq(session.id, bookmarkSession.session_id)
        )
        .where(({ session }) => eq(session.user_id, userId))
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
    [userId]
  )
}
