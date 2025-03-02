'use server'
import type { IdName } from '@/src/components/edit-pages-for-bookmark'
import { isWatchable } from '@/src/lib/utils/watchable'
import { addToWatchlist } from '@/src/lib/utils/watchlist'
import { createClient } from '@/src/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export const save = async (name: string, url: string, tagIds: IdName[]) => {
  const supabase = await createClient()

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('User not authenticated')
  }

  // Create new tags if needed
  const tagNames = tagIds.filter(t => !t.id).map(t => ({ name: t.name }))
  const { data: newTags } = await supabase.from('tags').insert(tagNames).select()

  // Create the bookmark
  const { data: bookmark, error: bookmarkError } = await supabase
    .from('bookmarks')
    .insert({ name, url })
    .select()
    .single()

  if (bookmarkError) {
    throw bookmarkError
  }

  if (!bookmark) {
    throw new Error('Failed to create bookmark')
  }

  // Add bookmark-tag relations
  const existingTags = tagIds.filter(t => t.id)
  const relations = [...(newTags || []), ...existingTags].map(r => ({ tag_id: r.id!, bookmark_id: bookmark.id }))
  await supabase.from('bookmarks_tags').insert(relations)

  // If the URL is watchable, add it to the watchlist
  if (isWatchable(url)) {
    await addToWatchlist(bookmark.id)
  }

  revalidatePath('/bookmarks')
}
