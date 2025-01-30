'use client'

import { Bookmarks } from '@/src/components/bookmarks'
import { useQueryState } from 'nuqs'
import { useListUnreadBookmarksQuery } from './list-unread-bookmarks-query'

type BookmarksProps = {
  searchQuery?: string
}

export const UnreadBookmarks = ({}: BookmarksProps) => {
  const [searchQuery] = useQueryState('q')

  const { isSuccess, isLoading, data, fetchNextPage, isFetchingNextPage } = useListUnreadBookmarksQuery(searchQuery)

  return (
    <Bookmarks
      data={data}
      isSuccess={isSuccess}
      isLoading={isLoading}
      fetchNextPage={fetchNextPage}
      isFetchingNextPage={isFetchingNextPage}
    />
  )
}
