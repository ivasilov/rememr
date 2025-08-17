'use client'

import { useQueryState } from 'nuqs'
import { Bookmarks } from '@/components/bookmarks'
import { useListTagBookmarksQuery } from './list-tag-bookmarks-query'

type TagBookmarksProps = {
  tags: string[]
}

export const TagBookmarks = ({ tags }: TagBookmarksProps) => {
  const [searchQuery] = useQueryState('q')

  const result = useListTagBookmarksQuery(searchQuery, tags)

  return <Bookmarks {...result} />
}
