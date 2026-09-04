import { MultipleSelector, type Option } from '@rememr/ui'
import { useLiveQuery } from '@tanstack/react-db'
import { useCallback, useMemo } from 'react'
import { useDatabase } from '@/lib/database'
import { Loading } from '../loading'

export type IdName = { id?: string; name: string }

type Props = {
  pages: IdName[]
  onChange: (p: IdName[]) => void
  disabled?: boolean
}

export const EditPagesForBookmark = ({ pages, onChange, disabled }: Props) => {
  const { tags } = useDatabase()
  const { data, isLoading } = useLiveQuery((query) =>
    query
      .from({ tag: tags })
      .orderBy(({ tag }) => tag.name)
      .select(({ tag }) => ({ id: tag.id, name: tag.name }))
  )

  const value = useMemo(
    () =>
      pages.map((p) => ({
        value: p.id || p.name,
        label: p.name,
        id: p.id,
      })),
    [pages]
  )

  const onSearchSync = useCallback(
    (search: string) => {
      const normalizedSearch = search.toLocaleLowerCase()

      return data
        .filter(
          (tag) =>
            !normalizedSearch ||
            tag.name.toLocaleLowerCase().includes(normalizedSearch)
        )
        .slice(0, 10)
        .map((tag) => ({ value: tag.id, label: tag.name }))
    },
    [data]
  )

  const handleChange = (options: Option[]) => {
    const newPages = options.map((option) => ({
      id: option.value,
      name: option.label,
    }))

    onChange(newPages)
  }

  return (
    <MultipleSelector
      creatable
      disabled={disabled || isLoading}
      emptyIndicator="No results found."
      hideClearAllButton
      loadingIndicator={
        <div className="py-3 text-gray-600 dark:text-gray-400">
          <Loading size={24} />
        </div>
      }
      onChange={handleChange}
      onSearchSync={onSearchSync}
      placeholder=""
      triggerSearchOnFocus
      value={value}
    />
  )
}
