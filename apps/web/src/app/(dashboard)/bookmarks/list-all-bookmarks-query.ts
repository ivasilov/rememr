import { BookmarkType } from '@/lib/supabase'
import { createClient } from '@/lib/supabase/client'
import { GetNextPageParamFunction, InfiniteData, useInfiniteQuery } from '@tanstack/react-query'

const queryKey = (searchQuery: string | null) => ['bookmarks', { searchQuery }]

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

  let query = supabaseClient.from('bookmarks').select('*', { count: 'exact' })

  if (searchQuery && searchQuery.length > 0) {
    query = query.ilike('name', `%${searchQuery}%`)
  }

  const { data, count } = await query
    .order('created_at', { ascending: false })
    // secondary sort by id to avoid pagination issues when imported bookmarks have the same created_at
    .order('id', { ascending: false })
    .range(skip, skip + PAGE_SIZE)
    .throwOnError()

  return { data, count } as { data: NonNullable<typeof data>; count: number }
}

const getNextPageParam: GetNextPageParamFunction<
  number,
  {
    data: NonNullable<
      | {
          created_at: string
          description: string | null
          id: string
          name: string
          read: boolean
          updated_at: string
          url: string
          user_id: string
        }[]
      | null
    >
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
      data: NonNullable<BookmarkType[] | null>
      count: number
    },
    number
  >,
) => {
  return { bookmarks: data.pages.flatMap(p => p.data), count: data.pages[0].count }
}

export const useListAllBookmarksQuery = (searchQuery: string | null) => {
  return useInfiniteQuery({
    queryKey: queryKey(searchQuery),
    queryFn: queryFn,
    staleTime: 5000,
    getNextPageParam: getNextPageParam,
    initialPageParam: 0,
    select: selectData,
  })
}
