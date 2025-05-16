'use server'
import { MainContentLayout } from '@/components/main-content-layout'
import { checkAuthentication } from '@/lib/supabase'
import { createClient } from '@/lib/supabase/server'
import { FileStack } from 'lucide-react'
import { SinglePageError } from './components/error'
import { SessionBookmarks } from './session-bookmarks'

const SessionPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params
  await checkAuthentication(`/sessions/${id}`)

  const supabase = await createClient()
  const { data, error } = await supabase.from('sessions').select('*').eq('id', id)
  const session = data![0]
  if (error) {
    return <SinglePageError />
  }

  if (session) {
    return (
      <MainContentLayout>
        <div className="flex">
          <div className="flex h-full flex-1 items-center gap-2">
            <FileStack size={20} className="pt-1" />
            <h1 className="text-foreground flex-1 text-3xl font-semibold">{session.name}</h1>
          </div>
        </div>
        <SessionBookmarks sessionId={session.id} />
      </MainContentLayout>
    )
  }

  return <SinglePageError />
}

export default SessionPage
