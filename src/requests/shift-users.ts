import { StatusCodes } from 'http-status-codes'
import { queryOptions } from '@tanstack/react-query'

import { apiFetch } from '@/api/apiFetch.ts'

export type ShiftUser = {
  userId: number
  name: string
  shiftNr: number
  role: string
  roleId: number
}

type ShiftUsersAPISuccessResponse = {
  status: 'success'
  data: {
    users: ShiftUser[]
  }
}

export const fetchShiftUsers = async (
  shiftNr: number,
): Promise<ShiftUser[]> => {
  const response = await apiFetch(`/shifts/${shiftNr}/users`, {
    method: 'GET',
    mode: 'cors',
    credentials: 'include',
  })

  const jsRes = await response.json()

  if (!response.ok) {
    switch (response.status) {
      case StatusCodes.UNAUTHORIZED:
        throw new Error('Ligipääsuks pead olema autenditud!')
      case StatusCodes.FORBIDDEN:
        throw new Error(jsRes.data.permissions)
      default:
        console.error(jsRes)
        throw new Error('Ootamatu viga: rohkem infot konsoolis.')
    }
  }

  return (jsRes as ShiftUsersAPISuccessResponse).data.users
}

export const shiftUsersFetchQueryOptions = (shiftNr: number) =>
  queryOptions({
    queryKey: ['users', shiftNr],
    queryFn: () => fetchShiftUsers(shiftNr),
  })
