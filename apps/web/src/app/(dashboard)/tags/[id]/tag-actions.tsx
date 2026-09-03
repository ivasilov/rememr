import { Button } from '@rememr/ui'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import type { TagType } from '@/lib/supabase'
import { createClient } from '@/lib/supabase/client'

export const TagActions = ({ tag }: { tag: TagType }) => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const deleteTag = useMutation({
    mutationFn: async (tagId: string) => {
      const supabase = createClient()
      await supabase
        .from('bookmarks_tags')
        .delete()
        .eq('tag_id', tagId)
        .throwOnError()
      await supabase.from('tags').delete().eq('id', tagId).throwOnError()
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['bookmarks'] }),
        queryClient.invalidateQueries({ queryKey: ['tags'] }),
      ])
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
