'use server'

import { createClient } from '@/src/utils/supabase/server'
import { SearchInputInner } from './inner'

export const SearchInput = async () => {
  const supabase = await createClient()

  const { data: tags } = await supabase.from('tags').select('*').order('name', { ascending: false })

  if (!tags) {
    return null
  }

  return (
    <div className="w-full flex-1">
      <div className="relative">
        <SearchInputInner tags={tags} />
      </div>
    </div>
  )
}
