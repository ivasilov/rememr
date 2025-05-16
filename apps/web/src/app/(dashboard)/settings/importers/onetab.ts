import { Database } from '@/lib/database.types'
import { createClient } from '@/lib/supabase/client'
import { compact, uniqBy } from 'lodash'

type InsertableBookmark = Database['public']['Tables']['bookmarks']['Insert']

export const importOnetabBookmarks = async (
  data: string,
  { tags, unread }: { tags: string[]; unread: boolean },
  progress?: (current: number, max: number) => void,
) => {
  const supabaseClient = createClient()

  const {
    data: { user },
  } = await supabaseClient.auth.getUser()
  if (!user) {
    throw new Error('No such user.')
  }

  const validated = data.split('\n')
  const compacted = compact(validated) as string[]

  const translated = compacted.map(b => {
    const splitted = b.split('|')
    const [url, ...rest] = splitted

    const obj: InsertableBookmark = {
      url: (url ?? '').trim(),
      name: compact(rest.map(e => (e ?? '').trim())).join(' | '),
      user_id: user.id,
      read: !unread,
    }

    return obj
  })

  const { data: savedBookmarks, error: insertError } = await supabaseClient
    .from('bookmarks')
    .insert(translated)
    .select('id')
  if (insertError) throw insertError
  const savedBookmarkIds = savedBookmarks as { id: string }[]

  const { data: foundTags } = await supabaseClient
    .from('tags')
    .select()
    .eq('user_id', user.id)
    .in('name', tags)
    .throwOnError()
  const nonNullableFoundTags = foundTags as NonNullable<typeof foundTags>

  const tagsToBeSaved = tags
    .filter(tagName => !nonNullableFoundTags.find(f => f.name === tagName))
    .map(tagName => ({ name: tagName, user_id: user.id }))

  const { data: addedTags } = await supabaseClient.from('tags').insert(tagsToBeSaved).select().throwOnError()
  const nonNullableAddedTags = addedTags as NonNullable<typeof addedTags>

  const savedTagIds = uniqBy(nonNullableFoundTags.concat(nonNullableAddedTags), t => t.id).map(t => t.id)

  const bookmarksTags = savedTagIds.reduce(
    (combinations, tagId) => {
      return combinations.concat(savedBookmarkIds.map(bookmark => ({ bookmark_id: bookmark.id, tag_id: tagId })))
    },
    [] as { bookmark_id: string; tag_id: string }[],
  )

  if (bookmarksTags.length > 0) {
    const { error } = await supabaseClient.from('bookmarks_tags').upsert(bookmarksTags)
  }

  return savedBookmarkIds.length
}
