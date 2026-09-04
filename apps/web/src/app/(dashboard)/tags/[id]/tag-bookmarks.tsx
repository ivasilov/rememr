import { eq, useLiveInfiniteQuery } from '@tanstack/react-db'
import { useSearch } from '@tanstack/react-router'
import { useMemo } from 'react'
import { Bookmarks } from '@/components/bookmarks'
import { bookmarks, bookmarkTags } from '@/lib/database'

const PAGE_SIZE = 20

type TagBookmarksProps = {
  tags: string[]
}

export const TagBookmarks = ({ tags }: TagBookmarksProps) => {
  const searchQuery = useSearch({
    strict: false,
    select: (search) => search.q as string | undefined,
  })
  const normalizedSearch = searchQuery?.toLocaleLowerCase() ?? ''
  const tagId = tags.at(0) ?? ''
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
        .from({ bookmarkTag: bookmarkTags })
        .where(({ bookmarkTag }) => eq(bookmarkTag.tag_id, tagId))
        .innerJoin({ bookmark: bookmarks }, ({ bookmarkTag, bookmark }) =>
          eq(bookmarkTag.bookmark_id, bookmark.id)
        )
        .orderBy(({ bookmark }) => bookmark.created_at, 'desc')
        .orderBy(({ bookmark }) => bookmark.id, 'desc')
        .select(({ bookmark }) => ({ ...bookmark })),
    { pageSize: PAGE_SIZE },
    [normalizedSearch, tagId]
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
