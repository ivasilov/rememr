import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

const mutationFn = async ({ id }: { id: string }) => {
  await supabase
    .from('bookmarks_tags')
    .delete()
    .eq('bookmark_id', id)
    .throwOnError()
  await supabase.from('bookmarks').delete().eq('id', id).throwOnError()
}

export const useDeleteBookmarkMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn,
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ['bookmarks'] }),
        queryClient.invalidateQueries({ queryKey: ['sessions'] }),
        queryClient.invalidateQueries({ queryKey: ['tags'] }),
      ]),
  })
}
