import { createFileRoute } from '@tanstack/react-router'
import { Home } from 'lucide-react'
import { AllBookmarks } from '@/app/(dashboard)/bookmarks/all-bookmarks'
import { MainContentLayout } from '@/components/main-content-layout'

export const Route = createFileRoute('/_authenticated/bookmarks/')({
  component: BookmarksPage,
})

function BookmarksPage() {
  return (
    <MainContentLayout>
      <div className="flex items-center gap-2 pr-2">
        <Home className="pt-1" size={20} />
        <h1 className="flex-1 font-semibold text-3xl text-foreground">
          All bookmarks
        </h1>
      </div>
      <AllBookmarks />
    </MainContentLayout>
  )
}
