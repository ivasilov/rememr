'use server'
import { Tag } from 'lucide-react'
import { MainContentLayout } from '@/components/main-content-layout'
import { createClient } from '@/lib/supabase/server'
import { SinglePageError } from './components/error'
import { TagActions } from './tag-actions'
import { TagBookmarks } from './tag-bookmarks'

const TagPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('tags')
    .select('*, bookmarks (*)')
    .eq('id', id)
  const tag = data![0]
  if (error) {
    return <SinglePageError />
  }

  if (tag) {
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

  return <SinglePageError />
}

export default TagPage
