import { useSearch } from '@tanstack/react-router'
import { Bookmarks } from '@/components/bookmarks'
import { useListTagBookmarksQuery } from './list-tag-bookmarks-query'

type TagBookmarksProps = {
  tags: string[]
}

export const TagBookmarks = ({ tags }: TagBookmarksProps) => {
  const searchQuery = useSearch({
    strict: false,
    select: (search) => search.q as string | undefined,
  })

  const result = useListTagBookmarksQuery(searchQuery ?? null, tags)

  return <Bookmarks {...result} />
}
