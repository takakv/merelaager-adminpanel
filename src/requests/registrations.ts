import { queryOptions } from '@tanstack/react-query'
import { StatusCodes } from 'http-status-codes'

import { apiFetch } from '@/api/apiFetch.ts'

export enum Sex {
  M = 'M',
  F = 'F',
}

export type Child = {
  name: string
  sex: Sex
  currentAge: number
}

export type RegistrationEntry = {
  id: number
  childId: number
  child: Child
  shiftNr: number
  isRegistered: boolean
  regOrder: number
  isOld: boolean
  tsSize: string
  birthday?: Date
  road?: string
  county?: string
  country?: string
  pricePaid?: number
  priceToPay?: number
  notifSent?: boolean
  billId?: number
  contactName?: string
  contactNumber?: string
  contactEmail?: string
  backupTel?: string
}

type RegistrationsAPISuccessResponse = {
  status: 'success'
  data: {
    registrations: RegistrationEntry[]
  }
}

export class NotAuthenticatedError extends Error {}

export const fetchRegistrations = async (
  shiftNr: number,
): Promise<RegistrationEntry[]> => {
  const response = await apiFetch(`/registrations?shiftNr=${shiftNr}`, {
    method: 'GET',
    mode: 'cors',
    credentials: 'include',
  })

  const jsRes = await response.json()

  if (!response.ok) {
    switch (response.status) {
      case StatusCodes.UNAUTHORIZED:
        throw new NotAuthenticatedError('Ligipääsuks pead olema autenditud!')
      default:
        console.error(jsRes)
        throw new Error('Ootamatu viga: rohkem infot konsoolis.')
    }
  }

  return (jsRes as RegistrationsAPISuccessResponse).data.registrations
}

export type PatchObject = {
  pricePaid?: number
  priceToPay?: number
  isRegistered?: boolean
}

export type PatchKeys = keyof PatchObject

export const patchRegistrations = async (regId: number, patch: PatchObject) => {
  const response = await apiFetch(`/registrations/${regId}`, {
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
        throw new Error(jsRes.data.message)
      default:
        console.error(jsRes)
        throw new Error('Ootamatu viga: rohkem infot konsoolis.')
    }
  }
}

export const registrationsQueryOptions = (shiftNr: number) =>
  queryOptions({
    queryKey: ['registrations', shiftNr],
    queryFn: () => fetchRegistrations(shiftNr),
  })
