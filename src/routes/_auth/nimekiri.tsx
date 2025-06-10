import { createFileRoute, redirect } from '@tanstack/react-router'

import { Route as registrationRoute } from './nimekiri.$shiftNr.tsx'

import { useAuthStore, type User } from '@/stores/authStore.ts'

export const Route = createFileRoute('/_auth/nimekiri')({
  loader: () => {
    // This is stupid but necessary due to Tanstack Router's routing.
    // Without this, and infinite loop will be created, because
    // /nimekiri/ is always matched before /nimekiri/:shiftNr, even
    // when visiting /nimekiri/:shiftNr.
    // https://github.com/TanStack/router/issues/2142#issuecomment-2295518011
    const shouldRedirect = [`/nimekiri`, `/nimekiri/`].includes(
      location.pathname,
    )
    if (!shouldRedirect) return

    // This is a protected route so we know that the user exists.
    const user = useAuthStore.getState().user as User
    throw redirect({
      to: registrationRoute.to,
      params: { shiftNr: `${user.currentShift}` },
    })
  },
})
