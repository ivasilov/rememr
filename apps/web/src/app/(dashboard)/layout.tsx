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
import { type PropsWithChildren, Suspense } from 'react'
import { AppSidebar } from '@/components/app-sidebar'
import { LayoutDropdownMenuContent } from './layout-dropdown-menu-content'
import { SearchInput } from './search-input'

export default function RootLayout({ children }: PropsWithChildren<void>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="grid min-h-screen w-full">
        <div className="flex max-h-screen flex-col">
          <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 shadow-md lg:h-[60px] lg:px-6">
            <SidebarTrigger />
            <Suspense>
              <SearchInput />
            </Suspense>
            <Button asChild>
              <Link href="/bookmarks/new">Add new bookmark</Link>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  className="rounded-full"
                  size="icon"
                  variant="secondary"
                >
                  <CircleUser className="h-5 w-5" />
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <LayoutDropdownMenuContent />
              </DropdownMenuContent>
            </DropdownMenu>
          </header>
          <main
            className="flex-1 overflow-auto bg-muted/40"
            style={{ scrollbarGutter: 'stable' }}
          >
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
