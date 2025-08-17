import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

const regex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

const isUUID = (s: string) => {
  return regex.test(s || '')
}

const mutationFn = async (values: {
  name: string
  url: string
  read: boolean
  description: string | null
  tagIds: { id: string; name: string }[]
}) => {
  const tagNames = values.tagIds
    .filter((t) => !isUUID(t.id))
    .map((t) => ({ name: t.name }))
  const { data: newTags } = await supabase
    .from('tags')
    .insert(tagNames)
    .throwOnError()
    .select()

  const { data, error } = await supabase
    .from('bookmarks')
    .insert({
      name: values.name,
      url: values.url,
      read: values.read,
      description: values.description,
    })
    .throwOnError()
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  const bookmark = data

  const existingTags = values.tagIds.filter((t) => isUUID(t.id))
  const relations = [...(newTags || []), ...existingTags].map((r) => ({
    tag_id: r.id,
    bookmark_id: bookmark.id,
  }))

  await supabase
    .from('bookmarks_tags')
    .delete()
    .eq('bookmark_id', bookmark.id)
    .throwOnError()
  if (relations.length > 0) {
    await supabase.from('bookmarks_tags').insert(relations).throwOnError()
  }
}

export const useCreateBookmarkMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] })
    },
  })
}
