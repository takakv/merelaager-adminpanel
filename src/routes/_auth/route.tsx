import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

import { useAuthStore, type User } from '@/stores/authStore.ts'

import { Toaster } from '@/components/ui/sonner.tsx'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar.tsx'

import { AppSidebar } from '@/components/app-sidebar.tsx'

import { Route as loginRoute } from '../login.tsx'

export const Route = createFileRoute('/_auth')({
  component: AppLayoutComponent,
  beforeLoad: ({ location }) => {
    //const auth = await context.auth
    const user = useAuthStore.getState().user
    //if (!auth.isAuthenticated) {
    if (!user) {
      console.log('USER IS NOT LOGGED IN!')
      throw redirect({
        to: loginRoute.to,
        search: {
          redirect: location.href,
        },
      })
    }
  },
})

function AppLayoutComponent() {
  const user = useAuthStore.getState().user as User
  // const [isSidebarOpen, _] = React.useState(true)

  return (
    <div className="h-full">
      <Toaster position="top-center" />
      {/*<Sidebar isVisible={isSidebarOpen} />*/}
      <SidebarProvider>
        <AppSidebar />
        <main className="w-full max-h-screen overflow-hidden">
          <header className="sticky top-0 bg-white flex h-16 items-center justify-between px-6">
            {/*<Button asChild className="h-10 w-10" variant="ghost">*/}
            <SidebarTrigger />
            {/*</Button>*/}
            <div>{user.nickname || user.nickname}</div>
          </header>
          <Outlet />
        </main>
      </SidebarProvider>
    </div>
  )
}
