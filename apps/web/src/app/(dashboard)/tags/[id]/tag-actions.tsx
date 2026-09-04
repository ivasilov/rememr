import { Button } from '@rememr/ui'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { bookmarkTags, type Tag, tags } from '@/lib/database'

export const TagActions = ({ tag }: { tag: Tag }) => {
  const navigate = useNavigate()
  const deleteTag = useMutation({
    mutationFn: async (tagId: string) => {
      const relations = bookmarkTags.toArray.filter(
        (relation) => relation.tag_id === tagId
      )

      if (relations.length > 0) {
        await bookmarkTags.delete(
          relations.map((relation) => bookmarkTags.getKeyFromItem(relation))
        ).isPersisted.promise
      }

      await tags.delete(tagId).isPersisted.promise
    },
    onSuccess: async () => {
      toast.success(`The tag ${tag.name} has been deleted.`)
      await navigate({ to: '/bookmarks' })
    },
    onError: (error) => {
      toast.error(`Failed to delete tag: ${error.message}`)
    },
  })

  const onDelete = () => deleteTag.mutate(tag.id)

  return (
    <Button
      disabled={deleteTag.isPending}
      onClick={onDelete}
      variant="destructive"
    >
      {deleteTag.isPending && <Loader2 className="animate-spin" />}
      Delete
    </Button>
  )
}
