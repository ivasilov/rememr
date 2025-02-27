import { Button, DialogFooter, DialogHeader, DialogTitle } from '@rememr/ui'
import { toast } from 'sonner'
import { useDeleteBookmarkMutation } from './delete-bookmark-mutation'

interface Props {
  bookmark: { id: string; name: string }
  onClose: () => void
}

export const DeleteBookmarkDialog = ({ bookmark, onClose }: Props) => {
  const { mutateAsync, isPending } = useDeleteBookmarkMutation()

  const onDelete = async () => {
    try {
      await mutateAsync({ id: bookmark.id })
      toast.success(
        <span>
          Succesfully deleted <span className="text-destructive">{bookmark.name}</span>.
        </span>,
      )
      onClose()
    } catch (e: any) {
      console.log(e)
      toast.error(
        <span>
          Error happened while trying to delete a bookmark: <span className="text-destructive">{e?.message}</span>.
        </span>,
      )
    }
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Delete a bookmark?</DialogTitle>
      </DialogHeader>
      <div>
        Are you sure you want to delete <span className="text-destructive">{bookmark.name}</span>?
      </div>
      <DialogFooter>
        <Button variant="secondary" onClick={onClose} disabled={isPending}>
          Cancel
        </Button>
        <Button variant="destructive" onClick={onDelete} disabled={isPending}>
          {isPending ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogFooter>
    </>
  )
}
