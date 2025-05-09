'use client'

import { BookmarkType } from '@/src/lib/supabase'
import {
  Button,
  Card,
  Dialog,
  DialogContent,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@rememr/ui'
import { EllipsisVertical, Pen, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { DeleteBookmarkDialog } from '../delete-bookmark'
import { EditBookmarkDialog } from '../edit-bookmark'
import { ChatSheet } from './chat-sheet'

export const Bookmark = (props: { bookmark: BookmarkType }) => {
  const [editBookmarkDialogShown, setEditBookmarkDialogShown] = useState(false)
  const [deleteBookmarkDialogShown, setDeleteBookmarkDialogShown] = useState(false)

  const bookmark = props.bookmark
  let hostname = ''
  // new URL can throw and make the whole page unresponsive
  try {
    hostname = new URL(bookmark.url).hostname
  } catch {}

  return (
    <Card className="group flex flex-row overflow-hidden px-6 py-4">
      <div className="min-w-5 mt-1">
        <img
          className="w-5 object-contain"
          alt=""
          src={`https://s2.googleusercontent.com/s2/favicons?domain=${hostname}&sz=16`}
          onError={e => {
            e.currentTarget.onerror = null
            e.currentTarget.src = '/images/globe.png'
          }}
        />
      </div>
      <div className="flex w-full justify-between">
        <div className="flex grow flex-col">
          <a className="text-foreground font-bold" href={bookmark.url}>
            {bookmark.name}
          </a>
          <span className="text-muted-foreground font-normal">{hostname}</span>
        </div>

        <div className="flex gap-2">
          <ChatSheet bookmarkTitle={bookmark.name} bookmarkUrl={bookmark.url} />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="outline" className="min-w-9">
                <EllipsisVertical strokeWidth={2.5} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" forceMount>
              <DropdownMenuItem className="flex items-center gap-2" onClick={() => setEditBookmarkDialogShown(true)}>
                <Pen strokeWidth={2.5} />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive flex items-center gap-2"
                onClick={() => setDeleteBookmarkDialogShown(true)}
              >
                <Trash2 strokeWidth={2.5} />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
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
    </Card>
  )
}
