import { bookmarks } from '@/lib/database'

export const deleteBookmark = async (id: string) => {
  await bookmarks.delete(id).isPersisted.promise
}
