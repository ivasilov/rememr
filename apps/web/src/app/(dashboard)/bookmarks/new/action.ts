'use server'
import { revalidatePath } from 'next/cache'
import type { IdName } from '@/components/edit-pages-for-bookmark'
import { createClient } from '@/lib/supabase/server'

export const save = async (name: string, url: string, tagIds: IdName[]) => {
  const supabase = await createClient()

  const tagNames = tagIds.filter((t) => !t.id).map((t) => ({ name: t.name }))
  const { data: newTags } = await supabase
    .from('tags')
    .insert(tagNames)
    .select()

  const { data: bookmarks } = await supabase
    .from('bookmarks')
    .insert({
      name,
      url,
    })
    .select()

  const bookmark = bookmarks![0]

  const existingTags = tagIds.filter((t) => t.id)
  const relations = [...(newTags || []), ...existingTags].map((r) => ({
    tag_id: r.id!,
    bookmark_id: bookmark.id,
  }))
  await supabase.from('bookmarks_tags').insert(relations)

  revalidatePath('/bookmarks')
}
