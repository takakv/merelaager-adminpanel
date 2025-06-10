import { StrictMode, useEffect } from 'react'
import ReactDOM from 'react-dom/client'

import { createRouter, RouterProvider } from '@tanstack/react-router'
import { QueryClient } from '@tanstack/query-core'
import { QueryClientProvider } from '@tanstack/react-query'

import { routeTree } from './routeTree.gen'
import reportWebVitals from './reportWebVitals.ts'

import { AuthProvider } from '@/auth.tsx'
import { useAuthStore } from '@/stores/authStore.ts'

import './styles.css'

const queryClient = new QueryClient()

// Create a new router instance
const router = createRouter({
  routeTree,
  context: {
    auth: undefined!,
    queryClient,
  },
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// https://github.com/TanStack/router/discussions/1668#discussioncomment-10634735
// const authClient = Promise.withResolvers<AuthContext>()

function InnerApp() {
  // const auth = useAuth()
  //
  // useEffect(() => {
  //   if (auth.isLoading) return
  //
  //   authClient.resolve(auth)
  // }, [auth.isAuthenticated, auth.isLoading])
  const { fetchUser, isLoading } = useAuthStore()

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  if (isLoading) {
    return <p>Laen...</p>
  }

  return (
    <RouterProvider
      router={router}
      context={{ queryClient }}
      // context={{ queryClient, auth: authClient.promise }}
    />
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <InnerApp />
      </AuthProvider>
    </QueryClientProvider>
  )
}

// Render the app
const rootElement = document.getElementById('app')
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
