import {
  Button,
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@rememr/ui'
import { Link } from '@tanstack/react-router'
import type { Bookmark } from '@/lib/database'
import { BookmarkRow, LoadingBookmarkRow } from '../bookmark'
import { LoadMoreBookmarks } from './load-more-bookmarks'
import { useBookmarkTags } from './use-bookmark-tags'

const LOADING_ROW_IDS = Array.from(
  { length: 10 },
  (_, index) => `loading-bookmark-${index}`
)

type BookmarksProps = {
  bookmarks: Bookmark[]
  fetchMore: () => void
  hasMore: boolean
  isError: boolean
  isFetchingMore: boolean
  isLoading: boolean
}

export const Bookmarks = ({
  bookmarks,
  fetchMore,
  hasMore,
  isError,
  isFetchingMore,
  isLoading,
}: BookmarksProps) => {
  const bookmarkIds = bookmarks.map((bookmark) => bookmark.id)
  const { isLoading: areTagsLoading, tagsByBookmarkId } =
    useBookmarkTags(bookmarkIds)

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
          {LOADING_ROW_IDS.map((id) => (
            <LoadingBookmarkRow key={id} />
          ))}
        </TableBody>
      </Table>
    )
  }

  if (isError) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Bookmarks could not be loaded.</p>
      </div>
    )
  }

  if (bookmarks.length === 0 && !hasMore) {
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
              <Link to="/bookmarks/new">Add new bookmark</Link>
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
          {bookmarks.map((bookmark) => (
            <BookmarkRow
              bookmark={{
                ...bookmark,
                tags: tagsByBookmarkId.get(bookmark.id) ?? [],
              }}
              key={bookmark.id}
              tagsLoading={areTagsLoading}
            />
          ))}

          <LoadMoreBookmarks
            fetchMore={fetchMore}
            hasMore={hasMore}
            loading={isFetchingMore}
          />
        </TableBody>
      </Table>
    </div>
  )
}
