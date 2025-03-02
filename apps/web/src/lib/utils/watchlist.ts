import { type Database } from '@/src/lib/database.types'
import { SupabaseClient } from '@supabase/supabase-js'

type WatchlistEntry = Database['public']['Tables']['watchlist']['Row']

/**
 * Add a bookmark to user's watchlist
 */
export async function addToWatchlist(
  supabase: SupabaseClient<Database>,
  bookmarkId: string,
): Promise<WatchlistEntry | null> {
  try {
    const { data, error } = await supabase.from('watchlist').insert({ bookmark_id: bookmarkId }).select().single()

    if (error) {
      console.error('Error adding to watchlist:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error in addToWatchlist:', error)
    return null
  }
}

/**
 * Remove a bookmark from user's watchlist
 */
export async function removeFromWatchlist(supabase: SupabaseClient<Database>, bookmarkId: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('watchlist').delete().eq('bookmark_id', bookmarkId)

    if (error) {
      console.error('Error removing from watchlist:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error in removeFromWatchlist:', error)
    return false
  }
}

/**
 * Check if a bookmark is in user's watchlist
 */
export async function isInWatchlist(supabase: SupabaseClient<Database>, bookmarkId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase.from('watchlist').select('id').eq('bookmark_id', bookmarkId).maybeSingle()

    if (error) {
      console.error('Error checking watchlist:', error)
      return false
    }

    return !!data
  } catch (error) {
    console.error('Error in isInWatchlist:', error)
    return false
  }
}
