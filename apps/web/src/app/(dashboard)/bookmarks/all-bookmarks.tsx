'use client'

import { Bookmarks } from '@/components/bookmarks'
import { useQueryState } from 'nuqs'
import { useListAllBookmarksQuery } from './list-all-bookmarks-query'

type BookmarksProps = {
  searchQuery?: string
}

export const AllBookmarks = ({}: BookmarksProps) => {
  const [searchQuery] = useQueryState('q')

  const result = useListAllBookmarksQuery(searchQuery)

  return <Bookmarks {...result} />
}
