import { AppSidebar } from '@/src/components/app-sidebar'
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  SidebarProvider,
  SidebarTrigger,
} from '@rememr/ui'
import { CircleUser } from 'lucide-react'
import Link from 'next/link'
import { PropsWithChildren, Suspense } from 'react'
import { LayoutDropdownMenuContent } from './LayoutDropdownMenuContent'
import { SearchInput } from './search-input'

export default async function RootLayout({ children }: PropsWithChildren<{}>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="grid min-h-screen w-full">
        <div className="flex max-h-screen flex-col">
          <header className="bg-muted/40 flex h-14 items-center gap-4 border-b px-4 shadow-md lg:h-[60px] lg:px-6">
            <SidebarTrigger />
            <Suspense>
              <SearchInput />
            </Suspense>
            <Button asChild>
              <Link href="/bookmarks/new">Add new bookmark</Link>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" className="rounded-full">
                  <CircleUser className="h-5 w-5" />
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <LayoutDropdownMenuContent />
              </DropdownMenuContent>
            </DropdownMenu>
          </header>
          <main className="bg-muted/40 flex-1 overflow-auto" style={{ scrollbarGutter: 'stable' }}>
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
