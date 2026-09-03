import { useSearch } from '@tanstack/react-router'
import { Bookmarks } from '@/components/bookmarks'
import { useListAllBookmarksQuery } from './list-all-bookmarks-query'

export const AllBookmarks = () => {
  const searchQuery = useSearch({
    strict: false,
    select: (search) => search.q as string | undefined,
  })

  const result = useListAllBookmarksQuery(searchQuery ?? null)

  return <Bookmarks {...result} />
}
