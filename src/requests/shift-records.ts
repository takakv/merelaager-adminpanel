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
  ageAtCamp: Type.Integer(),
})

const PatchRecordSchema = Type.Partial(
  Type.Object({
    teamId: Type.Union([Type.Integer(), Type.Null()]),
    tentNr: Type.Union([Type.Integer(), Type.Null()]),
    isPresent: Type.Boolean(),
  }),
)

export type CamperRecord = Static<typeof CamperRecordSchema>

export type RecordPatchObject = Static<typeof PatchRecordSchema>

export type RecordPathKeys = keyof RecordPatchObject

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

export const patchShiftRecord = async (
  recordId: number,
  patch: RecordPatchObject,
) => {
  const response = await apiFetch(`/records/${recordId}`, {
    method: 'PATCH',
    mode: 'cors',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch),
  })

  if (!response.ok) {
    const jsRes = await response.json()
    switch (response.status) {
      case StatusCodes.NOT_FOUND:
        throw new Error(jsRes.data.recordId)
      case StatusCodes.FORBIDDEN:
        throw new Error(jsRes.data.permissions)
      case StatusCodes.UNPROCESSABLE_ENTITY:
        // The frontend does not allow patching multiple values at once.
        if (jsRes.data.tentNr !== undefined) {
          throw new Error(jsRes.data.tentNr)
        }
        if (jsRes.data.teamId !== undefined) {
          throw new Error(jsRes.data.teamId)
        }
        console.error(jsRes)
        throw new Error('Ootamatu viga: rohkem infot konsoolis.')
      default:
        console.error(jsRes)
        throw new Error('Ootamatu viga: rohkem infot konsoolis.')
    }
  }
}

export const shiftRecordsFetchQueryOptions = (shiftNr: number) =>
  queryOptions({
    queryKey: ['records', shiftNr],
    queryFn: () => fetchShiftRecords(shiftNr),
  })
