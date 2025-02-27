import { createClient } from '@/src/utils/supabase/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'

const supabase = createClient()

const mutationFn = async (values: {
  id: string
  name: string
  url: string
  read: boolean
  tagIds: { id?: string; name: string }[]
}) => {
  const tagNames = values.tagIds.filter(t => !t.id).map(t => ({ name: t.name }))
  const { data: newTags } = await supabase.from('tags').insert(tagNames).select()

  await supabase
    .from('bookmarks')
    .update({
      name: values.name,
      url: values.url,
      read: values.read,
    })
    .eq('id', values.id)

  const existingTags = values.tagIds.filter(t => t.id)
  const relations = [...(newTags || []), ...existingTags].map(r => ({ tag_id: r.id!, bookmark_id: values.id }))

  await supabase.from('bookmarks_tags').delete().eq('bookmark_id', values.id)
  if (relations.length > 0) {
    await supabase.from('bookmarks_tags').insert(relations)
  }
}

export const useEditBookmarkMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] })
    },
  })
}
