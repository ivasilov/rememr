'use client'

import { Button } from '@rememr/ui'
import Link from 'next/link'
import { useQueryState } from 'nuqs'
import { Bookmark } from '../bookmark'
import { Loading } from '../loading'
import { useListBookmarksQuery } from './listBookmarksQuery'
import { LoadMoreBookmarks } from './load-more-bookmarks'

type BookmarksProps = {
  className?: string
  unread?: boolean
}

export const Bookmarks = ({ className, unread = false }: BookmarksProps) => {
  const [searchQuery] = useQueryState('q')

  const { isSuccess, isLoading, data, fetchNextPage, isFetchingNextPage } = useListBookmarksQuery(searchQuery, unread)

  if (isLoading) {
    return (
      <div className="h-screen">
        <Loading />
      </div>
    )
  }

  if (!isSuccess) {
    return <></>
  }

  const { bookmarks, count } = data

  if (bookmarks.length === 0) {
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
    <div className="container flex grow flex-col space-y-3 px-6 pt-8">
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
}
