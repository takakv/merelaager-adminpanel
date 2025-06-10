import {
  createFileRoute,
  redirect,
  useRouter,
  useRouterState,
} from '@tanstack/react-router'
import * as React from 'react'
import { useAuthStore } from '@/stores/authStore.ts'

const fallback = '/' as const

// export const Route = createFileRoute('/login')({
//   component: LoginComponent,
//   beforeLoad: async ({ context }) => {
//     const auth = await context.auth
//     console.log('login.tsx:', auth)
//     if (auth.isAuthenticated) {
//       console.log('login.tsx:', 'Redirecting to /')
//       throw redirect({ to: fallback })
//     }
//   },
// })

export const Route = createFileRoute('/login')({
  component: LoginComponent,
  beforeLoad: () => {
    const user = useAuthStore.getState().user
    if (user) {
      console.log('USER IS LOGGED IN!')
      console.log('login.tsx:', 'Redirecting to /')
      throw redirect({ to: fallback })
    }
  },
})

function LoginComponent() {
  const { login } = useAuthStore()
  const router = useRouter()
  const isLoading = useRouterState({ select: (s) => s.isLoading })
  const navigate = Route.useNavigate()
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const onFormSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true)
    try {
      evt.preventDefault()
      const data = new FormData(evt.currentTarget)
      const usernameValue = data.get('username')
      const passwordValue = data.get('password')

      if (!usernameValue || !passwordValue) return
      const username = usernameValue.toString()
      const password = passwordValue.toString()
      try {
        await login(username, password)
      } catch (err) {
        console.error(err)
      }

      await router.invalidate()
      console.log('navigating')
      navigate({ to: '/', replace: true })
    } catch (error) {
      console.error('Error logging in: ', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const isLoggingIn = isLoading || isSubmitting

  return (
    <div className="p-2 grid gap-2 place-items-center">
      <h3 className="text-xl">Login page</h3>
      <form className="mt-4 max-w-lg" onSubmit={onFormSubmit}>
        <fieldset disabled={isLoggingIn} className="w-full grid gap-2">
          <div className="grid gap-2 items-center min-w-[300px]">
            <label htmlFor="username-input" className="text-sm font-medium">
              Username
            </label>
            <input
              id="username-input"
              name="username"
              type="text"
              className="border rounded-md p-2 w-full"
              required
            />
            <label htmlFor="password-input" className="text-sm font-medium">
              Password
            </label>
            <input
              id="password-input"
              name="password"
              type="password"
              className="border rounded-md p-2 w-full"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded-md w-full disabled:bg-gray-300 disabled:text-gray-500"
          >
            {isLoggingIn ? 'Loading...' : 'Login'}
          </button>
        </fieldset>
      </form>
    </div>
  )
}
