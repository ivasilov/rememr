import type { User } from '@supabase/supabase-js'
import { eq, useLiveQuery } from '@tanstack/react-db'
import { tags as tagCollection } from '@/lib/database'
import { SearchInputInner } from './inner'

export const SearchInput = ({
  onSearchChange,
  searchQuery,
  user,
}: {
  onSearchChange: (value: string | undefined) => void
  searchQuery: string | undefined
  user: User
}) => {
  const { data: tags } = useLiveQuery((query) =>
    query
      .from({ tag: tagCollection })
      .where(({ tag }) => eq(tag.user_id, user.id))
      .orderBy(({ tag }) => tag.name)
  )

  return (
    <div className="w-full flex-1">
      <div className="relative">
        <SearchInputInner
          onSearchChange={onSearchChange}
          searchQuery={searchQuery}
          tags={tags ?? []}
        />
      </div>
    </div>
  )
}
