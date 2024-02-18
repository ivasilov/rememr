import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '../utils/supabase/server'
import { Database } from './database.types'

export const checkAuthentication = async () => {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    // This route can only be accessed by authenticated users.
    // Unauthenticated users will be redirected to the `/login` route.
    redirect('/login')
  }
}

export type BookmarkType = Database['public']['Tables']['bookmarks']['Row']
export type TagType = Database['public']['Tables']['tags']['Row']
