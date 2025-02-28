'use server'
import { MainContentLayout } from '@/src/components/main-content-layout'
import { checkAuthentication } from '@/src/lib/supabase'
import { createClient } from '@/src/utils/supabase/server'
import { Tag } from 'lucide-react'
import { SinglePageError } from './components/error'
import { TagActions } from './tag-actions'
import { TagBookmarks } from './tag-bookmarks'

const TagPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params
  await checkAuthentication(`/tags/${id}`)

  const supabase = await createClient()
  const { data, error } = await supabase.from('tags').select('*, bookmarks (*)').eq('id', id)
  const tag = data![0]
  if (error) {
    return <SinglePageError />
  }

  if (tag) {
    return (
      <MainContentLayout>
        <div className="flex">
          <div className="flex h-full flex-1 items-center gap-2">
            <Tag size={20} className="pt-1" />
            <h1 className="text-foreground flex-1 text-3xl font-semibold">{tag.name}</h1>
          </div>

          <TagActions tag={tag} />
        </div>
        <TagBookmarks tags={[tag.id]} />
      </MainContentLayout>
    )
  }

  return <SinglePageError />
}

export default TagPage
