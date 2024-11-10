import { createClient } from '@/src/utils/supabase/client'
import { compact, noop, uniq, uniqBy } from 'lodash'
import { z } from 'zod'

const bookmarkSchema = z.object({
  href: z.string(),
  description: z.string(),
  extended: z.string(),
  meta: z.string(),
  hash: z.string(),
  time: z.string(),
  shared: z.enum(['yes', 'no']),
  toread: z.enum(['yes', 'no']),
  tags: z.string().transform(t => t.split(' ')),
})

const bookmarksSchema = z.array(bookmarkSchema)

type PinboardBookmark = z.infer<typeof bookmarkSchema>

export const importPinboardBookmarks = async (
  data: string,
  // names of the tags to be added on each imported bookmark
  tags: string[],
  progress: (current: number, max: number) => void = noop,
) => {
  const supabaseClient = createClient()
  const errors = []

  const {
    data: { user },
  } = await supabaseClient.auth.getUser()
  if (!user) {
    throw new Error('No such user.')
  }

  const bookmarksData = JSON.parse(data)

  const bookmarks = bookmarksSchema.parse(bookmarksData)

  const importedTags = uniq(compact(bookmarks.flatMap(b => b.tags)).concat(tags)).map(t => ({
    name: t,
    user_id: user.id,
  }))

  const importedTagNames = importedTags.map(t => t.name)

  const { data: foundTags } = await supabaseClient
    .from('tags')
    .select()
    .eq('user_id', user.id)
    .in('name', importedTagNames)
    .throwOnError()
  const nonNullableFoundTags = foundTags as NonNullable<typeof foundTags>

  const tagsToBeSaved = importedTags.filter(t => !nonNullableFoundTags.find(f => f.name === t.name))

  const { data: addedTags } = await supabaseClient.from('tags').insert(tagsToBeSaved).select().throwOnError()
  const nonNullableAddedTags = addedTags as NonNullable<typeof addedTags>

  const savedTags = uniqBy(nonNullableFoundTags.concat(nonNullableAddedTags), t => t.id)
  const additionalTags = savedTags.filter(st => tags.includes(st.name))

  let index = 0
  for (const b of bookmarks) {
    const bookmark = {
      url: b.href.trim(),
      name: b.description.trim(),
      description: b.extended.trim(),
      read: b.toread !== 'yes',
      created_at: b.time,
    }

    let savedBookmarkId: string | null = null

    const { data: foundBookmark, error: foundBookmarkError } = await supabaseClient
      .from('bookmarks')
      .select('id')
      .eq('url', bookmark.url)
      .maybeSingle()
    if (foundBookmarkError) {
      errors.push(foundBookmarkError.message)
      continue
    }

    if (foundBookmark) {
      savedBookmarkId = foundBookmark.id
    } else {
      const { data, error } = await supabaseClient.from('bookmarks').insert(bookmark).select('id').single()
      if (error) {
        errors.push(error.message)
        continue
      }
      savedBookmarkId = data.id
    }

    if (savedBookmarkId) {
      const foundTags = compact(b.tags.map(tag => savedTags.find(st => st.name === tag))).concat(additionalTags)

      const bookmarksTags = foundTags.map(tag => {
        return { bookmark_id: savedBookmarkId as string, tag_id: tag.id }
      })
      if (bookmarksTags.length > 0) {
        const { error } = await supabaseClient.from('bookmarks_tags').upsert(bookmarksTags)
        if (error) {
          errors.push(error.message)
        }
      }
    }

    index++
    progress(index, bookmarks.length)
  }
}
