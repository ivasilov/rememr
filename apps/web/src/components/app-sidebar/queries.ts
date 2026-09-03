import { queryOptions } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

export const sidebarTagsQueryOptions = (userId: string) =>
  queryOptions({
    queryKey: ['tags', 'sidebar', userId],
    queryFn: async () => {
      const { data } = await createClient()
        .from('bookmarks_tags')
        .select('...tags(id,name), bookmark_id.count()')
        .eq('tags.user_id', userId)
        .throwOnError()

      return data.sort((a, b) => a.name.localeCompare(b.name))
    },
  })

export const sidebarSessionsQueryOptions = (userId: string) =>
  queryOptions({
    queryKey: ['sessions', 'sidebar', userId],
    queryFn: async () => {
      const { data } = await createClient()
        .from('bookmarks_sessions')
        .select('...sessions(id,name), bookmark_id.count()')
        .eq('sessions.user_id', userId)
        .order('created_at', {
          ascending: false,
          referencedTable: 'sessions',
        })
        .throwOnError()

      return data
    },
  })
