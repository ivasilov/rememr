'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '../utils/supabase/server'
import { Database } from './database.types'

export const checkAuthentication = async (pathname: string) => {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    // Encode the current path and redirect to login with the 'returnTo' query parameter
    const encodedReturnTo = encodeURIComponent(pathname)
    redirect(`/login?returnTo=${encodedReturnTo}`)
  }
}

export type BookmarkType = Database['public']['Tables']['bookmarks']['Row']
export type TagType = Database['public']['Tables']['tags']['Row']
