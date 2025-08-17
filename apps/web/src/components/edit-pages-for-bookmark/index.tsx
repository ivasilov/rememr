import { MultipleSelector, type Option } from '@rememr/ui'
import { useEffect, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Loading } from '../loading'

export type IdName = { id?: string; name: string }

type Props = {
  pages: IdName[]
  onChange: (p: IdName[]) => void
  disabled?: boolean
}

const memoizedSearchSet = new Map<string, { value: string; label: string }[]>()

const memoizedOnSearch = async (value: string) => {
  if (!memoizedSearchSet.has(value)) {
    const supabase = createClient()
    const { data: tags } = await supabase
      .from('tags')
      .select()
      .ilike('name', `%${value}%`)
      .limit(10)
    const result = (tags || []).map((p) => ({ value: p.id, label: p.name }))
    memoizedSearchSet.set(value, result)
  }

  return memoizedSearchSet.get(value)!
}

export const EditPagesForBookmark = ({ pages, onChange, disabled }: Props) => {
  // clear the memoizedSearchSet on first render
  useEffect(() => memoizedSearchSet.clear(), [])

  const value = useMemo(
    () =>
      pages.map((p) => ({
        value: p.id || p.name,
        label: p.name,
        id: p.id,
      })),
    [pages]
  )

  const handleChange = (value: Option[]) => {
    const newPages = value.map((v) => ({ id: v.value, name: v.label }))

    onChange(newPages)
  }

  return (
    <MultipleSelector
      creatable
      disabled={disabled}
      emptyIndicator="No results found."
      hideClearAllButton
      loadingIndicator={
        <div className="py-3 text-gray-600 dark:text-gray-400">
          <Loading size={24} />
        </div>
      }
      onChange={handleChange}
      onSearch={memoizedOnSearch}
      placeholder=""
      triggerSearchOnFocus
      value={value}
    />
  )
}
