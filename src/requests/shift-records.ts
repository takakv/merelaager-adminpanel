import { type Static, Type } from '@sinclair/typebox'
import { apiFetch } from '@/api/apiFetch.ts'
import { StatusCodes } from 'http-status-codes'
import { queryOptions } from '@tanstack/react-query'

const CamperRecordSchema = Type.Object({
  id: Type.Number(),
  childId: Type.Number(),
  childName: Type.String(),
  childSex: Type.Union([Type.Literal('M'), Type.Literal('F')]),
  shiftNr: Type.Integer(),
  year: Type.Integer(),
  tentNr: Type.Union([Type.Integer(), Type.Null()]),
  teamId: Type.Union([Type.Integer(), Type.Null()]),
  isPresent: Type.Boolean(),
})

export type CamperRecord = Static<typeof CamperRecordSchema>

type ShiftRecordsAPISuccessResponse = {
  status: 'success'
  data: {
    records: CamperRecord[]
  }
}

export const fetchShiftRecords = async (shiftNr: number) => {
  const response = await apiFetch(`/shifts/${shiftNr}/records`, {
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

  return (jsRes as ShiftRecordsAPISuccessResponse).data.records
}

export const shiftRecordsFetchQueryOptions = (shiftNr: number) =>
  queryOptions({
    queryKey: ['records', shiftNr],
    queryFn: () => fetchShiftRecords(shiftNr),
  })
