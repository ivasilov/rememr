import { Database } from '@/src/lib/database.types'
import { createClient } from '@/src/utils/supabase/client'
import { compact } from 'lodash'

type InsertableBookmark = Database['public']['Tables']['bookmarks']['Insert']

export const importOnetabBookmarks = async (data: string, progress?: (current: number, max: number) => void) => {
  const supabaseClient = createClient()

  const validated = data.split('\n')
  const compacted = compact(validated) as string[]

  const translated = compacted.map(b => {
    const splitted = b.split('|')
    const [url, ...rest] = splitted

    const obj: InsertableBookmark = {
      url: (url ?? '').trim(),
      name: compact(rest.map(e => (e ?? '').trim())).join(' | '),
    }

    return obj
  })

  const { error: insertError } = await supabaseClient.from('bookmarks').insert(translated)
  if (insertError) throw insertError
}
