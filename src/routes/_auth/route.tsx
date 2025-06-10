import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import * as React from 'react'
import Sidebar from '@/components/sidebar.tsx'
import { useAuthStore } from '@/stores/authStore.ts'

export const Route = createFileRoute('/_auth')({
  component: AppLayoutComponent,
  beforeLoad: ({ location }) => {
    //const auth = await context.auth
    const user = useAuthStore.getState().user
    //if (!auth.isAuthenticated) {
    if (!user) {
      console.log('USER IS NOT LOGGED IN!')
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      })
    }
  },
})

function AppLayoutComponent() {
  const [isSidebarOpen, _] = React.useState(true)
  return (
    <div className="h-full grid app-grid">
      <Sidebar isVisible={isSidebarOpen} />
      <main className="[grid-area:content] sm:mt-6 max-h-screen overflow-hidden">
        <Outlet />
      </main>
    </div>
  )
}
