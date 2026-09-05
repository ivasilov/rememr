import { eq, useLiveInfiniteQuery } from '@tanstack/react-db'
import { useSearch } from '@tanstack/react-router'
import { useMemo } from 'react'
import { Bookmarks } from '@/components/bookmarks'
import { bookmarkSessions, bookmarks } from '@/lib/database'

const PAGE_SIZE = 20

type SessionBookmarksProps = {
  sessionId: string
}

export const SessionBookmarks = ({ sessionId }: SessionBookmarksProps) => {
  const searchQuery = useSearch({
    strict: false,
    select: (search) => search.q as string | undefined,
  })
  const normalizedSearch = searchQuery?.toLocaleLowerCase() ?? ''
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
    [normalizedSearch, sessionId]
  )

  const filteredBookmarks = useMemo(
    () =>
      normalizedSearch
        ? data.filter((bookmark) =>
            bookmark.name.toLocaleLowerCase().includes(normalizedSearch)
          )
        : data,
    [data, normalizedSearch]
  )

  return (
    <Bookmarks
      bookmarks={filteredBookmarks}
      fetchMore={fetchNextPage}
      hasMore={hasNextPage}
      isError={isError}
      isFetchingMore={isFetchingNextPage}
      isLoading={isLoading}
    />
  )
}
