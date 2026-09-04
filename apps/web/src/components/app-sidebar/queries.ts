import { eq, useLiveQuery } from '@tanstack/react-db'
import { useMemo } from 'react'
import { useDatabase } from '@/lib/database'

export const useSidebarTags = (userId: string) => {
  const { bookmarkTags, tags } = useDatabase()
  const tagsResult = useLiveQuery(
    (query) =>
      query
        .from({ tag: tags })
        .where(({ tag }) => eq(tag.user_id, userId))
        .orderBy(({ tag }) => tag.name)
        .select(({ tag }) => ({ ...tag })),
    [userId]
  )
  const relationsResult = useLiveQuery((query) =>
    query.from({ bookmarkTag: bookmarkTags })
  )

  const data = useMemo(() => {
    const counts = new Map<string, number>()
    for (const relation of relationsResult.data) {
      counts.set(relation.tag_id, (counts.get(relation.tag_id) ?? 0) + 1)
    }

    return tagsResult.data.map((tag) => ({
      id: tag.id,
      name: tag.name,
      count: counts.get(tag.id) ?? 0,
    }))
  }, [relationsResult.data, tagsResult.data])

  return {
    data,
    isError: tagsResult.isError || relationsResult.isError,
    isLoading: tagsResult.isLoading || relationsResult.isLoading,
  }
}

export const useSidebarSessions = (userId: string) => {
  const { bookmarkSessions, sessions } = useDatabase()
  const sessionsResult = useLiveQuery(
    (query) =>
      query
        .from({ session: sessions })
        .where(({ session }) => eq(session.user_id, userId))
        .orderBy(({ session }) => session.created_at, 'desc')
        .select(({ session }) => ({ ...session })),
    [userId]
  )
  const relationsResult = useLiveQuery((query) =>
    query.from({ bookmarkSession: bookmarkSessions })
  )

  const data = useMemo(() => {
    const counts = new Map<string, number>()
    for (const relation of relationsResult.data) {
      counts.set(
        relation.session_id,
        (counts.get(relation.session_id) ?? 0) + 1
      )
    }

    return sessionsResult.data.map((session) => ({
      id: session.id,
      name: session.name,
      count: counts.get(session.id) ?? 0,
    }))
  }, [relationsResult.data, sessionsResult.data])

  return {
    data,
    isError: sessionsResult.isError || relationsResult.isError,
    isLoading: sessionsResult.isLoading || relationsResult.isLoading,
  }
}
