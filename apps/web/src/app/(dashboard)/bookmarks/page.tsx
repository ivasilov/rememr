'use server'
import { getQueryClient } from '@/src/lib/react-query-client'
import { createClient } from '@/src/utils/supabase/server'
import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import { cookies } from 'next/headers'
import { Bookmarks } from '../../../components/bookmarks'
import { checkAuthentication } from '../../../lib/supabase'
import { listBookmarksOptions } from './query-options'
import { searchParamsCache } from './searchParams'

const BookmarksPage = async ({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) => {
  await checkAuthentication('/bookmarks')

  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const values = searchParamsCache.parse(searchParams)
  const { q: searchQuery } = values

  const queryClient = getQueryClient()

  queryClient.prefetchQuery(listBookmarksOptions(supabase, false, searchQuery))

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Bookmarks className="container px-6 pt-8" />
    </HydrationBoundary>
  )
}

export default BookmarksPage
