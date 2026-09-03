import { Card, CardContent, CardHeader, CardTitle } from '@rememr/ui'
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

export const Route = createFileRoute('/auth/error')({
  validateSearch: z.object({
    error: z.string().optional(),
  }),
  component: AuthErrorPage,
})

function AuthErrorPage() {
  const { error } = Route.useSearch()

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                Sorry, something went wrong.
              </CardTitle>
            </CardHeader>
            <CardContent>
              {error ? (
                <p className="text-muted-foreground text-sm">
                  Code error: {error}
                </p>
              ) : (
                <p className="text-muted-foreground text-sm">
                  An unspecified error occurred.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
