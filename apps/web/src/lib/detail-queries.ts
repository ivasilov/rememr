import { eq, useLiveQuery } from '@tanstack/react-db'
import { sessions, tags } from '@/lib/database'

export const useTagDetail = (id: string) => {
  return useLiveQuery(
    (query) =>
      query
        .from({ tag: tags })
        .where(({ tag }) => eq(tag.id, id))
        .select(({ tag }) => ({ ...tag }))
        .findOne(),
    [id]
  )
}

export const useSessionDetail = (id: string) => {
  return useLiveQuery(
    (query) =>
      query
        .from({ session: sessions })
        .where(({ session }) => eq(session.id, id))
        .select(({ session }) => ({ ...session }))
        .findOne(),
    [id]
  )
}
