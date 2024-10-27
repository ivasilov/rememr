'use client'

import { classNames } from '@/src/lib/classnames'
import { BookmarkType } from '@/src/lib/supabase'
import { createClient } from '@/src/utils/supabase/client'
import { Button } from '@rememr/ui'
import { InfiniteData, useSuspenseInfiniteQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { useQueryState } from 'nuqs'
import { Bookmark } from '../bookmark'
import { LoadMoreBookmarks } from './load-more-bookmarks'

type BookmarksProps = {
  className?: string
  unread?: boolean
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

export const Bookmarks = ({ className, unread = false }: BookmarksProps) => {
  const [searchQuery] = useQueryState('q')

  const {
    isFetching,
    data: { bookmarks, count },
    fetchNextPage,
    isFetchingNextPage,
  } = useSuspenseInfiniteQuery({
    queryKey: ['bookmarks', { searchQuery, unread }],
    queryFn: async ({ pageParam, queryKey }) => {
      const [, { searchQuery, unread }] = queryKey as [string, { searchQuery: string | null; unread: boolean }]

      let query = supabase
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

      if (pageParam) {
        query = query.filter('created_at', 'lt', pageParam)
      }

      const { data, count } = await query.throwOnError()

      return { data, count } as { data: NonNullable<typeof data>; count: number }
    },
    staleTime: 5 * 1000,
    getNextPageParam: (_, pages) => {
      const bookmarks = pages.flatMap(p => p.data)
      // find the latest timestamp
      const last = bookmarks.reduce(
        (oldest, bookmark) => (oldest > bookmark.created_at ? bookmark.created_at : oldest),
        bookmarks[0]?.created_at,
      )
      return last
    },
    initialPageParam: undefined as string | undefined,
    select: selectData,
  })

  const classes = classNames('space-y-3 grow flex flex-col', className)

  console.log(isFetching, count, bookmarks.length)

  if (bookmarks.length > 0) {
    return (
      <div className={classes}>
        {bookmarks.map(b => (
          <Bookmark key={b.id} bookmark={b} />
        ))}

        <LoadMoreBookmarks
          hasMore={count > bookmarks.length}
          loading={isFetchingNextPage}
          fetchMore={() => fetchNextPage()}
        />
      </div>
    )
  } else {
    return (
      <div className="flex h-full p-4 lg:p-6">
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
          <div className="flex flex-col items-center gap-4">
            <div className="flex flex-col gap-1 text-center">
              <h3 className="text-2xl font-bold tracking-tight">You have no bookmarks</h3>
              <p className="text-muted-foreground text-sm">
                You can add a bookmark by visiting this page or by dragging this bookmarklet into your browser bookmarks
                toolbar.
              </p>
            </div>
            <Button asChild>
              <Link href="/bookmarks/new">Add new bookmark</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }
}
