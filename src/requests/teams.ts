import { apiFetch } from '@/api/apiFetch.ts'
import { StatusCodes } from 'http-status-codes'
import { type Static, Type } from '@sinclair/typebox'
import { queryOptions } from '@tanstack/react-query'

export const TeamRecordSchema = Type.Object({
  id: Type.Integer(),
  shiftNr: Type.Integer(),
  name: Type.String(),
  year: Type.Integer(),
  place: Type.Union([Type.Integer(), Type.Null()]),
  captainId: Type.Union([Type.Integer(), Type.Null()]),
})

export type TeamRecord = Static<typeof TeamRecordSchema>

type ShiftTeamsAPISuccessResponse = {
  status: 'success'
  data: {
    teams: TeamRecord[]
  }
}

export const fetchShiftTeams = async (shiftNr: number) => {
  const response = await apiFetch(`/teams?shiftNr=${shiftNr}`, {
    method: 'GET',
    mode: 'cors',
    credentials: 'include',
  })

  const jsRes = await response.json()

  if (!response.ok) {
    switch (response.status) {
      case StatusCodes.UNAUTHORIZED:
        throw new Error('Ligipääsuks pead olema autenditud!')
      default:
        console.error(jsRes)
        throw new Error('Ootamatu viga: rohkem infot konsoolis.')
    }
  }

  return (jsRes as ShiftTeamsAPISuccessResponse).data.teams
}

export const shiftTeamsFetchQueryOptions = (shiftNr: number) =>
  queryOptions({
    queryKey: ['teams', shiftNr],
    queryFn: () => fetchShiftTeams(shiftNr),
  })
