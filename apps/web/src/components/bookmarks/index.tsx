import {
  Button,
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@rememr/ui'
import type { UseInfiniteQueryResult } from '@tanstack/react-query'
import Link from 'next/link'
import type { BookmarkWithTags } from '@/app/(dashboard)/bookmarks/list-all-bookmarks-query'
import { BookmarkRow, LoadingBookmarkRow } from '../bookmark'
import { LoadMoreBookmarks } from './load-more-bookmarks'

type BookmarksProps = UseInfiniteQueryResult<
  {
    bookmarks: BookmarkWithTags[]
    count: number
  },
  Error
>

export const Bookmarks = ({
  isSuccess,
  isLoading,
  data,
  fetchNextPage,
  isFetchingNextPage,
}: BookmarksProps) => {
  if (isLoading) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-8" />
            <TableHead>Name</TableHead>
            <TableHead>URL</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead className="w-32">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 10 }).map((_, index) => (
            <LoadingBookmarkRow key={index} />
          ))}
        </TableBody>
      </Table>
    )
  }

  if (!isSuccess) {
    return <></>
  }

  const { bookmarks, count } = data

  if (count === 0) {
    return (
      <div className="flex h-full">
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
          <div className="flex flex-col items-center gap-4">
            <div className="flex flex-col gap-1 text-center">
              <h3 className="font-bold text-2xl tracking-tight">
                You have no bookmarks
              </h3>
              <p className="text-muted-foreground text-sm">
                You can add a bookmark by visiting this page or by dragging this
                bookmarklet into your browser bookmarks toolbar.
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
    <div className="flex grow flex-col space-y-3 py-3">
      <Table>
        <TableBody>
          {bookmarks.map((b) => (
            <BookmarkRow bookmark={b} key={b.id} />
          ))}

          <LoadMoreBookmarks
            fetchMore={() => fetchNextPage()}
            hasMore={count > bookmarks.length}
            loading={isFetchingNextPage}
          />
        </TableBody>
      </Table>
    </div>
  )
}
