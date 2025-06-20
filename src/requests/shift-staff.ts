import { queryOptions } from '@tanstack/react-query'
import { StatusCodes } from 'http-status-codes'
import { type Static, Type } from '@sinclair/typebox'

import { apiFetch } from '@/api/apiFetch.ts'

export const ShiftStaffSchema = Type.Object({
  id: Type.Integer(),
  shiftNr: Type.Integer(),
  year: Type.Integer(),
  name: Type.String(),
  role: Type.String(),
  userId: Type.Union([Type.Null(), Type.Integer()]),
})

export type ShiftStaffMember = Static<typeof ShiftStaffSchema>

type ShiftStaffAPISuccessResponse = {
  status: 'success'
  data: {
    staff: ShiftStaffMember[]
  }
}

export const fetchShiftStaff = async (
  shiftNr: number,
): Promise<ShiftStaffMember[]> => {
  const response = await apiFetch(`/shifts/${shiftNr}/staff`, {
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

  return (jsRes as ShiftStaffAPISuccessResponse).data.staff
}

export const shiftStaffFetchQueryOptions = (shiftNr: number) =>
  queryOptions({
    queryKey: ['staff', shiftNr],
    queryFn: () => fetchShiftStaff(shiftNr),
  })
