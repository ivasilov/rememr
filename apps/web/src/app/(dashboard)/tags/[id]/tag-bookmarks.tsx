'use client'

import { Bookmarks } from '@/src/components/bookmarks'
import { useQueryState } from 'nuqs'
import { useListTagBookmarksQuery } from './list-tag-bookmarks-query'

type TagBookmarksProps = {
  tags: string[]
}

export const TagBookmarks = ({ tags }: TagBookmarksProps) => {
  const [searchQuery] = useQueryState('q')

  const { isSuccess, isLoading, data, fetchNextPage, isFetchingNextPage } = useListTagBookmarksQuery(searchQuery, tags)

  return (
    <Bookmarks
      isSuccess={isSuccess}
      isLoading={isLoading}
      data={data}
      fetchNextPage={fetchNextPage}
      isFetchingNextPage={isFetchingNextPage}
    />
  )
}
