import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  SidebarProvider,
  SidebarTrigger,
} from '@rememr/ui'
import type { User } from '@supabase/supabase-js'
import { createFileRoute, Link, Outlet, redirect } from '@tanstack/react-router'
import { CircleUser } from 'lucide-react'
import { z } from 'zod'
import { LayoutDropdownMenuContent } from '@/app/(dashboard)/layout-dropdown-menu-content'
import { SearchInput } from '@/app/(dashboard)/search-input'
import { AppSidebar } from '@/components/app-sidebar'
import { Loading } from '@/components/loading'
import { currentUserQueryOptions } from '@/lib/auth'

export const Route = createFileRoute('/_authenticated')({
  ssr: false,
  validateSearch: z.object({
    q: z.string().optional(),
  }),
  beforeLoad: async ({ context, location }) => {
    let user: User | null = null

    try {
      user = await context.queryClient.ensureQueryData(
        currentUserQueryOptions()
      )
    } catch {
      context.queryClient.removeQueries({ queryKey: ['auth'] })
    }

    if (!user) {
      throw redirect({
        to: '/auth/login',
        search: { returnTo: location.href },
        replace: true,
      })
    }

    return { user }
  },
  pendingComponent: () => (
    <div className="h-screen">
      <Loading />
    </div>
  ),
  component: AuthenticatedLayout,
})

function AuthenticatedLayout() {
  const { user } = Route.useRouteContext()
  const { q } = Route.useSearch()
  const navigate = Route.useNavigate()

  const onSearchChange = (value: string | undefined) => {
    navigate({
      search: (previous) => ({ ...previous, q: value }),
      resetScroll: false,
    })
  }

  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <div className="grid min-h-screen w-full">
        <div className="flex max-h-screen flex-col">
          <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 shadow-md lg:h-[60px] lg:px-6">
            <SidebarTrigger />
            <SearchInput
              onSearchChange={onSearchChange}
              searchQuery={q}
              user={user}
            />
            <Button asChild>
              <Link to="/bookmarks/new">Add new bookmark</Link>
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
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
