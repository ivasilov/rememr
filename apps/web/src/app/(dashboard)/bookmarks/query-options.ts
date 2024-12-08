import { Database } from '@/src/lib/database.types'
import { SupabaseClient } from '@supabase/supabase-js'
import { queryOptions } from '@tanstack/react-query'

// The range starts from 0 to 19, so we need to subtract 1 from the skip to get the correct range of 20 items
const PAGE_SIZE = 19

export const listBookmarksQueryFn = async (
  supabaseClient: SupabaseClient<Database>,
  unread?: boolean,
  searchQuery?: string,
  tags?: string[],
  skip: number = 0,
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

  const { data, count } = await query
    .order('created_at', { ascending: false })
    // secondary sort by id to avoid pagination issues when imported bookmarks have the same created_at
    .order('id', { ascending: false })
    .range(skip, skip + PAGE_SIZE)
    .throwOnError()

  return { data, count } as { data: NonNullable<typeof data>; count: number }
}

export function listBookmarksOptions(supabaseClient: SupabaseClient<Database>, unread: boolean, searchQuery: string) {
  return queryOptions({
    queryKey: ['bookmarks', { searchQuery, unread }],
    queryFn: () => listBookmarksQueryFn(supabaseClient, unread, searchQuery),
    staleTime: 5 * 1000,
  })
}
