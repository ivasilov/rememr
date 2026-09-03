import { useSearch } from '@tanstack/react-router'
import { Bookmarks } from '@/components/bookmarks'
import { useListSessionBookmarksQuery } from './list-session-bookmarks-query'

type SessionBookmarksProps = {
  sessionId: string
}

export const SessionBookmarks = ({ sessionId }: SessionBookmarksProps) => {
  const searchQuery = useSearch({
    strict: false,
    select: (search) => search.q as string | undefined,
  })

  const result = useListSessionBookmarksQuery(searchQuery ?? null, sessionId)

  return <Bookmarks {...result} />
}
