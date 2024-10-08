import { createClient } from '@/src/utils/supabase/client'
import { compact, noop, uniq } from 'lodash'
import { z } from 'zod'

const bookmarkSchema = z.object({
  href: z.string(),
  description: z.string(),
  extended: z.string(),
  meta: z.string(),
  hash: z.string(),
  time: z.coerce.date(),
  shared: z.enum(['yes', 'no']),
  toread: z.enum(['yes', 'no']),
  tags: z.string().transform(t => t.split(' ')),
})

const bookmarksSchema = z.array(bookmarkSchema)

type PinboardBookmark = z.infer<typeof bookmarkSchema>

export const importPinboardBookmarks = async (
  data: string,
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

  const bookmarksData = JSON.parse(data) as any[]

  const bookmarks = bookmarksSchema.parse(bookmarksData)

  const tags = uniq(compact(bookmarks.flatMap(b => b.tags))).map(t => ({ name: t, user_id: user.id }))

  const { error, data: savedTags } = await supabaseClient.from('tags').insert(tags).select()
  if (error) {
    throw error
  }

  let index = 0
  for (const b of bookmarks) {
    const bookmark = {
      url: b.href.trim(),
      name: b.description.trim(),
      description: b.extended.trim(),
      read: b.toread !== 'yes',
    }

    const { data, error } = await supabaseClient.from('bookmarks').insert(bookmark).select('id').single()
    if (error) {
      errors.push(error.message)
    }

    if (data?.id) {
      const foundTags = compact(b.tags.map(tag => savedTags.find(st => st.name === tag)))

      const bookmarksTags = foundTags.map(tag => {
        return { bookmark_id: data?.id, tag_id: tag.id }
      })
      if (bookmarksTags.length > 0) {
        const { error } = await supabaseClient.from('bookmarks_tags').insert(bookmarksTags)
        if (error) {
          errors.push(error.message)
        }
      }
    }

    index++
    progress(index, bookmarks.length)
  }
}
