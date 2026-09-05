import { Button } from '@rememr/ui'
import { useNavigate } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import { useTransition } from 'react'
import { toast } from 'sonner'
import { bookmarkTags, type Tag, tags } from '@/lib/database'

export const TagActions = ({ tag }: { tag: Tag }) => {
  const navigate = useNavigate()
  const [isPending, startTransition] = useTransition()

  const onDelete = () => {
    startTransition(async () => {
      try {
        const relations = bookmarkTags.toArray.filter(
          (relation) => relation.tag_id === tag.id
        )

        if (relations.length > 0) {
          await bookmarkTags.delete(
            relations.map((relation) => bookmarkTags.getKeyFromItem(relation))
          ).isPersisted.promise
        }

        await tags.delete(tag.id).isPersisted.promise
        toast.success(`The tag ${tag.name} has been deleted.`)
        await navigate({ to: '/bookmarks' })
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : 'An unknown error occurred'
        toast.error(`Failed to delete tag: ${message}`)
      }
    })
  }

  return (
    <Button disabled={isPending} onClick={onDelete} variant="destructive">
      {isPending && <Loader2 className="animate-spin" />}
      Delete
    </Button>
  )
}
