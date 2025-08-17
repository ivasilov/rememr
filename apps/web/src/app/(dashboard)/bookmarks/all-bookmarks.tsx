'use client'

import { useQueryState } from 'nuqs'
import { Bookmarks } from '@/components/bookmarks'
import { useListAllBookmarksQuery } from './list-all-bookmarks-query'

type BookmarksProps = {
  searchQuery?: string
}

export const AllBookmarks = ({}: BookmarksProps) => {
  const [searchQuery] = useQueryState('q')

  const result = useListAllBookmarksQuery(searchQuery)

  return <Bookmarks {...result} />
}
