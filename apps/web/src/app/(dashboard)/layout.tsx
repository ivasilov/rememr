import { SheetSideLink, SideLink } from '@/src/components/layout/PageLink'
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@rememr/ui'
import { Book, CircleUser, Home, Menu } from 'lucide-react'
import Link from 'next/link'
import { PropsWithChildren, Suspense } from 'react'
import { LayoutDropdownMenuContent } from './LayoutDropdownMenuContent'
import SearchInput from './search-input'

export default function RootLayout({ children }: PropsWithChildren<{}>) {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="bg-muted/40 hidden border-r md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              {/* <Logo className="h-6 w-6" /> */}
              <span className="">rememr</span>
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <SideLink href="/bookmarks">
                <Home className="h-4 w-4" />
                All bookmarks
              </SideLink>
              <SideLink href="/bookmarks/unread">
                <Book className="h-4 w-4" />
                Reading list
              </SideLink>
            </nav>
          </div>
        </div>
      </div>
      <div className="flex max-h-screen flex-col">
        <header className="bg-muted/40 flex h-14 items-center gap-4 border-b px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
                  {/* <Logo className="h-6 w-6" /> */}
                  <span className="sr-only">rememr</span>
                </Link>
                <SheetSideLink href="/bookmarks">
                  <Home className="h-5 w-5" />
                  All bookmarks
                </SheetSideLink>
                <SheetSideLink href="/bookmarks/unread">
                  <Book className="h-5 w-5" />
                  Reading list
                </SheetSideLink>
              </nav>
            </SheetContent>
          </Sheet>
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
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
