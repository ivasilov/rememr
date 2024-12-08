import { listBookmarksQueryFn } from '@/src/app/(dashboard)/bookmarks/query-options'
import { BookmarkType } from '@/src/lib/supabase'
import { createClient } from '@/src/utils/supabase/client'
import { GetNextPageParamFunction, InfiniteData, useInfiniteQuery } from '@tanstack/react-query'

const queryKey = (searchQuery: string | null, unread: boolean, tags: string[]) => [
  'bookmarks',
  { searchQuery, unread, tags },
]

const queryFn = async ({
  pageParam,
  queryKey,
}: {
  pageParam: number
  queryKey: (string | { searchQuery: string | null; unread: boolean; tags: string[] })[]
}) => {
  let unread = false
  let searchQuery: string | undefined = undefined
  let tags = undefined
  if (queryKey.length === 2) {
    if (typeof queryKey[1] !== 'string') {
      searchQuery = queryKey[1].searchQuery ? queryKey[1].searchQuery : undefined
      unread = queryKey[1].unread
      tags = queryKey[1].tags
    }
  }

  return listBookmarksQueryFn(supabase, unread, searchQuery, tags, pageParam)
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

const supabase = createClient()
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

export const useListBookmarksQuery = (searchQuery: string | null, unread: boolean, tags: string[]) => {
  return useInfiniteQuery({
    queryKey: queryKey(searchQuery, unread, tags),
    queryFn: queryFn,
    staleTime: 5000,
    getNextPageParam: getNextPageParam,
    initialPageParam: 0,
    select: selectData,
  })
}
