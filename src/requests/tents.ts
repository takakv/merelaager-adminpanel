import { queryOptions } from '@tanstack/react-query'
import { type Static, Type } from '@sinclair/typebox'
import { StatusCodes } from 'http-status-codes'

import { apiFetch } from '@/api/apiFetch.ts'

export const TentScoreSchema = Type.Object({
  score: Type.Number(),
  createdAt: Type.String(),
  tentNr: Type.Number(),
})

export const TentInfoSchema = Type.Object({
  campers: Type.Array(Type.String()),
  scores: Type.Array(TentScoreSchema),
})

export type TentInfo = Static<typeof TentInfoSchema>

export type TentScore = Static<typeof TentScoreSchema>

type TentAPISuccessResponse = {
  status: 'success'
  data: TentInfo
}

type TentsAPISuccessResponse = {
  status: 'success'
  data: {
    scores: TentScore[]
  }
}

export const fetchTentInfo = async (shiftNr: number, tentNr: number) => {
  const response = await apiFetch(`/shifts/${shiftNr}/tents/${tentNr}`, {
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

  return (jsRes as TentAPISuccessResponse).data
}

export const fetchTentScores = async (shiftNr: number) => {
  const response = await apiFetch(`/shifts/${shiftNr}/tents`, {
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

  if (response.ok) return (jsRes as TentsAPISuccessResponse).data.scores
}

export const addTentScore = async (
  shiftNr: number,
  tentNr: number,
  score: number,
) => {
  const response = await apiFetch(`/shifts/${shiftNr}/tents/${tentNr}`, {
    method: 'POST',
    mode: 'cors',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ score }),
  })

  const jsRes = await response.json()
  if (response.ok) return jsRes.data as TentScore

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

export const shiftTentFetchQueryOptions = (shiftNr: number, tentNr: number) =>
  queryOptions({
    queryKey: ['tent', shiftNr, tentNr],
    queryFn: () => fetchTentInfo(shiftNr, tentNr),
  })

export const shiftTentsFetchQueryOptions = (shiftNr: number) =>
  queryOptions({
    queryKey: ['tents', shiftNr],
    queryFn: () => fetchTentScores(shiftNr),
  })
