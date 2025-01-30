'use server'
import { createClient } from '@/src/utils/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const deleteTag = async (tagId: string) => {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  await supabase.from('bookmarks_tags').delete().eq('tag_id', tagId)
  await supabase.from('tags').delete().eq('id', tagId)

  redirect('/bookmarks')
}
