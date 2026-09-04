import { useSearch } from '@tanstack/react-router'
import { Bookmarks } from '@/components/bookmarks'
import {
  useListAllBookmarksQuery,
  useSearchAllBookmarks,
} from './list-all-bookmarks-query'

export const AllBookmarks = () => {
  const searchQuery = useSearch({
    strict: false,
    select: (search) => search.q as string | undefined,
  })

  if (searchQuery) {
    return <SearchedAllBookmarks searchQuery={searchQuery} />
  }

  return <AllBookmarksList />
}

const AllBookmarksList = () => <Bookmarks {...useListAllBookmarksQuery()} />

const SearchedAllBookmarks = ({ searchQuery }: { searchQuery: string }) => (
  <Bookmarks {...useSearchAllBookmarks(searchQuery)} />
)
