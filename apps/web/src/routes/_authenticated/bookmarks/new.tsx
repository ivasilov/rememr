import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { NewBookmarkComponent } from '@/app/(dashboard)/bookmarks/new/component'

export const Route = createFileRoute('/_authenticated/bookmarks/new')({
  validateSearch: z.object({
    q: z.string().optional(),
    title: z.string().optional(),
    url: z.string().optional(),
  }),
  component: NewBookmarkPage,
})

function NewBookmarkPage() {
  const { title, url } = Route.useSearch()
  const { user } = Route.useRouteContext()

  return (
    <div className="flex justify-center pt-8">
      <NewBookmarkComponent title={title} url={url} userId={user.id} />
    </div>
  )
}
