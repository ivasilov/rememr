import { Database } from '@/src/lib/database.types'
import { SupabaseClient } from '@supabase/supabase-js'
import { queryOptions } from '@tanstack/react-query'

export const listBookmarksQueryFn = async (
  supabaseClient: SupabaseClient<Database>,
  unread?: boolean,
  searchQuery?: string,
  tags?: string[],
  cursorCreatedAt?: string,
) => {
  let query =
    tags && tags.length > 0
      ? supabaseClient
          .from('bookmarks')
          .select(`*, bookmarks_tags!inner()`, { count: 'exact' })
          .in('bookmarks_tags.tag_id', tags)
      : supabaseClient.from('bookmarks').select('*', { count: 'exact' })

  if (searchQuery && searchQuery.length > 0) {
    query = query.ilike('name', `%${searchQuery}%`)
  }

  if (unread) {
    query = query.eq('read', false)
  }

  if (cursorCreatedAt) {
    query = query.filter('created_at', 'lt', cursorCreatedAt)
  }

  const { data, count } = await query.order('created_at', { ascending: false }).limit(20).throwOnError()

  return { data, count } as { data: NonNullable<typeof data>; count: number }
}

export function listBookmarksOptions(supabaseClient: SupabaseClient<Database>, unread: boolean, searchQuery: string) {
  return queryOptions({
    queryKey: ['bookmarks', { searchQuery, unread }],
    queryFn: () => listBookmarksQueryFn(supabaseClient, unread, searchQuery),
    staleTime: 5 * 1000,
  })
}
