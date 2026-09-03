import { useSearch } from '@tanstack/react-router'
import { Bookmarks } from '@/components/bookmarks'
import { useListUnreadBookmarksQuery } from './list-unread-bookmarks-query'

export const UnreadBookmarks = () => {
  const searchQuery = useSearch({
    strict: false,
    select: (search) => search.q as string | undefined,
  })

  const result = useListUnreadBookmarksQuery(searchQuery ?? null)

  return <Bookmarks {...result} />
}
