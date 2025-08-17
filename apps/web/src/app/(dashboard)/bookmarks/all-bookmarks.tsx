'use client'

import { useQueryState } from 'nuqs'
import { Bookmarks } from '@/components/bookmarks'
import { useListAllBookmarksQuery } from './list-all-bookmarks-query'

export const AllBookmarks = () => {
  const [searchQuery] = useQueryState('q')

  const result = useListAllBookmarksQuery(searchQuery)

  return <Bookmarks {...result} />
}
