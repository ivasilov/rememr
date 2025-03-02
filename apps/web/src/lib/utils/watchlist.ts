import { type Database } from '@/src/lib/database.types'
import { createClient } from '@/src/utils/supabase/client'

const supabase = createClient()

type WatchlistEntry = Database['public']['Tables']['watchlist']['Row']

/**
 * Add a bookmark to user's watchlist
 */
export async function addToWatchlist(bookmarkId: string): Promise<WatchlistEntry | null> {
  try {
    const { data: user } = await supabase.auth.getUser()
    if (!user.user) return null

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
export async function removeFromWatchlist(bookmarkId: string): Promise<boolean> {
  try {
    const { data: user } = await supabase.auth.getUser()
    if (!user.user) return false

    const { error } = await supabase.from('watchlist').delete().match({
      bookmark_id: bookmarkId,
      user_id: user.user.id,
    })

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
export async function isInWatchlist(bookmarkId: string): Promise<boolean> {
  try {
    const { data: user } = await supabase.auth.getUser()
    if (!user.user) return false

    const { data, error } = await supabase
      .from('watchlist')
      .select('id')
      .match({
        bookmark_id: bookmarkId,
        user_id: user.user.id,
      })
      .maybeSingle()

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
