import { create } from 'zustand'
import { type Static, Type } from '@sinclair/typebox'

import { apiFetch } from '@/api/apiFetch.ts'

export const UserInfoSchema = Type.Object({
  userId: Type.Integer(),
  name: Type.String(),
  nickname: Type.Union([Type.String(), Type.Null()]),
  email: Type.Union([Type.String(), Type.Null()]),
  currentShift: Type.Integer(),
  isRoot: Type.Boolean(),
  managedShifts: Type.Array(Type.Integer()),
})

export type User = {
  userId: number
  name: string
  nickname: string | null
  email: string | null
  currentShift: number
  isRoot: boolean
  managedShifts: number[]
}

type AuthState = {
  isLoading: boolean
  user: User | null
  login: (username: string, password: string) => Promise<void>
  logout: () => Promise<void>
  fetchUser: () => Promise<void>
}

type UpdateAction = {
  updateCurrentShift: (newShift: User['currentShift']) => void
}

type UserAuthData = {
  status: 'success'
  data: Static<typeof UserInfoSchema>
}

export const useAuthStore = create<AuthState & UpdateAction>((set) => ({
  isLoading: true,
  user: null,
  fetchUser: async () => {
    const response = await apiFetch('/auth/me', {
      mode: 'cors',
      credentials: 'include',
    })

    if (!response.ok) {
      set({ isLoading: false })
      return
    }

    console.log('I fetched the user!')

    const jsRes: UserAuthData = await response.json()
    const {
      userId,
      name,
      nickname,
      email,
      currentShift,
      isRoot,
      managedShifts,
    } = jsRes.data
    set({
      isLoading: false,
      user: {
        userId,
        name,
        nickname,
        email,
        currentShift,
        isRoot,
        managedShifts,
      },
    })
  },
  login: async (username: string, password: string) => {
    const response = await apiFetch('/auth/login', {
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
    const {
      userId,
      name,
      nickname,
      email,
      currentShift,
      isRoot,
      managedShifts,
    } = jsRes.data
    set({
      user: {
        userId,
        name,
        nickname,
        email,
        currentShift,
        isRoot,
        managedShifts,
      },
    })
  },
  logout: async () => {
    await apiFetch('/auth/logout', {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
    })
    set({ user: null })
  },
  updateCurrentShift: (newShift) => {
    set((state) => {
      if (!state.user) return state
      return { ...state, user: { ...state.user, currentShift: newShift } }
    })
  },
}))
