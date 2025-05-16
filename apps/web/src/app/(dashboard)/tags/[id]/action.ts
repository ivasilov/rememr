'use server'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export const deleteTag = async (tagId: string) => {
  const supabase = await createClient()

  await supabase.from('bookmarks_tags').delete().eq('tag_id', tagId)
  await supabase.from('tags').delete().eq('id', tagId)

  redirect('/bookmarks')
}
