import { createFileRoute, redirect } from '@tanstack/react-router'
import { z } from 'zod'
import { Loading } from '@/components/loading'
import { getPublicPath, getSafeReturnTo } from '@/lib/base-path'
import { createClient } from '@/lib/supabase/client'

const emailOtpTypeSchema = z.enum([
  'email',
  'email_change',
  'invite',
  'magiclink',
  'recovery',
  'signup',
])

export const Route = createFileRoute('/auth/confirm')({
  ssr: false,
  validateSearch: z.object({
    token_hash: z.string().optional(),
    type: emailOtpTypeSchema.optional(),
    next: z.string().optional(),
  }),
  loaderDeps: ({ search }) => search,
  loader: async ({ deps }) => {
    if (!(deps.token_hash && deps.type)) {
      throw redirect({
        to: '/auth/error',
        search: { error: 'No token hash or type' },
      })
    }

    const { error } = await createClient().auth.verifyOtp({
      token_hash: deps.token_hash,
      type: deps.type,
    })

    if (error) {
      throw redirect({
        to: '/auth/error',
        search: { error: error.message },
      })
    }

    throw redirect({
      href: getPublicPath(getSafeReturnTo(deps.next)),
    })
  },
  pendingComponent: () => (
    <div className="h-screen">
      <Loading />
    </div>
  ),
})
