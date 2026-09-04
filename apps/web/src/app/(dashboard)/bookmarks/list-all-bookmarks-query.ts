import { useLiveInfiniteQuery, useLiveQuery } from '@tanstack/react-db'
import { useCallback, useMemo, useState } from 'react'
import type { BookmarkListResult } from '@/components/bookmarks'
import { bookmarks } from '@/lib/database'

const PAGE_SIZE = 20

export const useListAllBookmarksQuery = (): BookmarkListResult => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isError,
    isFetchingNextPage,
    isLoading,
  } = useLiveInfiniteQuery(
    (query) =>
      query
        .from({ bookmark: bookmarks })
        .orderBy(({ bookmark }) => bookmark.created_at, 'desc')
        .orderBy(({ bookmark }) => bookmark.id, 'desc')
        .select(({ bookmark }) => ({ ...bookmark })),
    { pageSize: PAGE_SIZE }
  )

  return {
    bookmarks: data,
    fetchMore: fetchNextPage,
    hasMore: hasNextPage,
    isError,
    isFetchingMore: isFetchingNextPage,
    isLoading,
  }
}

export const useSearchAllBookmarks = (
  searchQuery: string
): BookmarkListResult => {
  const normalizedSearch = searchQuery.toLocaleLowerCase()
  const [pagination, setPagination] = useState({
    key: normalizedSearch,
    visibleCount: PAGE_SIZE,
  })
  const visibleCount =
    pagination.key === normalizedSearch ? pagination.visibleCount : PAGE_SIZE

  const { data, isError, isLoading } = useLiveQuery(
    (query) =>
      query
        .from({ bookmark: bookmarks })
        .orderBy(({ bookmark }) => bookmark.created_at, 'desc')
        .orderBy(({ bookmark }) => bookmark.id, 'desc')
        .select(({ bookmark }) => ({ ...bookmark })),
    [normalizedSearch]
  )

  const filteredBookmarks = useMemo(
    () =>
      data.filter((bookmark) =>
        bookmark.name.toLocaleLowerCase().includes(normalizedSearch)
      ),
    [data, normalizedSearch]
  )

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
    isFetchingMore: false,
    isLoading,
  }
}
