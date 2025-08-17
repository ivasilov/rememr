'use client'

import { useQueryState } from 'nuqs'
import { Bookmarks } from '@/components/bookmarks'
import { useListUnreadBookmarksQuery } from './list-unread-bookmarks-query'

type BookmarksProps = {
  searchQuery?: string
}

export const UnreadBookmarks = ({}: BookmarksProps) => {
  const [searchQuery] = useQueryState('q')

  const result = useListUnreadBookmarksQuery(searchQuery)

  return <Bookmarks {...result} />
}
