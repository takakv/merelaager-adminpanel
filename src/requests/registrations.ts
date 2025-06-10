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

  if (!response.ok) {
    switch (response.status) {
      case StatusCodes.UNAUTHORIZED:
        throw new NotAuthenticatedError('Ligipääsuks pead olema autenditud!')
    }
  }

  const jsRes: RegistrationsAPISuccessResponse = await response.json()
  return jsRes.data.registrations
}

export const registrationsQueryOptions = (shiftNr: number) =>
  queryOptions({
    queryKey: ['registrations', shiftNr],
    queryFn: () => fetchRegistrations(shiftNr),
  })
