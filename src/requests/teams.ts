import { StatusCodes } from 'http-status-codes'
import { type Static, Type } from '@sinclair/typebox'
import { queryOptions } from '@tanstack/react-query'

import { apiFetch } from '@/api/apiFetch.ts'

const TeamRecordSchema = Type.Object({
  id: Type.Integer(),
  shiftNr: Type.Integer(),
  name: Type.String(),
  year: Type.Integer(),
  place: Type.Union([Type.Integer(), Type.Null()]),
  captainId: Type.Union([Type.Integer(), Type.Null()]),
})

const TeamCreationSchema = Type.Object({
  shiftNr: Type.Integer(),
  name: Type.String(),
})

export type TeamRecord = Static<typeof TeamRecordSchema>

export type TeamCreationData = Static<typeof TeamCreationSchema>

type ShiftTeamsAPISuccessResponse = {
  status: 'success'
  data: {
    teams: TeamRecord[]
  }
}

export const createShiftTeam = async (shiftNr: number, teamName: string) => {
  const response = await apiFetch(`/teams`, {
    method: 'POST',
    mode: 'cors',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      shiftNr,
      name: teamName,
    }),
  })

  if (response.status === StatusCodes.CREATED) return

  const jsRes = await response.json()

  if (!response.ok) {
    switch (response.status) {
      case StatusCodes.UNAUTHORIZED:
        throw new Error('Ligipääsuks pead olema autenditud!')
      case StatusCodes.UNPROCESSABLE_ENTITY:
        throw new Error(jsRes.data.name)
      default:
        console.error(jsRes)
        throw new Error('Ootamatu viga: rohkem infot konsoolis.')
    }
  }

  throw new Error('Ootamatu vastus serverilt. Palun anna Taanielile teada.')
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
