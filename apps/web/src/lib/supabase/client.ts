import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/lib/database.types'

let client: ReturnType<typeof createBrowserClient<Database>> | undefined

export function createClient() {
  if (!client) {
    client = createBrowserClient<Database>(
      import.meta.env.VITE_SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
    )
  }

  return client
}
