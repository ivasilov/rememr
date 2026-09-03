import { createFileRoute } from '@tanstack/react-router'
import { Inbox } from 'lucide-react'
import { UnreadBookmarks } from '@/app/(dashboard)/bookmarks/unread/unread-bookmarks'
import { MainContentLayout } from '@/components/main-content-layout'

export const Route = createFileRoute('/_authenticated/bookmarks/unread')({
  component: UnreadBookmarksPage,
})

function UnreadBookmarksPage() {
  return (
    <MainContentLayout>
      <div className="flex pr-2">
        <div className="flex items-center gap-2">
          <Inbox className="pt-1" size={20} />
          <h1 className="flex-1 font-semibold text-3xl text-foreground">
            Unread bookmarks
          </h1>
        </div>
      </div>
      <UnreadBookmarks />
    </MainContentLayout>
  )
}
