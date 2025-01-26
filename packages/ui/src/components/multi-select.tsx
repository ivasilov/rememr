'use client'

import { Command as CommandPrimitive, useCommandState } from 'cmdk'
import { X } from 'lucide-react'
import * as React from 'react'

import { cn } from '../utils'
import { Badge } from './badge'
import { Command, CommandGroup, CommandItem, CommandList } from './command'

// This component is copied from https://shadcnui-expansions.typeart.cc/docs/multiple-selector.

interface Option {
  value: string
  label: string
  disable?: boolean
  /** fixed option that can't be removed. */
  fixed?: boolean
  /** Group the options by providing key. */
  [key: string]: string | boolean | undefined
}

interface GroupedOptions {
  [key: string]: Option[]
}

interface MultipleSelectorProps {
  value?: Option[]
  defaultOptions?: Option[]
  /** manually controlled options */
  options?: Option[]
  placeholder?: string
  /** Loading component. */
  loadingIndicator?: React.ReactNode
  /** Empty component. */
  emptyIndicator?: React.ReactNode
  /** Debounce time for async search. Only work with `onSearch`. */
  delay?: number
  /**
   * Only work with `onSearch` prop. Trigger search when `onFocus`.
   * For example, when user click on the input, it will trigger the search to get initial options.
   **/
  triggerSearchOnFocus?: boolean
  /** async search */
  onSearch?: (value: string) => Promise<Option[]>
  /**
   * sync search. This search will not showing loadingIndicator.
   * The rest props are the same as async search.
   * i.e.: creatable, groupBy, delay.
   **/
  onSearchSync?: (value: string) => Option[]
  onChange?: (options: Option[]) => void
  /** Limit the maximum number of selected options. */
  maxSelected?: number
  /** When the number of selected options exceeds the limit, the onMaxSelected will be called. */
  onMaxSelected?: (maxLimit: number) => void
  /** Hide the placeholder when there are options selected. */
  hidePlaceholderWhenSelected?: boolean
  disabled?: boolean
  /** Group the options base on provided key. */
  groupBy?: string
  className?: string
  badgeClassName?: string
  /**
   * First item selected is a default behavior by cmdk. That is why the default is true.
   * This is a workaround solution by add a dummy item.
   *
   * @reference: https://github.com/pacocoursey/cmdk/issues/171
   */
  selectFirstItem?: boolean
  /** Allow user to create option when there is no option matched. */
  creatable?: boolean
  /** Props of `Command` */
  commandProps?: React.ComponentPropsWithoutRef<typeof Command>
  /** Props of `CommandInput` */
  inputProps?: Omit<React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>, 'value' | 'placeholder' | 'disabled'>
  /** hide the clear all button. */
  hideClearAllButton?: boolean
}

interface MultipleSelectorRef {
  selectedValue: Option[]
  input: HTMLInputElement
  focus: () => void
  reset: () => void
}

