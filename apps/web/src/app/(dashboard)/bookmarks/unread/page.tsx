'use server'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { Inbox } from 'lucide-react'
import { MainContentLayout } from '@/components/main-content-layout'
import { getQueryClient } from '@/lib/react-query-client'
import { UnreadBookmarks } from './unread-bookmarks'

const BookmarksPage = async () => {
  const queryClient = getQueryClient()

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
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
    </HydrationBoundary>
  )
}

export default BookmarksPage
