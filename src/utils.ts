import { useAuthStore, type User } from '@/stores/authStore.ts'

export async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const getUserId = () => {
  const user = useAuthStore.getState().user as User
  return user.userId
}

export const getUserShift = () => {
  const user = useAuthStore.getState().user as User
  return user.currentShift
}

export const getUserShifts = () => {
  const user = useAuthStore.getState().user as User
  return user.managedShifts
}
