import { eq, inArray, useLiveQuery } from '@tanstack/react-db'
import { useMemo } from 'react'
import { bookmarkTags, tags } from '@/lib/database'

export const useBookmarkTags = (bookmarkIds: string[]) => {
  const idsKey = bookmarkIds.join(',')
  const { data = [], isLoading } = useLiveQuery(
    (query) => {
      if (bookmarkIds.length === 0) {
        return
      }

      return query
        .from({ bookmarkTag: bookmarkTags })
        .where(({ bookmarkTag }) =>
          inArray(bookmarkTag.bookmark_id, bookmarkIds)
        )
        .innerJoin({ tag: tags }, ({ bookmarkTag, tag }) =>
          eq(bookmarkTag.tag_id, tag.id)
        )
        .select(({ bookmarkTag, tag }) => ({
          bookmarkId: bookmarkTag.bookmark_id,
          id: tag.id,
          name: tag.name,
        }))
    },
    [idsKey]
  )

  const tagsByBookmarkId = useMemo(() => {
    const grouped = new Map<string, { id: string; name: string }[]>()

    for (const tag of data) {
      const bookmarkTagsForId = grouped.get(tag.bookmarkId) ?? []
      bookmarkTagsForId.push({ id: tag.id, name: tag.name })
      grouped.set(tag.bookmarkId, bookmarkTagsForId)
    }

    return grouped
  }, [data])

  return { isLoading, tagsByBookmarkId }
}
