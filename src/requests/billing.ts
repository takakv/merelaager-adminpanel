import { queryOptions } from '@tanstack/react-query'
import { StatusCodes } from 'http-status-codes'
import { type Static, Type } from '@sinclair/typebox'

import { apiFetch } from '@/api/apiFetch.ts'

export const ChildBillSchema = Type.Object({
  childName: Type.String(),
  pricePaid: Type.Integer(),
  priceToPay: Type.Integer(),
  billNr: Type.Integer(),
  shiftNr: Type.Integer(),
  billSent: Type.Boolean(),
})

export const ParentBillSchema = Type.Object({
  name: Type.String(),
  email: Type.String(),
  billNr: Type.Integer(),
  records: Type.Array(ChildBillSchema),
})

export type ChildBillData = Static<typeof ChildBillSchema>

export type ParentBillData = Static<typeof ParentBillSchema>

export const sendBill = async (email: string) => {
  const response = await apiFetch(`/notifications/bills`, {
    method: 'POST',
    mode: 'cors',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  })

  if (response.ok) return

  const jsRes = await response.json()

  switch (response.status) {
    case StatusCodes.UNAUTHORIZED:
      throw new Error('Ligipääsuks pead olema autenditud!')
    case StatusCodes.FORBIDDEN:
      throw new Error(jsRes.data.permissions)
    case StatusCodes.INTERNAL_SERVER_ERROR:
      throw new Error(jsRes.message)
    case StatusCodes.NOT_FOUND:
      if (jsRes.data.email !== undefined) {
        throw new Error(jsRes.data.email)
      }
      if (jsRes.data.registrations !== undefined) {
        throw new Error(jsRes.data.registrations)
      }
    // fallthrough
    default:
      console.error(jsRes)
      throw new Error('Ootamatu viga: rohkem infot konsoolis.')
  }
}

export const generateBill = async (email: string) => {
  const response = await apiFetch(`/bills`, {
    method: 'POST',
    mode: 'cors',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  })

  if (response.ok) return

  const jsRes = await response.json()

  switch (response.status) {
    case StatusCodes.UNAUTHORIZED:
      throw new Error('Ligipääsuks pead olema autenditud!')
    case StatusCodes.NOT_FOUND:
      if (jsRes.data.email !== undefined) {
        throw new Error(jsRes.data.email)
      }
      if (jsRes.data.registrations !== undefined) {
        throw new Error(jsRes.data.registrations)
      }
      if (jsRes.data.permissions !== undefined) {
        throw new Error(jsRes.data.permissions)
      }
      console.error(jsRes)
      throw new Error('Ootamatu viga: rohkem infot konsoolis.')
    case StatusCodes.INTERNAL_SERVER_ERROR:
      throw new Error(jsRes.message)
    default:
      console.error(jsRes)
      throw new Error('Ootamatu viga: rohkem infot konsoolis.')
  }
}

export const fetchBillPdf = async (billNr: number) => {
  const response = await apiFetch(`/bills/${billNr}`, {
    method: 'GET',
    mode: 'cors',
    credentials: 'include',
  })

  if (!response.ok) {
    const jsRes = await response.json()
    switch (response.status) {
      case StatusCodes.UNAUTHORIZED:
        throw new Error('Ligipääsuks pead olema autenditud!')
      case StatusCodes.NOT_FOUND:
        throw new Error(jsRes.data.billId)
      case StatusCodes.FORBIDDEN:
        throw new Error(jsRes.data.permissions)
      default:
        console.error(jsRes)
        throw new Error('Ootamatu viga: rohkem infot konsoolis.')
    }
  }

  return response.blob()
}

type ShiftBillingAPISuccessResponse = {
  status: 'success'
  data: {
    records: ParentBillData[]
  }
}

export const fetchShiftBilling = async (shiftNr: number) => {
  const response = await apiFetch(`/shifts/${shiftNr}/billing`, {
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

  return (jsRes as ShiftBillingAPISuccessResponse).data.records
}

export const shiftBillingFetchQueryOptions = (shiftNr: number) =>
  queryOptions({
    queryKey: ['billing', shiftNr],
    queryFn: () => fetchShiftBilling(shiftNr),
  })
