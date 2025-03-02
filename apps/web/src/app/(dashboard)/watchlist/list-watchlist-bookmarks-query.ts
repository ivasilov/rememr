import { BookmarkType } from '@/src/lib/supabase'
import { createClient } from '@/src/utils/supabase/client'
import { GetNextPageParamFunction, InfiniteData, useInfiniteQuery } from '@tanstack/react-query'

const queryKey = (searchQuery: string | null) => ['watchlist-bookmarks', { searchQuery }]

const PAGE_SIZE = 19

const queryFn = async ({
  pageParam: skip,
  queryKey,
}: {
  pageParam: number
  queryKey: (string | { searchQuery: string | null })[]
}) => {
  let searchQuery: string | undefined = undefined
  if (queryKey.length === 2 && typeof queryKey[1] !== 'string') {
    searchQuery = queryKey[1].searchQuery || undefined
  }

  let query = createClient()
    .from('watchlist')
    .select(
      `
      bookmark:bookmarks!inner (
        *
      )
    `,
      { count: 'exact' },
    )

  if (searchQuery && searchQuery.length > 0) {
    query = query.ilike('bookmark.name', `%${searchQuery}%`)
  }

  const { data: watchlistItems, count } = await query
    .order('created_at', { ascending: false })
    // secondary sort by id to avoid pagination issues
    .order('id', { ascending: false })
    .range(skip, skip + PAGE_SIZE)
    .throwOnError()

  const data = watchlistItems?.map(item => ({
    ...item.bookmark,
  }))

  return { data, count } as { data: NonNullable<typeof data>; count: number }
}

const getNextPageParam: GetNextPageParamFunction<
  number,
  {
    data: NonNullable<BookmarkType[]>
    count: number
  }
> = (_, pages) => {
  const bookmarks = pages.flatMap(p => p.data)
  return bookmarks.length
}

const selectData = (
  data: InfiniteData<
    {
      data: NonNullable<BookmarkType[]>
      count: number
    },
    number
  >,
) => {
  return { bookmarks: data.pages.flatMap(p => p.data), count: data.pages[0].count }
}

export const useListWatchlistBookmarksQuery = (searchQuery: string | null) => {
  return useInfiniteQuery({
    queryKey: queryKey(searchQuery),
    queryFn: queryFn,
    staleTime: 5000,
    getNextPageParam: getNextPageParam,
    initialPageParam: 0,
    select: selectData,
  })
}
