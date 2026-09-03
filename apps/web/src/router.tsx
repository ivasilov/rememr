import { createRouter } from '@tanstack/react-router'
import { getBasePath } from '@/lib/base-path'
import { createQueryClient } from '@/lib/react-query-client'
import { routeTree } from './routeTree.gen'

export function getRouter() {
  const queryClient = createQueryClient()

  const router = createRouter({
    routeTree,
    context: { queryClient },
    basepath: getBasePath() || '/',
    defaultPreload: 'intent',
    scrollRestoration: true,
  })

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
