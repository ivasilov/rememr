import { eq, materialize, useLiveInfiniteQuery } from '@tanstack/react-db'
import { useSearch } from '@tanstack/react-router'
import { useMemo } from 'react'
import { Bookmarks } from '@/components/bookmarks'
import { bookmarks, bookmarkTags, tags } from '@/lib/database'

const PAGE_SIZE = 20

export const UnreadBookmarks = () => {
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
        .from({ bookmark: bookmarks })
        .where(({ bookmark }) => eq(bookmark.read, false))
        .orderBy(({ bookmark }) => bookmark.created_at, 'desc')
        .orderBy(({ bookmark }) => bookmark.id, 'desc')
        .select(({ bookmark }) => ({
          ...bookmark,
          tags: materialize(
            query
              .from({ bookmarkTag: bookmarkTags })
              .where(({ bookmarkTag }) =>
                eq(bookmarkTag.bookmark_id, bookmark.id)
              )
              .innerJoin({ tag: tags }, ({ bookmarkTag, tag }) =>
                eq(bookmarkTag.tag_id, tag.id)
              )
              .select(({ tag }) => ({ id: tag.id, name: tag.name }))
          ),
        })),
    { pageSize: PAGE_SIZE },
    [normalizedSearch]
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
