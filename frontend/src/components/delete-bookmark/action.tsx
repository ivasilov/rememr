'use server'
import { createClient } from '@/src/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

export const deleteBookmark = async (id: string) => {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  await supabase.from('bookmarks').delete().eq('id', id)

  revalidatePath('/bookmarks')
}
