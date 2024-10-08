import { Button, Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@rememr/ui'
import { deleteBookmark } from './action'

interface Props {
  isOpen: boolean
  bookmark: { id: string; name: string }
  onClose: () => void
}

export const DeleteBookmarkDialog = ({ bookmark, isOpen, onClose }: Props) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
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
      </DialogContent>
    </Dialog>
  )
}
