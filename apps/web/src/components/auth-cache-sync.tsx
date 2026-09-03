import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { useEffect, useRef } from 'react'
import { currentUserQueryKey } from '@/lib/auth'
import { createClient } from '@/lib/supabase/client'

export function AuthCacheSync() {
  const queryClient = useQueryClient()
  const router = useRouter()
  const userIdRef = useRef<string | undefined>(undefined)

  useEffect(() => {
    const {
      data: { subscription },
    } = createClient().auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        userIdRef.current = undefined
        queryClient.clear()
        router.navigate({ to: '/auth/login', replace: true })
        return
      }

      if (session?.user) {
        if (userIdRef.current && userIdRef.current !== session.user.id) {
          queryClient.clear()
        }

        userIdRef.current = session.user.id
        queryClient.setQueryData(currentUserQueryKey, session.user)
      }
    })

    return () => subscription.unsubscribe()
  }, [queryClient, router])

  return null
}
