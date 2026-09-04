import { eq, useLiveQuery } from '@tanstack/react-db'
import { createFileRoute } from '@tanstack/react-router'
import { FileStack } from 'lucide-react'
import { SessionBookmarks } from '@/app/(dashboard)/sessions/[id]/session-bookmarks'
import { Loading } from '@/components/loading'
import { MainContentLayout } from '@/components/main-content-layout'
import { sessions } from '@/lib/database'

export const Route = createFileRoute('/_authenticated/sessions/$id')({
  component: SessionPage,
})

function SessionPage() {
  const { id } = Route.useParams()
  const {
    data: session,
    isLoading,
    isError,
  } = useLiveQuery(
    (query) =>
      query
        .from({ session: sessions })
        .where(({ session }) => eq(session.id, id))
        .select(({ session }) => ({ ...session }))
        .findOne(),
    [id]
  )

  if (isLoading) {
    return <Loading />
  }

  if (isError || !session) {
    return <DetailError />
  }

  return (
    <MainContentLayout>
      <div className="flex pr-2">
        <div className="flex items-center gap-2">
          <FileStack className="pt-1" size={20} />
          <h1 className="flex-1 font-semibold text-3xl text-foreground">
            {session.name}
          </h1>
        </div>
      </div>
      <SessionBookmarks sessionId={session.id} />
    </MainContentLayout>
  )
}

function DetailError() {
  return (
    <div className="flex h-full items-center justify-center">
      <p className="text-muted-foreground">The session could not be found.</p>
    </div>
  )
}
