import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { LoginForm } from '@/components/login-form'

export const Route = createFileRoute('/auth/login')({
  validateSearch: z.object({
    returnTo: z.string().optional(),
  }),
  component: LoginPage,
})

function LoginPage() {
  const searchParams = Route.useSearch()

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm searchParams={searchParams} />
      </div>
    </div>
  )
}
