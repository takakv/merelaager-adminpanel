import { create } from 'zustand'

export type User = {
  name: string
  nickname: string
  email: string
  currentShift: number
}

type AuthState = {
  isLoading: boolean
  user: User | null
  login: (username: string, password: string) => Promise<void>
  logout: () => Promise<void>
  fetchUser: () => Promise<void>
}

type UserAuthData = {
  status: 'success'
  data: {
    userId: number
    name: string
    nickname: string
    email: string
    currentShift: number
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoading: true,
  user: null,
  fetchUser: async () => {
    const response = await fetch('http://localhost:4000/api/auth/me', {
      mode: 'cors',
      credentials: 'include',
    })

    if (!response.ok) {
      set({ isLoading: false })
      return
    }

    console.log('I fetched the user!')

    const jsRes: UserAuthData = await response.json()
    const { name, nickname, email, currentShift } = jsRes.data
    set({ isLoading: false, user: { name, nickname, email, currentShift } })
  },
  login: async (username: string, password: string) => {
    const response = await fetch('http://localhost:4000/api/auth/login', {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })

    if (!response.ok) {
      const jsres = await response.json()
      let error: string

      if (jsres.status === 'fail') {
        error = jsres.data.message
      } else {
        error = jsres.message
      }

      throw new Error(error)
    }

    const jsRes: UserAuthData = await response.json()
    const { name, nickname, email, currentShift } = jsRes.data
    set({ user: { name, nickname, email, currentShift } })
  },
  logout: async () => {
    await fetch('http://localhost:4000/api/auth/logout', {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
    })
    set({ user: null })
  },
}))
