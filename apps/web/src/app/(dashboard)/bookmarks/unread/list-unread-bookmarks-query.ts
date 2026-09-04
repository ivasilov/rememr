import { eq, useLiveQuery } from '@tanstack/react-db'
import { useCallback, useMemo, useState } from 'react'
import type { BookmarkListResult } from '@/lib/database'
import { useDatabase } from '@/lib/database'

const PAGE_SIZE = 20

export const useListUnreadBookmarksQuery = (
  searchQuery: string | null
): BookmarkListResult => {
  const { bookmarks } = useDatabase()
  const normalizedSearch = searchQuery?.toLocaleLowerCase() ?? ''
  const [pagination, setPagination] = useState({
    key: normalizedSearch,
    visibleCount: PAGE_SIZE,
  })
  const visibleCount =
    pagination.key === normalizedSearch ? pagination.visibleCount : PAGE_SIZE

  const { data, isError, isLoading } = useLiveQuery(
    (query) => {
      const orderedQuery = query
        .from({ bookmark: bookmarks })
        .where(({ bookmark }) => eq(bookmark.read, false))
        .orderBy(({ bookmark }) => bookmark.created_at, 'desc')
        .orderBy(({ bookmark }) => bookmark.id, 'desc')
        .select(({ bookmark }) => ({ ...bookmark }))

      return normalizedSearch
        ? orderedQuery
        : orderedQuery.limit(visibleCount + 1)
    },
    [normalizedSearch, visibleCount]
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
        key: normalizedSearch,
        visibleCount:
          (current.key === normalizedSearch
            ? current.visibleCount
            : PAGE_SIZE) + PAGE_SIZE,
      })),
    [normalizedSearch]
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
