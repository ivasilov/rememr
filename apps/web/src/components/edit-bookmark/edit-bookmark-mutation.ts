import { createClient } from '@/src/utils/supabase/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'

const supabase = createClient()

const isUUID = (s: string) => {
  const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return regex.test(s || '')
}

const mutationFn = async (values: {
  id: string
  name: string
  url: string
  read: boolean
  tagIds: { id: string; name: string }[]
}) => {
  const tagNames = values.tagIds.filter(t => !isUUID(t.id)).map(t => ({ name: t.name }))
  const { data: newTags } = await supabase.from('tags').insert(tagNames).throwOnError().select()

  await supabase
    .from('bookmarks')
    .update({
      name: values.name,
      url: values.url,
      read: values.read,
    })
    .eq('id', values.id)

  const existingTags = values.tagIds.filter(t => isUUID(t.id))
  const relations = [...(newTags || []), ...existingTags].map(r => ({ tag_id: r.id, bookmark_id: values.id }))

  await supabase.from('bookmarks_tags').delete().eq('bookmark_id', values.id).throwOnError()
  if (relations.length > 0) {
    await supabase.from('bookmarks_tags').insert(relations).throwOnError()
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
