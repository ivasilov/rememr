import { Button, DialogFooter, DialogHeader, DialogTitle } from '@rememr/ui'
import { useTransition } from 'react'
import { toast } from 'sonner'
import { deleteBookmark } from './delete-bookmark-mutation'

type Props = {
  bookmark: { id: string; name: string }
  onClose: () => void
}

export const DeleteBookmarkDialog = ({ bookmark, onClose }: Props) => {
  const [isPending, startTransition] = useTransition()

  const onDelete = () => {
    startTransition(async () => {
      try {
        await deleteBookmark(bookmark.id)
        toast.success(
          <span>
            Succesfully deleted{' '}
            <span className="text-destructive">{bookmark.name}</span>.
          </span>
        )
        startTransition(onClose)
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : 'An unknown error occurred'
        toast.error(
          <span>
            Error happened while trying to delete a bookmark:{' '}
            <span className="text-destructive">{message}</span>.
          </span>
        )
      }
    })
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Delete a bookmark?</DialogTitle>
      </DialogHeader>
      <div>
        Are you sure you want to delete{' '}
        <span className="text-destructive">{bookmark.name}</span>?
      </div>
      <DialogFooter>
        <Button disabled={isPending} onClick={onClose} variant="secondary">
          Cancel
        </Button>
        <Button disabled={isPending} onClick={onDelete} variant="destructive">
          {isPending ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogFooter>
    </>
  )
}
