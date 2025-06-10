// import * as React from 'react'
// import { flushSync } from 'react-dom'
//
// type User = {
//   name: string
//   nickname: string
//   email: string
//   currentShift: number
// }
//
// export interface AuthContext {
//   isAuthenticated: boolean
//   isLoading: boolean
//   login: (username: string, password: string) => Promise<string | null>
//   logout: () => Promise<void>
//   user: User | null
// }
//
// type UserAuthData = {
//   status: 'success'
//   data: {
//     userId: number
//     name: string
//     nickname: string
//     email: string
//     currentShift: number
//   }
// }
//
// const AuthContext = React.createContext<AuthContext | null>(null)
//
// const getStoredUser = async (): Promise<User | null> => {
//   const res = await fetch('http://localhost:4000/api/auth/me', {
//     mode: 'cors',
//     credentials: 'include',
//   })
//
//   if (!res.ok) return null
//
//   const jsRes: UserAuthData = await res.json()
//   const { name, nickname, email, currentShift } = jsRes.data
//   return { name, nickname, email, currentShift }
// }
//
// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [user, setUser] = React.useState<User | null>(null)
//   const [isAuthenticated, setIsAuthenticated] = React.useState(false)
//   const [isLoading, setIsLoading] = React.useState(true)
//
//   React.useEffect(() => {
//     const fetchAuth = async () => {
//       const userObject = await getStoredUser()
//       if (userObject) {
//         console.log('This set')
//         setUser(userObject)
//         setIsAuthenticated(true)
//       }
//       setIsLoading(false)
//     }
//
//     fetchAuth()
//   }, [])
//
//   const logout = React.useCallback(async () => {
//     await fetch('http://localhost:4000/api/auth/logout', {
//       method: 'POST',
//       mode: 'cors',
//       credentials: 'include',
//     })
//     setUser(null)
//     setIsAuthenticated(false)
//   }, [])
//
//   const login = React.useCallback(
//     async (username: string, password: string) => {
//       const response = await fetch('http://localhost:4000/api/auth/login', {
//         method: 'POST',
//         mode: 'cors',
//         credentials: 'include',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ username, password }),
//       })
//
//       if (!response.ok) {
//         const jsres = await response.json()
//         let error: string
//
//         if (jsres.status === 'fail') {
//           error = jsres.data.message
//         } else {
//           error = jsres.message
//         }
//
//         return error
//       }
//
//       const jsRes: UserAuthData = await response.json()
//       const { name, nickname, email, currentShift } = jsRes.data
//       setUser({ name, nickname, email, currentShift })
//       flushSync(() => {
//         setIsAuthenticated(true)
//       })
//       console.log('Flushed:', isAuthenticated)
//       console.log('auth.tsx:', 'login success')
//       return null
//     },
//     [],
//   )
//
//   return (
//     <AuthContext.Provider
//       value={{ isAuthenticated, isLoading, user, login, logout }}
//     >
//       {children}
//     </AuthContext.Provider>
//   )
// }
//
// export function useAuth() {
//   const context = React.useContext(AuthContext)
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider')
//   }
//   return context
// }

import * as React from 'react'
import { sleep } from '@/utils.ts'
import { flushSync } from 'react-dom'

export interface AuthContext {
  isAuthenticated: boolean
  isLoading: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => Promise<void>
  user: string | null
}

const AuthContext = React.createContext<AuthContext | null>(null)

const key = 'tanstack.auth.user'

const getStoredUser = async () => {
  return localStorage.getItem(key)
}

function setStoredUser(user: string | null) {
  if (user) {
    localStorage.setItem(key, user)
  } else {
    localStorage.removeItem(key)
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<string | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const isAuthenticated = !!user

  React.useEffect(() => {
    const getUser = async () => {
      const storedUser = await getStoredUser()
      //flushSync(() => {
      //})
      flushSync(() => {
        setUser(storedUser)
        setIsLoading(false)
      })
    }

    getUser()
  }, [])

  const logout = React.useCallback(async () => {
    await sleep(250)

    setStoredUser(null)
    setUser(null)
  }, [])

  const login = React.useCallback(async (username: string, _: string) => {
    await sleep(500)

    flushSync(() => {
      setStoredUser(username)
      setUser(username)
    })
  }, [])

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isLoading, user, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = React.useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
