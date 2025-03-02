'use client'

import { Bookmarks } from '@/src/components/bookmarks'
import { useQueryState } from 'nuqs'
import { useListWatchlistBookmarksQuery } from './list-watchlist-bookmarks-query'

export function WatchlistBookmarks() {
  const [searchQuery] = useQueryState('q')
  const query = useListWatchlistBookmarksQuery(searchQuery)

  return <Bookmarks {...query} />
}
