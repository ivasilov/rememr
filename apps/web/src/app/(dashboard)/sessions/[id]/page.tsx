'use server'
import { FileStack } from 'lucide-react'
import { MainContentLayout } from '@/components/main-content-layout'
import { createClient } from '@/lib/supabase/server'
import { SinglePageError } from './components/error'
import { SessionBookmarks } from './session-bookmarks'

const SessionPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('id', id)
  const session = data![0]
  if (error) {
    return <SinglePageError />
  }

  if (session) {
    return (
      <MainContentLayout>
        <div className="flex pr-2">
          <div className="flex items-center gap-2">
            <FileStack className="pt-1" size={20} />
            <h1 className="flex-1 font-semibold text-3xl text-foreground">
              {session.name}
            </h1>
          </div>
        </div>
        <SessionBookmarks sessionId={session.id} />
      </MainContentLayout>
    )
  }

  return <SinglePageError />
}

export default SessionPage
