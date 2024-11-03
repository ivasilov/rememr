import { Database } from '@/src/lib/database.types'
import { SupabaseClient } from '@supabase/supabase-js'
import { queryOptions } from '@tanstack/react-query'

export const listBookmarksQueryFn = async (
  supabaseClient: SupabaseClient<Database>,
  unread: boolean,
  searchQuery?: string,
  cursorCreatedAt?: string,
) => {
  let query = supabaseClient
    .from('bookmarks')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .limit(20)

  if (searchQuery && searchQuery.length > 0) {
    query = query.ilike('name', `%${searchQuery}%`)
  }

  if (unread) {
    query = query.eq('read', false)
  }

  if (cursorCreatedAt) {
    query = query.filter('created_at', 'lt', cursorCreatedAt)
  }

  const { data, count } = await query.throwOnError()

  return { data, count } as { data: NonNullable<typeof data>; count: number }
}

export function listBookmarksOptions(supabaseClient: SupabaseClient<Database>, unread: boolean, searchQuery: string) {
  return queryOptions({
    queryKey: ['bookmarks', { searchQuery, unread }],
    queryFn: () => listBookmarksQueryFn(supabaseClient, unread, searchQuery),
    staleTime: 5 * 1000,
  })
}
