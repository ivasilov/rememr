import { listBookmarksQueryFn } from '@/src/app/(dashboard)/bookmarks/query-options'
import { BookmarkType } from '@/src/lib/supabase'
import { createClient } from '@/src/utils/supabase/client'
import { InfiniteData, useInfiniteQuery } from '@tanstack/react-query'

const queryKey = (searchQuery: string | null, unread: boolean) => ['bookmarks', { searchQuery, unread }]

const queryFn = async ({ pageParam, queryKey }) => {
  const [, { searchQuery, unread }] = queryKey as [string, { searchQuery: string | undefined; unread: boolean }]

  return listBookmarksQueryFn(supabase, unread, searchQuery, pageParam)
}

const getNextPageParam = (_: any, pages: any) => {
  const bookmarks = pages.flatMap(p => p.data)
  // find the latest timestamp
  const last = bookmarks.reduce(
    (oldest, bookmark) => (oldest > bookmark.created_at ? bookmark.created_at : oldest),
    bookmarks[0]?.created_at,
  )
  return last
}

const supabase = createClient()
const selectData = (
  data: InfiniteData<
    {
      data: NonNullable<BookmarkType[] | null>
      count: number
    },
    string | undefined
  >,
) => {
  return { bookmarks: data.pages.flatMap(p => p.data), count: data.pages[0].count }
}

export const useListBookmarksQuery = (searchQuery: string | null, unread: boolean) => {
  return useInfiniteQuery({
    queryKey: queryKey(searchQuery, unread),
    queryFn: queryFn,
    staleTime: 5000,
    getNextPageParam: getNextPageParam,
    initialPageParam: undefined as string | undefined,
    select: selectData,
  })
}
