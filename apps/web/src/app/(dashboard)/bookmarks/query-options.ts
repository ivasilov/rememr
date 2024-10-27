import { Database } from '@/src/lib/database.types'
import { SupabaseClient } from '@supabase/supabase-js'
import { queryOptions } from '@tanstack/react-query'

export const listBookmarksQueryFn = (
  supabaseClient: SupabaseClient<Database>,
  unread: boolean,
  searchQuery: string,
) => {
  let query = supabaseClient
    .from('bookmarks')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .limit(20)

  if (searchQuery.length > 0) {
    query = query.ilike('name', `%${searchQuery}%`)
  }
  return new Promise(resolve => {
    setTimeout(() => resolve(query), 2000)
  })
}

export function listBookmarksOptions(supabaseClient: SupabaseClient<Database>, unread: boolean, searchQuery: string) {
  return queryOptions({
    queryKey: ['bookmarks', { searchQuery, unread }],
    queryFn: () => listBookmarksQueryFn(supabaseClient, unread, searchQuery),
    staleTime: 5 * 1000,
  })
}
