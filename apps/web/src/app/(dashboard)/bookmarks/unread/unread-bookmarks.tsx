import { useSearch } from '@tanstack/react-router'
import { Bookmarks } from '@/components/bookmarks'
import {
  useListUnreadBookmarksQuery,
  useSearchUnreadBookmarks,
} from './list-unread-bookmarks-query'

export const UnreadBookmarks = () => {
  const searchQuery = useSearch({
    strict: false,
    select: (search) => search.q as string | undefined,
  })

  if (searchQuery) {
    return <SearchedUnreadBookmarks searchQuery={searchQuery} />
  }

  return <UnreadBookmarksList />
}

const UnreadBookmarksList = () => (
  <Bookmarks {...useListUnreadBookmarksQuery()} />
)

const SearchedUnreadBookmarks = ({ searchQuery }: { searchQuery: string }) => (
  <Bookmarks {...useSearchUnreadBookmarks(searchQuery)} />
)
