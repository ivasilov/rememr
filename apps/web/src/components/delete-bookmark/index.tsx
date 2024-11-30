import { Button, DialogFooter, DialogHeader, DialogTitle } from '@rememr/ui'
import { toast } from 'sonner'
import { deleteBookmark } from './action'

interface Props {
  bookmark: { id: string; name: string }
  onClose: () => void
}

export const DeleteBookmarkDialog = ({ bookmark, onClose }: Props) => {
  const onDelete = async () => {
    try {
      await deleteBookmark(bookmark.id)
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
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="destructive" onClick={onDelete}>
          Delete
        </Button>
      </DialogFooter>
    </>
  )
}