function useDebounce<T>(value: T, delay?: number, shouldDebounce: (t: T) => boolean = () => true): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value)

  React.useEffect(() => {
    let timer: ReturnType<typeof setTimeout>
    if (shouldDebounce(value)) {
      timer = setTimeout(() => setDebouncedValue(value), delay || 500)
    } else {
      setDebouncedValue(value)
    }

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}

function transToGroupOption(options: Option[], groupBy?: string) {
  if (options.length === 0) {
    return {}
  }
  if (!groupBy) {
    return {
      '': options,
    }
  }

  const groupOption: GroupedOptions = {}
  options.forEach(option => {
    const key = (option[groupBy] as string) || ''
    if (!groupOption[key]) {
      groupOption[key] = []
    }
    groupOption[key].push(option)
  })
  return groupOption
}

function removePickedOption(groupOption: GroupedOptions, picked: Option[]) {
  const cloneOption = JSON.parse(JSON.stringify(groupOption)) as GroupedOptions

  for (const [key, value] of Object.entries(cloneOption)) {
    cloneOption[key] = value.filter(val => !picked.find(p => p.value === val.value))
  }
  return cloneOption
}

function isOptionsExist(groupOption: GroupedOptions, targetOption: Option[]) {
  for (const [, value] of Object.entries(groupOption)) {
    if (value.some(option => targetOption.find(p => p.value === option.value))) {
      return true
    }
  }
  return false
}

/**
 * The `CommandEmpty` of shadcn/ui will cause the cmdk empty not rendering correctly.
 * So we create one and copy the `Empty` implementation from `cmdk`.
 *
 * @reference: https://github.com/hsuanyi-chou/shadcn-ui-expansions/issues/34#issuecomment-1949561607
 **/
const CommandEmpty = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof CommandPrimitive.Empty>>(
  ({ className, ...props }, forwardedRef) => {
    const render = useCommandState(state => state.filtered.count === 0)

    if (!render) return null

    return (
      <div
        ref={forwardedRef}
        className={cn('py-6 text-center text-sm', className)}
        cmdk-empty=""
        role="presentation"
        {...props}
      />
    )
  },
)

CommandEmpty.displayName = 'CommandEmpty'

const EmptyItem = ({
  emptyIndicator,
  onSearch,
  creatable,
  options,
}: {
  emptyIndicator: React.ReactNode
  onSearch?: (value: string) => Promise<Option[]>
  creatable?: boolean
  options: GroupedOptions
}) => {
  if (!emptyIndicator) return undefined

  // For async search that showing emptyIndicator
  if (onSearch && !creatable && Object.keys(options).length === 0) {
    return (
      <CommandItem value="-" disabled>
        {emptyIndicator}
      </CommandItem>
    )
  }

  return <CommandEmpty>{emptyIndicator}</CommandEmpty>
}

interface CreatableItemProps {
  creatable: boolean
  options: GroupedOptions
  inputValue: string
  selected: Option[]
  maxSelected: number
  onMaxSelected?: (length: number) => void
  setInputValue: (value: string) => void
  onChange?: (options: Option[]) => void
  onSearch?: (value: string) => Promise<Option[]>
  debouncedSearchTerm: string
  isLoading: boolean
}

const CreatableItem = ({
  creatable,
  options,
  inputValue,
  selected,
  maxSelected,
  onMaxSelected,
  setInputValue,
  onChange,
  onSearch,
  debouncedSearchTerm,
  isLoading,
}: CreatableItemProps) => {
  if (!creatable) return undefined
  if (
    isOptionsExist(options, [{ value: inputValue, label: inputValue }]) ||
    selected.find(s => s.value === inputValue)
  ) {
    return undefined
  }

  if (
    // For normal creatable
    (!onSearch && inputValue.length > 0) ||
    // For async search creatable. avoid showing creatable item before loading at first.
    (onSearch && debouncedSearchTerm.length > 0 && !isLoading)
  ) {
    return (
      <CommandItem
        value={inputValue}
        className="cursor-pointer"
        onMouseDown={e => {
          e.preventDefault()
          e.stopPropagation()
        }}
        onSelect={value => {
          if (selected.length >= maxSelected) {
            onMaxSelected?.(selected.length)
            return
          }
          setInputValue('')
          const newOptions = [...selected, { value, label: value }]
          onChange?.(newOptions)
        }}
      >
        {`Create "${inputValue}"`}
      </CommandItem>
    )
  }

  return undefined
}

const MultipleSelector = React.forwardRef<MultipleSelectorRef, MultipleSelectorProps>(
  (
    {
      value: selected = [],
      onChange,
      placeholder,
      defaultOptions: arrayDefaultOptions = [],
      options: arrayOptions,
      delay,
      onSearch,
      onSearchSync,
      loadingIndicator,
      emptyIndicator,
      maxSelected = Number.MAX_SAFE_INTEGER,
      onMaxSelected,
      hidePlaceholderWhenSelected,
      disabled,
      groupBy,
      className,
      badgeClassName,
      selectFirstItem = true,
      creatable = false,
      triggerSearchOnFocus = false,
      commandProps,
      inputProps,
      hideClearAllButton = false,
    }: MultipleSelectorProps,
    ref: React.Ref<MultipleSelectorRef>,
  ) => {
    const inputRef = React.useRef<HTMLInputElement>(null)
    const [open, setOpen] = React.useState(false)
    const [onScrollbar, setOnScrollbar] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(false)
    const dropdownRef = React.useRef<HTMLDivElement>(null)
    const [options, setOptions] = React.useState<GroupedOptions>(transToGroupOption(arrayDefaultOptions, groupBy))
    const [inputValue, setInputValue] = React.useState('')
    const debouncedSearchTerm = useDebounce(inputValue, delay || 500, value => value.length > 0)

    React.useImperativeHandle(
      ref,
      () => ({
        selectedValue: [...selected],
        input: inputRef.current as HTMLInputElement,
        focus: () => inputRef?.current?.focus(),
        reset: () => onChange?.([]),
      }),
      [onChange, selected],
    )

    const handleClickOutside = React.useCallback(
      (event: MouseEvent | TouchEvent) => {
        if (!dropdownRef.current?.contains(event.target as Node) && !inputRef.current?.contains(event.target as Node)) {
          setOpen(false)
          inputRef.current?.blur()
        }
      },
      [dropdownRef, inputRef],
    )

    const handleUnselect = React.useCallback(
      (option: Option) => {
        const newOptions = selected.filter(s => s.value !== option.value)
        onChange?.(newOptions)
      },
      [onChange, selected],
    )

    const handleKeyDown = React.useCallback(
      (e: React.KeyboardEvent<HTMLDivElement>) => {
        const input = inputRef.current
        if (input) {
          if (e.key === 'Delete' || e.key === 'Backspace') {
            if (input.value === '' && selected.length > 0) {
              const lastSelectOption = selected[selected.length - 1]
              // If last item is fixed, we should not remove it.
              if (!lastSelectOption.fixed) {
                handleUnselect(selected[selected.length - 1])
              }
            }
          }
          // This is not a default behavior of the <input /> field
          if (e.key === 'Escape') {
            input.blur()
          }
        }
      },
      [handleUnselect, selected],
    )

    React.useEffect(() => {
      if (open) {
        document.addEventListener('mousedown', handleClickOutside)
        document.addEventListener('touchend', handleClickOutside)
      } else {
        document.removeEventListener('mousedown', handleClickOutside)
        document.removeEventListener('touchend', handleClickOutside)
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
        document.removeEventListener('touchend', handleClickOutside)
      }
    }, [open, handleClickOutside])

    React.useEffect(() => {
      /** If `onSearch` is provided, do not trigger options updated. */
      if (!arrayOptions || onSearch) {
        return
      }
      const newOption = transToGroupOption(arrayOptions || [], groupBy)
      if (JSON.stringify(newOption) !== JSON.stringify(options)) {
        setOptions(newOption)
      }
    }, [arrayDefaultOptions, arrayOptions, groupBy, onSearch, options])

    React.useEffect(() => {
      /** sync search */
      if (!onSearchSync || !open) return

      if (triggerSearchOnFocus || debouncedSearchTerm) {
        const res = onSearchSync?.(debouncedSearchTerm)
        setOptions(transToGroupOption(res || [], groupBy))
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearchTerm, groupBy, open, triggerSearchOnFocus])

    React.useEffect(() => {
      /** async search */
      const exec = async () => {
        if (!onSearch || !open) return

        if (triggerSearchOnFocus || debouncedSearchTerm) {
          setIsLoading(true)
          const res = await onSearch?.(debouncedSearchTerm)
          setOptions(transToGroupOption(res || [], groupBy))
          setIsLoading(false)
        }
      }

      void exec()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearchTerm, groupBy, open, triggerSearchOnFocus])

    const selectables = React.useMemo<GroupedOptions>(() => removePickedOption(options, selected), [options, selected])

    /** Avoid Creatable Selector freezing or lagging when paste a long string. */
    const commandFilter = React.useCallback(() => {
      if (commandProps?.filter) {
        return commandProps.filter
      }

      if (creatable) {
        return (value: string, search: string) => {
          return value.toLowerCase().includes(search.toLowerCase()) ? 1 : -1
        }
      }
      // Using default filter in `cmdk`. We don't have to provide it.
      return undefined
    }, [creatable, commandProps?.filter])

    return (
      <Command
        ref={dropdownRef}
        {...commandProps}
        onKeyDown={e => {
          handleKeyDown(e)
          commandProps?.onKeyDown?.(e)
        }}
        className={cn('h-auto overflow-visible bg-transparent', commandProps?.className)}
        shouldFilter={commandProps?.shouldFilter !== undefined ? commandProps.shouldFilter : !onSearch} // When onSearch is provided, we don't want to filter the options. You can still override it.
        filter={commandFilter()}
      >
        <div
          className={cn(
            'min-h-10 border-input ring-offset-background focus-within:ring-ring rounded-md border text-base focus-within:ring-2 focus-within:ring-offset-2 md:text-sm',
            {
              'px-3 py-2': selected.length !== 0,
              'cursor-text': !disabled && selected.length !== 0,
            },
            className,
          )}
          onClick={() => {
            if (disabled) return
            inputRef?.current?.focus()
          }}
        >
          <div className="relative flex flex-wrap gap-1">
            {selected.map(option => {
              return (
                <Badge
                  key={option.value}
                  className={cn(
                    'data-[disabled]:bg-muted-foreground data-[disabled]:text-muted data-[disabled]:hover:bg-muted-foreground',
                    'data-[fixed]:bg-muted-foreground data-[fixed]:text-muted data-[fixed]:hover:bg-muted-foreground',
                    badgeClassName,
                  )}
                  data-fixed={option.fixed}
                  data-disabled={disabled || undefined}
                >
                  {option.label}
                  <button
                    className={cn(
                      'ring-offset-background focus:ring-ring ml-1 rounded-full outline-none focus:ring-2 focus:ring-offset-2',
                      (disabled || option.fixed) && 'hidden',
                    )}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        handleUnselect(option)
                      }
                    }}
                    onMouseDown={e => {
                      e.preventDefault()
                      e.stopPropagation()
                    }}
                    onClick={() => handleUnselect(option)}
                  >
                    <X className="text-muted-foreground hover:text-foreground h-3 w-3" />
                  </button>
                </Badge>
              )
            })}
            {/* Avoid having the "Search" Icon */}
            <CommandPrimitive.Input
              {...inputProps}
              ref={inputRef}
              value={inputValue}
              disabled={disabled}
              onValueChange={value => {
                setInputValue(value)
                inputProps?.onValueChange?.(value)
              }}
              onBlur={event => {
                if (!onScrollbar) {
                  setOpen(false)
                }
                inputProps?.onBlur?.(event)
              }}
              onFocus={event => {
                setOpen(true)
                triggerSearchOnFocus && onSearch?.(debouncedSearchTerm)
                inputProps?.onFocus?.(event)
              }}
              placeholder={hidePlaceholderWhenSelected && selected.length !== 0 ? '' : placeholder}
              className={cn(
                'placeholder:text-muted-foreground flex-1 bg-transparent outline-none',
                {
                  'w-full': hidePlaceholderWhenSelected,
                  'px-3 py-2': selected.length === 0,
                  'ml-1': selected.length !== 0,
                },
                inputProps?.className,
              )}
            />
            <button
              type="button"
              onClick={() => onChange?.(selected.filter(s => s.fixed))}
              className={cn(
                'absolute right-0 h-6 w-6 p-0',
                (hideClearAllButton ||
                  disabled ||
                  selected.length < 1 ||
                  selected.filter(s => s.fixed).length === selected.length) &&
                  'hidden',
              )}
            >
              <X />
            </button>
          </div>
        </div>
        <div className="relative">
          {open && (
            <CommandList
              className="bg-popover text-popover-foreground animate-in absolute top-1 z-10 w-full rounded-md border shadow-md outline-none"
              onMouseLeave={() => setOnScrollbar(false)}
              onMouseEnter={() => setOnScrollbar(true)}
              onMouseUp={() => inputRef?.current?.focus()}
            >
              {isLoading ? (
                <>{loadingIndicator}</>
              ) : (
                <>
                  <CommandGroup>
                    <EmptyItem
                      emptyIndicator={emptyIndicator}
                      onSearch={onSearch}
                      creatable={creatable}
                      options={options}
                    />
                    <CreatableItem
                      creatable={creatable}
                      options={options}
                      inputValue={inputValue}
                      selected={selected}
                      maxSelected={maxSelected}
                      onMaxSelected={onMaxSelected}
                      setInputValue={setInputValue}
                      onChange={onChange}
                      onSearch={onSearch}
                      debouncedSearchTerm={debouncedSearchTerm}
                      isLoading={isLoading}
                    />
                    {!selectFirstItem && <CommandItem value="-" className="hidden" />}
                  </CommandGroup>
                  {Object.entries(selectables).map(([key, dropdowns]) => (
                    <CommandGroup key={key} heading={key} className="h-full overflow-auto">
                      <>
                        {dropdowns.map(option => {
                          return (
                            <CommandItem
                              key={option.value}
                              value={option.label}
                              disabled={option.disable}
                              onMouseDown={e => {
                                e.preventDefault()
                                e.stopPropagation()
                              }}
                              onSelect={() => {
                                if (selected.length >= maxSelected) {
                                  onMaxSelected?.(selected.length)
                                  return
                                }
                                setInputValue('')
                                const newOptions = [...selected, option]
                                onChange?.(newOptions)
                              }}
                              className={cn('cursor-pointer', option.disable && 'text-muted-foreground cursor-default')}
                            >
                              {option.label}
                            </CommandItem>
                          )
                        })}
                      </>
                    </CommandGroup>
                  ))}
                </>
              )}
            </CommandList>
          )}
        </div>
      </Command>
    )
  },
)

MultipleSelector.displayName = 'MultipleSelector'
export { MultipleSelector, type Option }
