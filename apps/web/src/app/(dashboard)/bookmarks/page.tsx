'use server'
import { MainContentLayout } from '@/src/components/main-content-layout'
import { getQueryClient } from '@/src/lib/react-query-client'
import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import { Home } from 'lucide-react'
import { checkAuthentication } from '../../../lib/supabase'
import { AllBookmarks } from './all-bookmarks'

const BookmarksPage = async () => {
  await checkAuthentication('/bookmarks')

  const queryClient = getQueryClient()

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MainContentLayout>
        <div className="flex h-full flex-1 items-center gap-2">
          <Home size={20} className="pt-1" />
          <h1 className="text-foreground flex-1 text-3xl font-semibold">All bookmarks</h1>
        </div>
        <AllBookmarks />
      </MainContentLayout>
    </HydrationBoundary>
  )
}

export default BookmarksPage
