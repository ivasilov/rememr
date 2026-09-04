import { useSearch } from '@tanstack/react-router'
import { Bookmarks } from '@/components/bookmarks'
import {
  useListTagBookmarksQuery,
  useSearchTagBookmarks,
} from './list-tag-bookmarks-query'

type TagBookmarksProps = {
  tags: string[]
}

export const TagBookmarks = ({ tags }: TagBookmarksProps) => {
  const searchQuery = useSearch({
    strict: false,
    select: (search) => search.q as string | undefined,
  })

  if (searchQuery) {
    return <SearchedTagBookmarks searchQuery={searchQuery} tags={tags} />
  }

  return <TagBookmarksList tags={tags} />
}

const TagBookmarksList = ({ tags }: TagBookmarksProps) => (
  <Bookmarks {...useListTagBookmarksQuery(tags)} />
)

const SearchedTagBookmarks = ({
  searchQuery,
  tags,
}: TagBookmarksProps & { searchQuery: string }) => (
  <Bookmarks {...useSearchTagBookmarks(searchQuery, tags)} />
)
