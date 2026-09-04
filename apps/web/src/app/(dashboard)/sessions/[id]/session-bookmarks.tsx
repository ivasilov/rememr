import { useSearch } from '@tanstack/react-router'
import { Bookmarks } from '@/components/bookmarks'
import {
  useListSessionBookmarksQuery,
  useSearchSessionBookmarks,
} from './list-session-bookmarks-query'

type SessionBookmarksProps = {
  sessionId: string
}

export const SessionBookmarks = ({ sessionId }: SessionBookmarksProps) => {
  const searchQuery = useSearch({
    strict: false,
    select: (search) => search.q as string | undefined,
  })

  if (searchQuery) {
    return (
      <SearchedSessionBookmarks
        searchQuery={searchQuery}
        sessionId={sessionId}
      />
    )
  }

  return <SessionBookmarksList sessionId={sessionId} />
}

const SessionBookmarksList = ({ sessionId }: SessionBookmarksProps) => (
  <Bookmarks {...useListSessionBookmarksQuery(sessionId)} />
)

const SearchedSessionBookmarks = ({
  searchQuery,
  sessionId,
}: SessionBookmarksProps & { searchQuery: string }) => (
  <Bookmarks {...useSearchSessionBookmarks(searchQuery, sessionId)} />
)
