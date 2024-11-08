import { Bookmarks } from '@/src/components/bookmarks'
import { Icon } from '@/src/components/icon'
import { BookmarkType } from '@/src/lib/supabase'
import { faTag } from '@fortawesome/free-solid-svg-icons'

export const ReadOnlyPage = (props: { page: { id: string; name: string; bookmarks: BookmarkType[] } }) => {
  const page = props.page

  return (
    <div className="container flex h-full flex-col pb-4">
      <div className="flex items-center py-4 pl-7">
        <Icon name={faTag} size="1x" className="pr-2" />
        <div className="flex-grow">
          <h1 className="text-3xl font-semibold text-gray-900">{page.name}</h1>
        </div>
      </div>
      <Bookmarks tags={[page.id]} />
    </div>
  )
}
