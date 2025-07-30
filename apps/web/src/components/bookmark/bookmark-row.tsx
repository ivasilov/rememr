'use client'

import { BookmarkWithTags } from '@/app/(dashboard)/bookmarks/list-all-bookmarks-query'
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
import { DeleteBookmarkDialog } from '../delete-bookmark'
import { EditBookmarkDialog } from '../edit-bookmark'
import { ChatSheet } from './chat-sheet'
import { TagsBadge } from './tags-badge'

const MAX_NAME_LENGTH = 60

export const BookmarkRow = (props: { bookmark: BookmarkWithTags }) => {
  const [editBookmarkDialogShown, setEditBookmarkDialogShown] = useState(false)
  const [deleteBookmarkDialogShown, setDeleteBookmarkDialogShown] = useState(false)

  const bookmark = props.bookmark
  let hostname = ''
  // new URL can throw and make the whole page unresponsive
  try {
    hostname = new URL(bookmark.url).hostname
  } catch {}

  const truncatedName = bookmark.name.length > MAX_NAME_LENGTH 
    ? `${bookmark.name.slice(0, MAX_NAME_LENGTH)}...` 
    : bookmark.name

  const tags = bookmark.bookmarks_tags.map(bt => bt.tags)

  return (
    <>
      <TableRow>
        <TableCell className="w-8">
          <img
            className="w-5 object-contain"
            alt=""
            src={`https://s2.googleusercontent.com/s2/favicons?domain=${hostname}&sz=16`}
            onError={e => {
              e.currentTarget.onerror = null
              e.currentTarget.src = '/images/globe.png'
            }}
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
        <TableCell className="text-muted-foreground">
          {hostname}
        </TableCell>
        <TableCell>
          <TagsBadge tags={tags} />
        </TableCell>
        <TableCell className="w-32">
          <div className="flex items-center gap-2 justify-end">
            <ChatSheet bookmarkTitle={bookmark.name} bookmarkUrl={bookmark.url} />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="outline" className="h-8 w-8">
                  <EllipsisVertical strokeWidth={2.5} className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" forceMount>
                <DropdownMenuItem className="flex items-center gap-2" onClick={() => setEditBookmarkDialogShown(true)}>
                  <Pen strokeWidth={2.5} className="h-4 w-4" />
                  <span>Edit</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive flex items-center gap-2"
                  onClick={() => setDeleteBookmarkDialogShown(true)}
                >
                  <Trash2 strokeWidth={2.5} className="h-4 w-4" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </TableCell>
      </TableRow>
      
      <Dialog open={editBookmarkDialogShown} onOpenChange={open => setEditBookmarkDialogShown(open)}>
        <DialogContent>
          <EditBookmarkDialog bookmark={bookmark} onClose={() => setEditBookmarkDialogShown(false)} />
        </DialogContent>
      </Dialog>
      <Dialog open={deleteBookmarkDialogShown} onOpenChange={open => setDeleteBookmarkDialogShown(open)}>
        <DialogContent>
          <DeleteBookmarkDialog bookmark={bookmark} onClose={() => setDeleteBookmarkDialogShown(false)} />
        </DialogContent>
      </Dialog>
    </>
  )
}