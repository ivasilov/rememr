'use client'

import { Bookmarks } from '@/src/components/bookmarks'
import { useQueryState } from 'nuqs'
import { useListSessionBookmarksQuery } from './list-session-bookmarks-query'

type SessionBookmarksProps = {
  sessionId: string
}

export const SessionBookmarks = ({ sessionId }: SessionBookmarksProps) => {
  const [searchQuery] = useQueryState('q')

  const result = useListSessionBookmarksQuery(searchQuery, sessionId)

  return <Bookmarks {...result} />
}
