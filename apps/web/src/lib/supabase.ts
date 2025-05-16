'use server'

import { Database } from './database.types'

export type BookmarkType = Database['public']['Tables']['bookmarks']['Row']
export type TagType = Database['public']['Tables']['tags']['Row']
