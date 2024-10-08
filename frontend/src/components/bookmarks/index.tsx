'use client'
import { isNumber, last, uniqBy } from 'lodash'
import { useCallback, useState } from 'react'

import { classNames } from '@/src/lib/classnames'
import { BookmarkType } from '@/src/lib/supabase'
import { createClient } from '@/src/utils/supabase/client'
import Link from 'next/link'
import { Bookmark } from '../bookmark'
import { Button } from '../ui/button'
import { LoadMoreBookmarks } from './load-more-bookmarks'

type BookmarksProps = {
  className?: string
  bookmarks: BookmarkType[]
  count: number
}

const supabase = createClient()

export const Bookmarks = ({ className, bookmarks: firstBookmarks, count: initialCount }: BookmarksProps) => {
  const [bookmarks, setBookmarks] = useState(firstBookmarks || [])
  const [loading, setLoading] = useState(false)
  const [count, setCount] = useState(initialCount)

  const classes = classNames('space-y-3 grow flex flex-col', className)

  // TODO: replace this with react query
  const fetchNextBookmarks = useCallback(async () => {
    setLoading(true)
    const lastBookmark = last(bookmarks)
    const { data, error, count } = await supabase
      .from('bookmarks')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .filter('created_at', 'lte', lastBookmark?.created_at)
      .limit(10)

    if (data) {
      const updatedBookmarks = uniqBy([...bookmarks, ...data], b => b.id)

      setBookmarks(updatedBookmarks)
    }
    if (isNumber(count)) {
      setCount(count)
    }
    setLoading(false)
  }, [bookmarks])

  if (loading === false && bookmarks.length === 0) {
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

  return (
    <div className={classes}>
      {bookmarks.map(b => (
        <Bookmark key={b.id} bookmark={b} />
      ))}
      <LoadMoreBookmarks hasMore={count > bookmarks.length} loading={loading} fetchMore={fetchNextBookmarks} />
    </div>
  )
}
