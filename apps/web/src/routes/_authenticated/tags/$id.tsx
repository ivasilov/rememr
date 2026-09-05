import { eq, useLiveQuery } from '@tanstack/react-db'
import { createFileRoute } from '@tanstack/react-router'
import { Tag } from 'lucide-react'
import { TagActions } from '@/app/(dashboard)/tags/[id]/tag-actions'
import { TagBookmarks } from '@/app/(dashboard)/tags/[id]/tag-bookmarks'
import { Loading } from '@/components/loading'
import { MainContentLayout } from '@/components/main-content-layout'
import { tags } from '@/lib/database'

export const Route = createFileRoute('/_authenticated/tags/$id')({
  component: TagPage,
})

function TagPage() {
  const { id } = Route.useParams()
  const {
    data: tag,
    isLoading,
    isError,
  } = useLiveQuery(
    (query) =>
      query
        .from({ tag: tags })
        .where(({ tag }) => eq(tag.id, id))
        .select(({ tag }) => ({ ...tag }))
        .findOne(),
    [id]
  )

  if (isLoading) {
    return <Loading />
  }

  if (isError || !tag) {
    return <DetailError />
  }

  return (
    <MainContentLayout>
      <div className="flex items-center justify-between pr-2">
        <div className="flex items-center gap-2">
          <Tag className="pt-1" size={20} />
          <h1 className="flex-1 font-semibold text-3xl text-foreground">
            {tag.name}
          </h1>
        </div>
        <TagActions tag={tag} />
      </div>
      <TagBookmarks tags={[tag.id]} />
    </MainContentLayout>
  )
}

function DetailError() {
  return (
    <div className="flex h-full items-center justify-center">
      <p className="text-muted-foreground">The tag could not be found.</p>
    </div>
  )
}
