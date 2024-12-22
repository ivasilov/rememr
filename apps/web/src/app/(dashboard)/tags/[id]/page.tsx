'use server'
import { Bookmarks } from '@/src/components/bookmarks'
import { MainContentLayout } from '@/src/components/main-content-layout'
import { checkAuthentication } from '@/src/lib/supabase'
import { createClient } from '@/src/utils/supabase/server'
import { Tag } from 'lucide-react'
import { cookies } from 'next/headers'
import { SinglePageError } from './components/error'
import { TagActions } from './tag-actions'

const TagPage = async ({ params: { id } }: { params: { id: string } }) => {
  await checkAuthentication(`/tags/${id}`)

  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
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
        <Bookmarks tags={[tag.id]} />
      </MainContentLayout>
    )
  }

  return <SinglePageError />
}

export default TagPage
