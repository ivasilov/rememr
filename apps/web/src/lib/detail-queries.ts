import { eq, useLiveQuery } from '@tanstack/react-db'
import { useDatabase } from '@/lib/database'

export const useTagDetail = (id: string) => {
  const { tags } = useDatabase()

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
  const { sessions } = useDatabase()

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
