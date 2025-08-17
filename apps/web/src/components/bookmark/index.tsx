'use client'

import {
  Button,
  Dialog,
  DialogContent,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  TableCell,
  TableRow,
} from '@rememr/ui'
import { EllipsisVertical, Pen, Trash2 } from 'lucide-react'
import { useState } from 'react'
import type { BookmarkWithTags } from '@/app/(dashboard)/bookmarks/list-all-bookmarks-query'
import { DeleteBookmarkDialog } from '../delete-bookmark'
import { EditBookmarkDialog } from '../edit-bookmark'
import { ChatDropdownMenuItem } from './chat-dropdown-menu-item'
import { TagsBadge } from './tags-badge'

const MAX_NAME_LENGTH = 60

export const BookmarkRow = (props: { bookmark: BookmarkWithTags }) => {
  const [editBookmarkDialogShown, setEditBookmarkDialogShown] = useState(false)
  const [deleteBookmarkDialogShown, setDeleteBookmarkDialogShown] =
    useState(false)

  const bookmark = props.bookmark
  let hostname = ''
  // new URL can throw and make the whole page unresponsive
  try {
    hostname = new URL(bookmark.url).hostname.replace('www.', '')
    // biome-ignore lint/suspicious/noEmptyBlockStatements: <explanation>
  } catch {}

  const truncatedName =
    bookmark.name.length > MAX_NAME_LENGTH
      ? `${bookmark.name.slice(0, MAX_NAME_LENGTH)}...`
      : bookmark.name

  const tags = bookmark.bookmarks_tags.map((bt) => bt.tags)

  return (
    <>
      <TableRow>
        <TableCell className="w-8">
          <img
            alt=""
            className="w-5 object-contain"
            onError={(e) => {
              e.currentTarget.onerror = null
              e.currentTarget.src = '/images/globe.png'
            }}
            src={`https://s2.googleusercontent.com/s2/favicons?domain=${hostname}&sz=16`}
          />
        </TableCell>
        <TableCell className="font-medium">
          <a
            className="text-foreground hover:underline"
            href={bookmark.url}
            title={bookmark.name}
          >
            {truncatedName}
          </a>
        </TableCell>
        <TableCell className="text-muted-foreground">{hostname}</TableCell>
        <TableCell>
          <TagsBadge tags={tags} />
        </TableCell>
        <TableCell className="w-32">
          <div className="flex items-center justify-end gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="h-8 w-8" size="icon" variant="outline">
                  <EllipsisVertical className="h-4 w-4" strokeWidth={2.5} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" forceMount>
                <ChatDropdownMenuItem
                  bookmarkTitle={bookmark.name}
                  bookmarkUrl={bookmark.url}
                />
                <DropdownMenuItem
                  className="flex items-center gap-2"
                  onClick={() => setEditBookmarkDialogShown(true)}
                >
                  <Pen className="h-4 w-4" strokeWidth={2.5} />
                  <span>Edit</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex items-center gap-2 text-destructive"
                  onClick={() => setDeleteBookmarkDialogShown(true)}
                >
                  <Trash2 className="h-4 w-4" strokeWidth={2.5} />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </TableCell>
      </TableRow>

      <Dialog
        onOpenChange={(open) => setEditBookmarkDialogShown(open)}
        open={editBookmarkDialogShown}
      >
        <DialogContent>
          <EditBookmarkDialog
            bookmark={bookmark}
            onClose={() => setEditBookmarkDialogShown(false)}
          />
        </DialogContent>
      </Dialog>
      <Dialog
        onOpenChange={(open) => setDeleteBookmarkDialogShown(open)}
        open={deleteBookmarkDialogShown}
      >
        <DialogContent>
          <DeleteBookmarkDialog
            bookmark={bookmark}
            onClose={() => setDeleteBookmarkDialogShown(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}

// biome-ignore lint/performance/noBarrelFile: reexport
export { LoadingBookmarkRow } from './loading-bookmark-row'
