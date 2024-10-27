'use client'

import { useDebounce } from '@/src/lib/useDebounce'
import { Input } from '@rememr/ui'
import { Search } from 'lucide-react'
import { useQueryState } from 'nuqs'
import { ChangeEventHandler, useCallback, useEffect, useState } from 'react'

export default function SearchInput() {
  const [searchQuery, setSearchQuery] = useQueryState('q')
  const [state, setState] = useState(searchQuery)

  const appendSearchParam = useCallback(
    (value: string | null) => {
      if (value && value.length > 0) {
        setSearchQuery(value, { shallow: false, scroll: false })
      } else {
        setSearchQuery(null, { shallow: false, scroll: false })
      }
    },
    [setSearchQuery],
  )

  const onChangeSearch: ChangeEventHandler<HTMLInputElement> = e => {
    const value = e.target.value
    setState(value)
  }

  const debouncedSearchTerm = useDebounce(state, 500) // Delay of 500ms

  useEffect(() => {
    appendSearchParam(debouncedSearchTerm)
  }, [appendSearchParam, debouncedSearchTerm])

  return (
    <div className="w-full flex-1">
      <div className="relative">
        <Search className="text-muted-foreground absolute left-2.5 top-2.5 h-4 w-4" />
        <Input
          type="search"
          placeholder="Search bookmarks..."
          className="bg-background transition-width w-full appearance-none rounded-full py-4 pl-8 shadow-none duration-300 ease-in-out focus:w-full md:w-2/3 lg:w-1/3"
          onChange={onChangeSearch}
          value={state ?? ''}
        />
      </div>
    </div>
  )
}
