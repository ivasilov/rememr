import { eq, useLiveQuery } from '@tanstack/react-db'
import { useCallback, useMemo, useState } from 'react'
import type { BookmarkListResult } from '@/components/bookmarks'
import { bookmarks, bookmarkTags } from '@/lib/database'

const PAGE_SIZE = 20

export const useListTagBookmarksQuery = (
  searchQuery: string | null,
  tags: string[]
): BookmarkListResult => {
  const normalizedSearch = searchQuery?.toLocaleLowerCase() ?? ''
  const tagId = tags.at(0) ?? ''
  const paginationKey = `${tagId}:${normalizedSearch}`
  const [pagination, setPagination] = useState({
    key: paginationKey,
    visibleCount: PAGE_SIZE,
  })
  const visibleCount =
    pagination.key === paginationKey ? pagination.visibleCount : PAGE_SIZE

  const { data, isError, isLoading } = useLiveQuery(
    (query) => {
      const orderedQuery = query
        .from({ bookmarkTag: bookmarkTags })
        .where(({ bookmarkTag }) => eq(bookmarkTag.tag_id, tagId))
        .innerJoin({ bookmark: bookmarks }, ({ bookmarkTag, bookmark }) =>
          eq(bookmarkTag.bookmark_id, bookmark.id)
        )
        .orderBy(({ bookmark }) => bookmark.created_at, 'desc')
        .orderBy(({ bookmark }) => bookmark.id, 'desc')
        .select(({ bookmark }) => ({ ...bookmark }))

      return normalizedSearch
        ? orderedQuery
        : orderedQuery.limit(visibleCount + 1)
    },
    [normalizedSearch, tagId, visibleCount]
  )

  const filteredBookmarks = useMemo(() => {
    if (!normalizedSearch) {
      return data
    }

    return data.filter((bookmark) =>
      bookmark.name.toLocaleLowerCase().includes(normalizedSearch)
    )
  }, [data, normalizedSearch])

  const fetchMore = useCallback(
    () =>
      setPagination((current) => ({
        key: paginationKey,
        visibleCount:
          (current.key === paginationKey ? current.visibleCount : PAGE_SIZE) +
          PAGE_SIZE,
      })),
    [paginationKey]
  )

  return {
    bookmarks: filteredBookmarks.slice(0, visibleCount),
    fetchMore,
    hasMore: filteredBookmarks.length > visibleCount,
    isError,
    isFetchingMore: isLoading && visibleCount > PAGE_SIZE,
    isLoading,
  }
}
