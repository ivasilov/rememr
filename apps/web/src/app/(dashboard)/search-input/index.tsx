import type { User } from '@supabase/supabase-js'
import { useSidebarTags } from '@/components/app-sidebar/queries'
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
  const { data: tags } = useSidebarTags(user.id)

  return (
    <div className="w-full flex-1">
      <div className="relative">
        <SearchInputInner
          onSearchChange={onSearchChange}
          searchQuery={searchQuery}
          tags={tags}
        />
      </div>
    </div>
  )
}
