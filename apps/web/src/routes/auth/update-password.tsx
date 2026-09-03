import { createFileRoute } from '@tanstack/react-router'
import { UpdatePasswordForm } from '@/components/update-password-form'

export const Route = createFileRoute('/auth/update-password')({
  component: UpdatePasswordPage,
})

function UpdatePasswordPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <UpdatePasswordForm />
      </div>
    </div>
  )
}
