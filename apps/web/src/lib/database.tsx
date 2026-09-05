import { supabaseCollectionOptions } from '@supabase-labs/tanstack-db'
import { createCollection } from '@tanstack/react-db'

import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'

const bookmarkSchema = z.object({
  created_at: z.string(),
  description: z.string().nullable(),
  id: z.string().uuid(),
  name: z.string(),
  read: z.boolean(),
  updated_at: z.string(),
  url: z.string(),
  user_id: z.string().uuid(),
})

const tagSchema = z.object({
  created_at: z.string(),
  id: z.string().uuid(),
  name: z.string(),
  updated_at: z.string(),
  user_id: z.string().uuid(),
})

const sessionSchema = z.object({
  created_at: z.string(),
  id: z.string().uuid(),
  name: z.string().nullable(),
  user_id: z.string().uuid().nullable(),
})

const bookmarkTagSchema = z.object({
  bookmark_id: z.string().uuid(),
  tag_id: z.string().uuid(),
})

const bookmarkSessionSchema = z.object({
  bookmark_id: z.string().uuid(),
  session_id: z.string().uuid(),
})

const supabase = createClient()

export const bookmarks = createCollection(
  supabaseCollectionOptions({
    tableName: 'bookmarks',
    schema: bookmarkSchema,
    keys: ['id'],
    supabase,
    realtime: true,
  })
)
export const tags = createCollection(
  supabaseCollectionOptions({
    tableName: 'tags',
    schema: tagSchema,
    keys: ['id'],
    supabase,
    realtime: true,
  })
)
export const sessions = createCollection(
  supabaseCollectionOptions({
    tableName: 'sessions',
    schema: sessionSchema,
    keys: ['id'],
    supabase,
    realtime: true,
  })
)
export const bookmarkTags = createCollection(
  supabaseCollectionOptions({
    tableName: 'bookmarks_tags',
    schema: bookmarkTagSchema,
    keys: ['bookmark_id', 'tag_id'],
    supabase,
    realtime: true,
  })
)
export const bookmarkSessions = createCollection(
  supabaseCollectionOptions({
    tableName: 'bookmarks_sessions',
    schema: bookmarkSessionSchema,
    keys: ['bookmark_id', 'session_id'],
    supabase,
    realtime: true,
  })
)

for (const collection of [
  bookmarks,
  tags,
  sessions,
  bookmarkTags,
  bookmarkSessions,
]) {
  collection.startSyncImmediate()
}

export type RememrCollections = {
  bookmarks: typeof bookmarks
  tags: typeof tags
  sessions: typeof sessions
  bookmarkTags: typeof bookmarkTags
  bookmarkSessions: typeof bookmarkSessions
}

export type Bookmark = z.infer<typeof bookmarkSchema>
export type Tag = z.infer<typeof tagSchema>
export type Session = z.infer<typeof sessionSchema>
export type BookmarkRowModel = Bookmark & {
  tags: Pick<Tag, 'id' | 'name'>[]
}
