import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  cn,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@rememr/ui'
import { useNavigate } from '@tanstack/react-router'
import { useCallback, useEffect, useRef, useState } from 'react'

export const SearchInputInner = ({
  onSearchChange,
  searchQuery,
  tags,
}: {
  onSearchChange: (value: string | undefined) => void
  searchQuery: string | undefined
  tags: { id: string; name: string }[]
}) => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState(searchQuery)
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const appendSearchParam = useCallback(
    (value: string | null) => {
      if (value === searchQuery) {
        return
      }

      if (value && value.length > 0) {
        onSearchChange(value)
      } else {
        onSearchChange(undefined)
      }
    },
    [onSearchChange, searchQuery]
  )

  const filteredTags = tags
    .filter((tag) => tag.name.includes(searchTerm ?? ''))
    .slice(0, 4)

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
          className={cn(
            'transition-width duration-300 ease-in-out',
            open ? 'md:w-full lg:w-2/3' : 'md:w-2/3 lg:w-1/3'
          )}
          shouldFilter={false}
        >
          <CommandInput
            className="shadow-none"
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            onValueChange={setSearchTerm}
            placeholder="Search bookmarks..."
            ref={inputRef}
            value={searchTerm ?? ''}
          />
          <Popover onOpenChange={setOpen} open={open}>
            <PopoverTrigger />
            <PopoverContent
              className="w-[200px] p-0"
              onOpenAutoFocus={(e) => e.preventDefault()}
              sameWidthAsTrigger
            >
              <CommandList>
                {(searchTerm || '').length > 0 && (
                  <CommandGroup heading="Bookmarks">
                    <CommandItem
                      onSelect={() => {
                        appendSearchParam(searchTerm ?? null)
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
                      {filteredTags.map((tag) => (
                        <CommandItem
                          key={tag.id}
                          onSelect={() => {
                            navigate({
                              to: '/tags/$id',
                              params: { id: tag.id },
                            })
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
