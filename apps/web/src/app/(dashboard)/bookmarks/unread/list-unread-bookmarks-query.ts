import { BookmarkWithTags } from '../list-all-bookmarks-query'
import { createClient } from '@/lib/supabase/client'
import { GetNextPageParamFunction, InfiniteData, useInfiniteQuery } from '@tanstack/react-query'

const queryKey = (searchQuery: string | null) => ['bookmarks', { searchQuery, unread: true }]

// The range starts from 0 to 19, so we need to subtract 1 from the skip to get the correct range of 20 items
const PAGE_SIZE = 19

const queryFn = async ({
  pageParam: skip,
  queryKey,
}: {
  pageParam: number
  queryKey: (string | { searchQuery: string | null })[]
}) => {
  let searchQuery: string | null = null
  if (queryKey.length === 2) {
    if (typeof queryKey[1] !== 'string') {
      searchQuery = queryKey[1].searchQuery
    }
  }

  let query = supabaseClient.from('bookmarks').select(`
    *,
    bookmarks_tags (
      tags (
        id,
        name
      )
    )
  `, { count: 'exact' }).eq('read', false)

  if (searchQuery && searchQuery.length > 0) {
    query = query.ilike('name', `%${searchQuery}%`)
  }

  const { data, count } = await query
    .order('created_at', { ascending: false })
    // secondary sort by id to avoid pagination issues when imported bookmarks have the same created_at
    .order('id', { ascending: false })
    .range(skip, skip + PAGE_SIZE)
    .throwOnError()

  return { data, count } as { data: BookmarkWithTags[]; count: number }
}

const getNextPageParam: GetNextPageParamFunction<
  number,
  {
    data: BookmarkWithTags[]
    count: number
  }
> = (_, pages) => {
  const bookmarks = pages.flatMap(p => p.data)
  return bookmarks.length
}

const supabaseClient = createClient()
const selectData = (
  data: InfiniteData<
    {
      data: BookmarkWithTags[]
      count: number
    },
    number
  >,
) => {
  return { bookmarks: data.pages.flatMap(p => p.data), count: data.pages[0].count }
}

export const useListUnreadBookmarksQuery = (searchQuery: string | null) => {
  return useInfiniteQuery({
    queryKey: queryKey(searchQuery),
    queryFn: queryFn,
    staleTime: 5000,
    getNextPageParam: getNextPageParam,
    initialPageParam: 0,
    select: selectData,
  })
}
