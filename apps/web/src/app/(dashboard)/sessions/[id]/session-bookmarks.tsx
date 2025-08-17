'use client'

import { useQueryState } from 'nuqs'
import { Bookmarks } from '@/components/bookmarks'
import { useListSessionBookmarksQuery } from './list-session-bookmarks-query'

type SessionBookmarksProps = {
  sessionId: string
}

export const SessionBookmarks = ({ sessionId }: SessionBookmarksProps) => {
  const [searchQuery] = useQueryState('q')

  const result = useListSessionBookmarksQuery(searchQuery, sessionId)

  return <Bookmarks {...result} />
}
