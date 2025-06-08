import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import Header from '../components/Header'
import type { AuthContext } from '@/auth.tsx'

interface RouterContext {
  auth: Promise<AuthContext>
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <>
      <Header />

      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
})
