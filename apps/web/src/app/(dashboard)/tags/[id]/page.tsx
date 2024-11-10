'use server'
import { Bookmarks } from '@/src/components/bookmarks'
import { Icon } from '@/src/components/icon'
import { checkAuthentication } from '@/src/lib/supabase'
import { createClient } from '@/src/utils/supabase/server'
import { faTag } from '@fortawesome/free-solid-svg-icons'
import { cookies } from 'next/headers'
import page from '../../bookmarks/page'
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
      <div className="container flex h-full flex-col pb-4">
        <div className="flex items-center py-4 pl-7">
          <Icon name={faTag} size="1x" className="pr-2" />
          <div className="flex-grow">
            <h1 className="text-foreground text-3xl font-semibold">{page.name}</h1>
          </div>
          <TagActions tag={tag} />
        </div>
        <Bookmarks tags={[tag.id]} />
      </div>
    )
  }

  return <SinglePageError />
}

export default TagPage
