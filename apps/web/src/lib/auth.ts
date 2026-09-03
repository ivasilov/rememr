import { queryOptions } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

export const currentUserQueryKey = ['auth', 'user'] as const

export const currentUserQueryOptions = () =>
  queryOptions({
    queryKey: currentUserQueryKey,
    queryFn: async () => {
      const {
        data: { user },
        error,
      } = await createClient().auth.getUser()

      if (error && error.name !== 'AuthSessionMissingError') {
        throw error
      }

      return user
    },
    staleTime: 60_000,
  })
