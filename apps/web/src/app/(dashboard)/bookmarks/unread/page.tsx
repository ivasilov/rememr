'use server'
import { Bookmarks } from '@/src/components/bookmarks'
import { getQueryClient } from '@/src/lib/react-query-client'
import { checkAuthentication } from '@/src/lib/supabase'
import { createClient } from '@/src/utils/supabase/server'
import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import { cookies } from 'next/headers'
import { listBookmarksOptions } from '../query-options'
import { searchParamsCache } from '../searchParams'

const BookmarksPage = async ({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) => {
  await checkAuthentication('/bookmarks/unread')

  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const values = searchParamsCache.parse(searchParams)
  const { q: searchQuery } = values

  const queryClient = getQueryClient()

  queryClient.prefetchQuery(listBookmarksOptions(supabase, true, searchQuery))

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Bookmarks unread={true} />
    </HydrationBoundary>
  )
}

export default BookmarksPage
