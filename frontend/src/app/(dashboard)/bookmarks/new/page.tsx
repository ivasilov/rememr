'use server'
import { checkAuthentication } from '@/src/lib/supabase'
import { NewBookmarkComponent } from './component'

const NewBookmarkPage = async () => {
  await checkAuthentication('/bookmarks/new')

  return (
    <div className="flex justify-center pt-8">
      <NewBookmarkComponent />
    </div>
  )
}

export default NewBookmarkPage
