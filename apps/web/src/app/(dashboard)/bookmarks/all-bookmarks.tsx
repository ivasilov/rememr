'use client'

import { Bookmarks } from '@/src/components/bookmarks'
import { useQueryState } from 'nuqs'
import { useListAllBookmarksQuery } from './list-all-bookmarks-query'

type BookmarksProps = {
  searchQuery?: string
}

export const AllBookmarks = ({}: BookmarksProps) => {
  const [searchQuery] = useQueryState('q')

  const { isSuccess, isLoading, data, fetchNextPage, isFetchingNextPage } = useListAllBookmarksQuery(searchQuery)

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
