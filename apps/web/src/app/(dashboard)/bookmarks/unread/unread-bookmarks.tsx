'use client'

import { useQueryState } from 'nuqs'
import { Bookmarks } from '@/components/bookmarks'
import { useListUnreadBookmarksQuery } from './list-unread-bookmarks-query'

export const UnreadBookmarks = () => {
  const [searchQuery] = useQueryState('q')

  const result = useListUnreadBookmarksQuery(searchQuery)

  return <Bookmarks {...result} />
}
