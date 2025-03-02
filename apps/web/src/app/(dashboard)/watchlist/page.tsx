'use server'

import { MainContentLayout } from '@/src/components/main-content-layout'
import { getQueryClient } from '@/src/lib/react-query-client'
import { checkAuthentication } from '@/src/lib/supabase'
import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import { Video } from 'lucide-react'
import { WatchlistBookmarks } from './watchlist-bookmarks'

const WatchlistPage = async () => {
  await checkAuthentication('/watchlist')
  const queryClient = getQueryClient()

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MainContentLayout>
        <div className="flex">
          <div className="flex h-full flex-1 items-center gap-2">
            <Video size={20} className="pt-1" />
            <h1 className="text-foreground flex-1 text-3xl font-semibold">Watchlist</h1>
          </div>
        </div>
        <WatchlistBookmarks />
      </MainContentLayout>
    </HydrationBoundary>
  )
}

export default WatchlistPage
