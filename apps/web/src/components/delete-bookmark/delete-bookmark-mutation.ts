import { useMutation } from '@tanstack/react-query'
import { bookmarkSessions, bookmarks, bookmarkTags } from '@/lib/database'

export const useDeleteBookmarkMutation = () => {
  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const tagRelations = bookmarkTags.toArray.filter(
        (relation) => relation.bookmark_id === id
      )
      const sessionRelations = bookmarkSessions.toArray.filter(
        (relation) => relation.bookmark_id === id
      )
      const relationTransactions: Promise<unknown>[] = []

      if (tagRelations.length > 0) {
        relationTransactions.push(
          bookmarkTags.delete(
            tagRelations.map((relation) =>
              bookmarkTags.getKeyFromItem(relation)
            )
          ).isPersisted.promise
        )
      }
      if (sessionRelations.length > 0) {
        relationTransactions.push(
          bookmarkSessions.delete(
            sessionRelations.map((relation) =>
              bookmarkSessions.getKeyFromItem(relation)
            )
          ).isPersisted.promise
        )
      }

      await Promise.all(relationTransactions)
      await bookmarks.delete(id).isPersisted.promise
    },
  })
}
