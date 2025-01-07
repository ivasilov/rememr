'use client'

import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  Popover,
  PopoverContent,
  PopoverTrigger,
  cn,
} from '@rememr/ui'
import { useRouter } from 'next/navigation'
import { useQueryState } from 'nuqs'
import { useCallback, useEffect, useRef, useState } from 'react'

export const SearchInputInner = ({ tags }: { tags: { id: string; name: string }[] }) => {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useQueryState('q')
  const [searchTerm, setSearchTerm] = useState(searchQuery)
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const appendSearchParam = useCallback(
    (value: string | null) => {
      if (value === searchQuery) {
        return
      }

      if (value && value.length > 0) {
        setSearchQuery(value, { shallow: false, scroll: false })
      } else {
        setSearchQuery(null, { shallow: false, scroll: false })
      }
    },
    [searchQuery, setSearchQuery],
  )

  const filteredTags = tags.filter(tag => tag.name.includes(searchTerm ?? '')).slice(0, 4)

  // Focus the input when the user presses cmd+k
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  return (
    <div className="w-full flex-1">
      <div className="relative">
        <Command
          shouldFilter={false}
          className={cn(`transition-width duration-300 ease-in-out`, open ? 'md:w-full lg:w-2/3' : `md:w-2/3 lg:w-1/3`)}
        >
          <CommandInput
            placeholder="Search bookmarks..."
            ref={inputRef}
            className="shadow-none"
            onValueChange={setSearchTerm}
            value={searchTerm ?? ''}
            onFocus={() => setOpen(true)}
            onBlur={() => setOpen(false)}
          />
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger></PopoverTrigger>
            <PopoverContent className="w-[200px] p-0" onOpenAutoFocus={e => e.preventDefault()} sameWidthAsTrigger>
              <CommandList>
                {(searchTerm || '').length > 0 && (
                  <CommandGroup heading="Bookmarks">
                    <CommandItem
                      onSelect={() => {
                        appendSearchParam(searchTerm)
                        setSearchTerm('')
                        setOpen(false)
                      }}
                    >
                      Search the bookmarks for &ldquo;{searchTerm}&rdquo;...
                    </CommandItem>
                  </CommandGroup>
                )}
                {filteredTags.length > 0 && (
                  <>
                    <CommandSeparator />
                    <CommandGroup heading="Tags">
                      {filteredTags.map(tag => (
                        <CommandItem
                          key={tag.id}
                          onSelect={() => {
                            router.push(`/tags/${tag.id}`)
                            setSearchTerm('')
                            setOpen(false)
                          }}
                        >
                          {tag.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </>
                )}
              </CommandList>
            </PopoverContent>
          </Popover>
        </Command>
      </div>
    </div>
  )
}
