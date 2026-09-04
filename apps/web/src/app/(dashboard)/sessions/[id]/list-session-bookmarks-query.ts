import { eq, useLiveInfiniteQuery, useLiveQuery } from '@tanstack/react-db'
import { useCallback, useMemo, useState } from 'react'
import type { BookmarkListResult } from '@/components/bookmarks'
import { bookmarkSessions, bookmarks } from '@/lib/database'

const PAGE_SIZE = 20

export const useListSessionBookmarksQuery = (
  sessionId: string
): BookmarkListResult => {
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
        .from({ bookmarkSession: bookmarkSessions })
        .where(({ bookmarkSession }) =>
          eq(bookmarkSession.session_id, sessionId)
        )
        .innerJoin({ bookmark: bookmarks }, ({ bookmarkSession, bookmark }) =>
          eq(bookmarkSession.bookmark_id, bookmark.id)
        )
        .orderBy(({ bookmark }) => bookmark.created_at, 'desc')
        .orderBy(({ bookmark }) => bookmark.id, 'desc')
        .select(({ bookmark }) => ({ ...bookmark })),
    { pageSize: PAGE_SIZE },
    [sessionId]
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

export const useSearchSessionBookmarks = (
  searchQuery: string,
  sessionId: string
): BookmarkListResult => {
  const normalizedSearch = searchQuery.toLocaleLowerCase()
  const paginationKey = `${sessionId}:${normalizedSearch}`
  const [pagination, setPagination] = useState({
    key: paginationKey,
    visibleCount: PAGE_SIZE,
  })
  const visibleCount =
    pagination.key === paginationKey ? pagination.visibleCount : PAGE_SIZE

  const { data, isError, isLoading } = useLiveQuery(
    (query) =>
      query
        .from({ bookmarkSession: bookmarkSessions })
        .where(({ bookmarkSession }) =>
          eq(bookmarkSession.session_id, sessionId)
        )
        .innerJoin({ bookmark: bookmarks }, ({ bookmarkSession, bookmark }) =>
          eq(bookmarkSession.bookmark_id, bookmark.id)
        )
        .orderBy(({ bookmark }) => bookmark.created_at, 'desc')
        .orderBy(({ bookmark }) => bookmark.id, 'desc')
        .select(({ bookmark }) => ({ ...bookmark })),
    [normalizedSearch, sessionId]
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
    isFetchingMore: false,
    isLoading,
  }
}
