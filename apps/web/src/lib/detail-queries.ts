import { queryOptions } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

export const tagDetailQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ['tags', 'detail', id],
    queryFn: async () => {
      const { data } = await createClient()
        .from('tags')
        .select('*, bookmarks (*)')
        .eq('id', id)
        .maybeSingle()
        .throwOnError()

      return data
    },
  })

export const sessionDetailQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ['sessions', 'detail', id],
    queryFn: async () => {
      const { data } = await createClient()
        .from('sessions')
        .select('*')
        .eq('id', id)
        .maybeSingle()
        .throwOnError()

      return data
    },
  })
