'use server'
import { NewBookmarkComponent } from './component'

const NewBookmarkPage = async () => {
  return (
    <div className="flex justify-center pt-8">
      <NewBookmarkComponent />
    </div>
  )
}

export default NewBookmarkPage
