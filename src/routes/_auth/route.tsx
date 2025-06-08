import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth')({
  component: AppLayoutComponent,
  beforeLoad: async ({ context, location }) => {
    const auth = await context.auth
    if (!auth.isAuthenticated) {
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
  return (
    <div>
      <h1>Hello</h1>
      <Outlet />
    </div>
  )
}
