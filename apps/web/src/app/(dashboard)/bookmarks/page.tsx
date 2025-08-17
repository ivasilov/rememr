'use server'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { Home } from 'lucide-react'
import { MainContentLayout } from '@/components/main-content-layout'
import { getQueryClient } from '@/lib/react-query-client'
import { AllBookmarks } from './all-bookmarks'

const BookmarksPage = () => {
  const queryClient = getQueryClient()

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MainContentLayout>
        <div className="flex items-center gap-2 pr-2">
          <Home className="pt-1" size={20} />
          <h1 className="flex-1 font-semibold text-3xl text-foreground">
            All bookmarks
          </h1>
        </div>
        <AllBookmarks />
      </MainContentLayout>
    </HydrationBoundary>
  )
}

export default BookmarksPage
