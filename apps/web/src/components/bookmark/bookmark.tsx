'use client'

import { BookmarkType } from '@/src/lib/supabase'
import { Button, Card, Dialog, DialogContent, DialogTrigger } from '@rememr/ui'
import { PenLine, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { DeleteBookmarkDialog } from '../delete-bookmark'
import { EditBookmarkDialog } from '../edit-bookmark'

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
    <Card className="group flex overflow-hidden px-6 py-4">
      <div className="min-w-5 mr-5 mt-1">
        <img
          className="w-5 object-contain"
          alt=""
          src={`https://s2.googleusercontent.com/s2/favicons?domain=${bookmark.url}&sz=16`}
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

        {/* the min-w-[80px] is added so that bookmarks with long url names dont shift when hovering over the action buttons */}
        <div className="flex min-w-[80px] items-center space-x-2">
          <Dialog open={editBookmarkDialogShown} onOpenChange={open => setEditBookmarkDialogShown(open)}>
            <DialogTrigger asChild>
              <Button size="icon" className="hidden group-hover:inline-flex">
                <PenLine size={16} strokeWidth={2} />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <EditBookmarkDialog bookmark={bookmark} onClose={() => setEditBookmarkDialogShown(false)} />
            </DialogContent>
          </Dialog>
          <Dialog open={deleteBookmarkDialogShown} onOpenChange={open => setDeleteBookmarkDialogShown(open)}>
            <DialogTrigger asChild>
              <Button
                size="icon"
                className="hidden group-hover:inline-flex"
                variant="destructive"
                onClick={() => setDeleteBookmarkDialogShown(true)}
              >
                <Trash2 size={16} />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DeleteBookmarkDialog bookmark={bookmark} onClose={() => setDeleteBookmarkDialogShown(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </Card>
  )
}
