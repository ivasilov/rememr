import { supabaseCollectionOptions } from '@supabase-labs/tanstack-db'
import { createCollection, eq, useLiveQuery } from '@tanstack/react-db'
import type { QueryClient } from '@tanstack/react-query'
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
} from 'react'
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

const EMPTY_UUID = '00000000-0000-0000-0000-000000000000'

const createCollections = (queryClient: QueryClient) => {
  const supabase = createClient()

  return {
    bookmarks: createCollection(
      supabaseCollectionOptions({
        tableName: 'bookmarks',
        schema: bookmarkSchema,
        keys: ['id'],
        supabase,
        queryClient,
        realtime: true,
      })
    ),
    tags: createCollection(
      supabaseCollectionOptions({
        tableName: 'tags',
        schema: tagSchema,
        keys: ['id'],
        supabase,
        queryClient,
        realtime: true,
      })
    ),
    sessions: createCollection(
      supabaseCollectionOptions({
        tableName: 'sessions',
        schema: sessionSchema,
        keys: ['id'],
        supabase,
        queryClient,
        realtime: true,
      })
    ),
    bookmarkTags: createCollection(
      supabaseCollectionOptions({
        tableName: 'bookmarks_tags',
        schema: bookmarkTagSchema,
        keys: ['bookmark_id', 'tag_id'],
        supabase,
        queryClient,
        realtime: true,
      })
    ),
    bookmarkSessions: createCollection(
      supabaseCollectionOptions({
        tableName: 'bookmarks_sessions',
        schema: bookmarkSessionSchema,
        keys: ['bookmark_id', 'session_id'],
        supabase,
        queryClient,
        realtime: true,
      })
    ),
  }
}

export type RememrCollections = ReturnType<typeof createCollections>
type RememrDatabase = RememrCollections & { userId: string }

const DatabaseContext = createContext<RememrDatabase | null>(null)

export const DatabaseProvider = ({
  children,
  queryClient,
  userId,
}: {
  children: ReactNode
  queryClient: QueryClient
  userId: string
}) => {
  const database = useMemo(
    () => ({ ...createCollections(queryClient), userId }),
    [queryClient, userId]
  )

  useEffect(
    () => () => {
      const { userId: _, ...collections } = database

      for (const collection of Object.values(collections)) {
        collection.cleanup()
      }
    },
    [database]
  )

  return (
    <DatabaseContext.Provider value={database}>
      <InitializeCollections database={database} />
      {children}
    </DatabaseContext.Provider>
  )
}

const InitializeCollections = ({ database }: { database: RememrDatabase }) => {
  // The experimental adapter needs an active on-demand query before collection
  // mutations or manual refetches can write into its local sync context.
  useLiveQuery(
    (query) =>
      query
        .from({ bookmark: database.bookmarks })
        .where(({ bookmark }) => eq(bookmark.id, EMPTY_UUID)),
    [database.bookmarks]
  )
  useLiveQuery(
    (query) =>
      query
        .from({ tag: database.tags })
        .where(({ tag }) => eq(tag.id, EMPTY_UUID)),
    [database.tags]
  )
  useLiveQuery(
    (query) =>
      query
        .from({ session: database.sessions })
        .where(({ session }) => eq(session.id, EMPTY_UUID)),
    [database.sessions]
  )
  useLiveQuery(
    (query) =>
      query
        .from({ bookmarkTag: database.bookmarkTags })
        .where(({ bookmarkTag }) => eq(bookmarkTag.bookmark_id, EMPTY_UUID)),
    [database.bookmarkTags]
  )
  useLiveQuery(
    (query) =>
      query
        .from({ bookmarkSession: database.bookmarkSessions })
        .where(({ bookmarkSession }) =>
          eq(bookmarkSession.bookmark_id, EMPTY_UUID)
        ),
    [database.bookmarkSessions]
  )

  return null
}

export const useDatabase = () => {
  const collections = useContext(DatabaseContext)

  if (!collections) {
    throw new Error('useDatabase must be used within DatabaseProvider')
  }

  return collections
}

export type Bookmark = z.infer<typeof bookmarkSchema>
export type Tag = z.infer<typeof tagSchema>
export type Session = z.infer<typeof sessionSchema>
export type BookmarkRowModel = Bookmark & {
  tags: Pick<Tag, 'id' | 'name'>[]
}

export type BookmarkListResult = {
  bookmarks: Bookmark[]
  fetchMore: () => void
  hasMore: boolean
  isError: boolean
  isFetchingMore: boolean
  isLoading: boolean
}
