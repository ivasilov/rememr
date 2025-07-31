'use server'
import { MainContentLayout } from '@/components/main-content-layout'
import { getQueryClient } from '@/lib/react-query-client'
import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import { Inbox } from 'lucide-react'
import { UnreadBookmarks } from './unread-bookmarks'

const BookmarksPage = async () => {
  const queryClient = getQueryClient()

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MainContentLayout>
        <div className="flex pr-2">
          <div className="flex items-center gap-2">
            <Inbox size={20} className="pt-1" />
            <h1 className="text-foreground flex-1 text-3xl font-semibold">Unread bookmarks</h1>
          </div>
        </div>
        <UnreadBookmarks />
      </MainContentLayout>
    </HydrationBoundary>
  )
}

export default BookmarksPage
