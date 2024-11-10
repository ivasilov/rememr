import { Button, DialogFooter, DialogHeader, DialogTitle } from '@rememr/ui'
import { deleteBookmark } from './action'

interface Props {
  bookmark: { id: string; name: string }
  onClose: () => void
}

export const DeleteBookmarkDialog = ({ bookmark, onClose }: Props) => {
  return (
    <>
      <DialogHeader>
        <DialogTitle>Delete a bookmark?</DialogTitle>
      </DialogHeader>
      <div>
        Are you sure you want to delete <span style={{ color: 'orange' }}>{bookmark.name}</span>?
      </div>
      <DialogFooter>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="destructive" onClick={() => deleteBookmark(bookmark.id)}>
          Delete
        </Button>
      </DialogFooter>
    </>
  )
}
